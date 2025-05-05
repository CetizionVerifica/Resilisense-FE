import React, {useEffect, useState, useReducer} from 'react'
import {Row, Col, Select, Button, Spin} from 'antd'
import {withRouter} from 'react-router-dom'
import {withApollo} from 'react-apollo'
import _ from 'lodash'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {fetchProjects} from '../../graphql/fetchProjects'
import fetchGapAnalysisQuery from '../../graphql/fetchGapAnalysis'
import fetchMateriality from '../../graphql/fetchMateriality'
import fetchCompany from '../../graphql/fetchCompanyByProject'
import LayoutWrapper from '../utility/layoutWrapper'
import PageHeader from '../utility/pageHeader'
import basicStyle from '../../common/basicStyle'
import Box from '../utility/box'
import CoreSubjectOverallPerformance from '../gapAnalysis/report/CoreSubjectOverallPerformance'
import MatrixCoreSubjectsPerformance from '../materialityAssessment/report/MatrixCoreSubjectsPerformance'
import ActionAndKPIList from '../actionsAndKPIs/ActionAndKPIList'
import {breadcrumbUpdate, projectSelectTab} from '../../actions'
const {Option} = Select

const initialState = {
  gabAnalysis: {
    btnBeginAssestment: false,
  },
  materiality: {
    btnBeginAssestment: false,
  },
  targetActions: {
    btnBeginAssestment: false,
    newAction: false,
  },
}

const reducer = (state=initialState, action) => {
  switch(action.type) {
    case 'change_button_status':
      const obj = {...state};
      if (action.lisences.includes('gap')) {
        obj.gabAnalysis.btnBeginAssestment = true;
      }
      if (action.lisences.includes('materiality')) {
        obj.materiality.btnBeginAssestment = true;
      }
      if (action.lisences.includes('actions')) {
        obj.targetActions.btnBeginAssestment = true;
        obj.targetActions.newAction = true;
      }
      return obj;
    default:
      return state;     
  }
}

function Performance(props) {
  const [projectStatus, setProjectStatus] = useState('New')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [gapAnalysis, setGapAnalysis] = useState(null)
  const [materiality, setMateriality] = useState(null)
  const [actionAndKPI, setActionAndKPI] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [state, dispatch] = useReducer(reducer, initialState);

  const {rowStyle, colStyle, gutter} = basicStyle
  useEffect(() => {
    if (props.breadcrumbUpdate) {
      const breadcrumb = [{name: 'Home', link: '/'},
        {
          name: 'Performance',
          link: '/performance',
        },
      ]
      props.breadcrumbUpdate(breadcrumb)
    }
  }, [props.breadcrumbUpdate])

  useEffect(() => {
    setLoading(true)

    props.client.query({query: fetchProjects}).then(res => {
      // console.log("Performance......", fetchProjects, res.data.projects)

      const project = res.data.projects

      const sorted = _.reverse(_.sortBy(project, (project) => {
        const date = new Date(project.updatedDate)
        return date
      }))

      const selectedProject = sorted.length > 0 ? sorted[0].id : null;
      if (selectedProject) {
        setSelectedProject(sorted[0].id);
        setProjectStatus(sorted[0].status);
      }

      setProjects(sorted);

      async function fetchProjectDetail() {
        try {
          const fetchGapAnalysisResult = await props.client.query({query: fetchGapAnalysisQuery, variables: {id: sorted[0].gapAnalysis.id}})
          const fetchMaterialityResult = await props.client.query({query: fetchMateriality, variables: {id: sorted[0].materiality.id}})
          const fetchCompanyResult = await props.client.query({query: fetchCompany, variables: {project: selectedProject}});
          
          // console.log("Project:", selectedProject);
          // console.log("Test:", fetchCompanyResult.data.projectCompany)
          
          // disable buttons for the sections that lisence not exist 
          dispatch({
            type: "change_button_status",
            lisences: fetchCompanyResult.data.projectCompany.lisence
          })

          fetchGapAnalysisResult && setGapAnalysis(fetchGapAnalysisResult.data.gapAnalysis)
          fetchMaterialityResult && setMateriality(fetchMaterialityResult.data.materiality)
          const actionsAndKPIs = {
            companyId: project[0].company.id,
            projectId: project[0].id,
            projectYear: project[0].year,
            materialityId: project[0].materiality.id,
          }
          setActionAndKPI(actionsAndKPIs)
          setLoading(false)
        } catch (error) {
          // console.log("err:", error)
          setLoading(false)
        }
      }
      fetchProjectDetail()
    })
  }, [])

  async function handleChange(projectId) {
    setLoading(true)
    setSelectedProject(projectId)
    const project = projects.filter(item => item.id === projectId)
    setProjectStatus(project.status)

    try {
      const fetchGapAnalysisResult = await props.client.query({query: fetchGapAnalysisQuery, variables: {id: project[0].gapAnalysis.id}})
      const fetchMaterialityResult = await props.client.query({query: fetchMateriality, variables: {id: project[0].materiality.id}})

      fetchGapAnalysisResult && setGapAnalysis(fetchGapAnalysisResult.data.gapAnalysis)
      fetchMaterialityResult && setMateriality(fetchMaterialityResult.data.materiality)
      const actionsAndKPIs = {
        companyId: project[0].company.id,
        projectId: project[0].id,
        projectYear: project[0].year,
        materialityId: project[0].materiality.id,
      }
      setActionAndKPI(actionsAndKPIs)
      setLoading(false)
    } catch (error) {
      // console.log("Error:", error)
      setLoading(false)
    }
  }

  return (
    <LayoutWrapper>
      <PageHeader><span>Performance</span> </PageHeader>
      <Row style={rowStyle} justify="space-between" gutter={gutter}>
        <Col md={24} sm={24} xs={24} style={colStyle}>
          <Box style={{display: 'flex', justifyContent: 'flex-end'}} >
            <div>
              <div>Projects:</div>
              {/* {console.log("PROJECTS::::", projects)} */}
              {<Select value={selectedProject} onChange={handleChange} style={{width: 200}} >
                {projects.map((project, index) => {
                  return <Option key={project.id} value={project.id}>{project.title}</Option>
                })}
              </Select>
              }
            </div>
          </Box>
        </Col>
        {loading ? <Spin size="large" style={{margin: 'auto'}} /> : <React.Fragment>
          {gapAnalysis &&
          <Col md={12} sm={24} xs={24} style={colStyle}>
            <Box style={{display: 'flex', justifyContent: 'flex-end'}} >
              <Wrapper>
                <Title>
                  Gap Analysis
                  {projectStatus === 'New' ? <Button disabled={!state.gabAnalysis.btnBeginAssestment} onClick={() => {
                    props.history.push(`project/${selectedProject}`)
                    props.projectSelectTab('1')
                  }} type="primary"
                  >
                    Begin Assessment
                  </Button> : <Button onClick={() => {
                    props.history.push(`project/${selectedProject}`)
                    props.projectSelectTab('1')
                  }} type="primary"
                  >
                    View full results
                  </Button>}
                </Title>
                <CoreSubjectOverallPerformance gapAnalysis={gapAnalysis} noTable />
              </Wrapper>
            </Box>
          </Col>
          }
          {materiality &&
          <Col md={12} sm={24} xs={24} style={colStyle}>
            <Box style={{display: 'flex', justifyContent: 'flex-end'}} >
              <Wrapper>
                <Title>
                  Materiality Assessments
                  {projectStatus === 'New' ? <Button disabled={!state.materiality.btnBeginAssestment} onClick={() => {
                    props.history.push(`project/${selectedProject}`)
                    props.projectSelectTab('2')
                  }} type="primary"
                  >
                    Begin Assessment
                  </Button> : <Button onClick={() => {
                    props.history.push(`project/${selectedProject}`)
                    props.projectSelectTab('2')
                  }} type="primary"
                  >
                    View full results
                  </Button>}
                </Title>
                 <MatrixCoreSubjectsPerformance materiality={materiality} noTable /> 
              </Wrapper>
            </Box>
          </Col>
          }
          {actionAndKPI && <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box style={{display: 'flex', justifyContent: 'flex-end'}} >
              <Wrapper>
                <Title>
                  Targets - Actions & KPIs
                  {projectStatus === 'New' ? <Button disabled={!state.targetActions.btnBeginAssestment} onClick={() => {
                    props.history.push(`project/${selectedProject}`)
                    props.projectSelectTab('3')
                  }} type="primary"
                  >
                    Begin Assessment
                  </Button> : <Button onClick={() => {
                    props.history.push(`project/${selectedProject}`)
                    props.projectSelectTab('3')
                  }} type="primary"
                  >
                    View full results
                  </Button>}
                </Title>
                 <ActionAndKPIList
                  setNewActionEnable={state.targetActions.newAction}
                  companyId={actionAndKPI.companyId}
                  projectId={actionAndKPI.projectId}
                  projectYear={actionAndKPI.projectYear}
                  materialityId={actionAndKPI.materialityId}
                />
              </Wrapper>
            </Box>
          </Col>}
        </React.Fragment>}

      </Row>
    </LayoutWrapper>
  )
}

const Title = styled.div`
  width: 100%;
  font-weight: bold;
  font-size: 2em;
  display: flex;
  justify-content: space-between
`
const Wrapper = styled.div`
  height: 100%;
  width: 100%
`

export default connect(null, {breadcrumbUpdate, projectSelectTab})(withApollo(withRouter(Performance)))

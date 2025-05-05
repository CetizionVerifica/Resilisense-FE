import React, {useEffect, useState, useReducer} from 'react'
import {Row, Col, Select, Button, Spin, Dropdown} from 'antd'
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
import ActionAndKPIDashboard from '../actionsAndKPIs/ActionAndKPIDashboard'
import {breadcrumbUpdate, projectSelectTab} from '../../actions'
import HorizontalTimeline from './components/horizontal_timeline'
import CONFIGURATION from './configuration'
import {projectStatuses} from '../../common/enum/projectStatuses'

const {Option} = Select

const initialState = {
  gabAnalysis: {
    beginAssestment: null,
  },
  materiality: {
    beginAssestment: null,
  },
  targetActions: {
    beginAssestment: null,
    newAction: null,
  },
}

const reducer = (state=initialState, action) => {
  switch(action.type) {
    case 'set_company_licenses':
      const obj = { ...state };
      if (action.lisences.includes('gap')) {
        obj.gabAnalysis.beginAssestment = true;
      }
      if (action.lisences.includes('materiality')) {
        obj.materiality.beginAssestment = true;
      }
      if (action.lisences.includes('actions')) {
        obj.targetActions.beginAssestment = true;
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
  const {rowStyle, colStyle, gutter} = basicStyle;

  async function loadData(props){
    try {
      const response = await props.client.query({query: fetchProjects});
      const project = response.data.projects;
  
      const sorted = _.reverse(_.sortBy(project, (project) => {
        const date = new Date(project.updatedDate)
        return date
      }));
      
      setProjects(sorted);
  
      const selectedProject = sorted.length > 0 ? sorted[0].id : null;
      if (selectedProject) {
        setSelectedProject(sorted[0].id);
        setProjectStatus(sorted[0].status);
      }   
          
      const fetchGapAnalysisResult = await props.client.query({query: fetchGapAnalysisQuery, variables: {id: sorted[0].gapAnalysis.id}})
      const fetchMaterialityResult = await props.client.query({query: fetchMateriality, variables: {id: sorted[0].materiality.id}})
      const fetchCompanyResult = await props.client.query({query: fetchCompany, variables: {project: selectedProject}});
      
      // disable buttons for the sections that lisence not exist 
      dispatch({
        type: "set_company_licenses",
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
      setLoading(false)
    }      
  }

  const resumeAssestment = () => {
    props.history.push(`project/${selectedProject}`);
    if ([
      projectStatuses.new.value,
      projectStatuses.firstAssessmentRequest.value,
      projectStatuses.firstAssessmentCompleted.value,
      projectStatuses.secondAssessmentRequest.value,
    ].includes(projectStatus)  ) {
      props.projectSelectTab('1');
    }else if ([
      projectStatuses.completed.value,
      projectStatuses.meterialitysendsurvey.value,
    ].includes(projectStatus) ) { //else if project status is materiality go to materiality tab
      props.projectSelectTab('2');
    }
    else { // else go to default gab analysis
      props.projectSelectTab('3');
    }
  }

  useEffect(() => {
    if (props.breadcrumbUpdate) {
      const breadcrumb = [{name: 'Home', link: '/'},
        {
          name: 'Performance',
          link: '/',
        },
      ]
      props.breadcrumbUpdate(breadcrumb)
    }
  }, [props.breadcrumbUpdate])

  useEffect(() => {    
    loadData(props);
  }, []);

  async function handleChange(projectId) {
    setLoading(true)
    setSelectedProject(projectId)
    const project = projects.filter(item => item.id === projectId)
    setProjectStatus(project[0].status)

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

  const renderGapAnalysis = () => {

    var completed = false;

    if ([
      projectStatuses.completed.value,
      projectStatuses.meterialitysendsurvey.value,
      projectStatuses.materialitycompleted.value,
      projectStatuses.finished.value
    ].includes(projectStatus)) completed = true;

    return (
      <Col md={12} sm={24} xs={24} style={colStyle} >
        <Box style={{display: 'flex', justifyContent: 'flex-end'}} >
         <Wrapper>
            <Title>
              Gap Analysis
            </Title>
              { completed ? 
              <CoreSubjectOverallPerformance gapAnalysis={gapAnalysis} noTable /> :
              <Description>{CONFIGURATION.results_not_available}</Description>}
          </Wrapper>
        </Box>
      </Col>
    )
  }

  const renderMateriality = () => {
    var completed = false;

    if ([
      projectStatuses.materialitycompleted.value,
      projectStatuses.finished.value
    ].includes(projectStatus)) completed = true;
  
    return (
      <Col md={12} sm={24} xs={24} style={colStyle}>
        <Box style={{display: 'flex', justifyContent: 'flex-end'}} >
          <Wrapper>
            <Title>
              Materiality Assessments
            </Title>
            {completed ? <MatrixCoreSubjectsPerformance materiality={materiality} noTable /> : <Description>{CONFIGURATION.results_not_available}</Description> }
          </Wrapper>
        </Box>
      </Col>      
    )
  }

  const renderActionKPI = () => {
    var completed = false;

    if ([
 
      projectStatuses.finished.value

    ].includes(projectStatus)) completed = true;
      
    return (
      <Col md={24} sm={24} xs={24} style={colStyle}>
        <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
          <Wrapper>
            <Title>
              Targets - Actions & KPIs
            </Title>
             {completed ? <ActionAndKPIDashboard
              setNewActionEnable={state.targetActions.newAction}
              companyId={actionAndKPI.companyId}
              projectId={actionAndKPI.projectId}
              projectYear={actionAndKPI.projectYear}
              materialityId={actionAndKPI.materialityId}
             /> : <Description>{CONFIGURATION.results_not_available}</Description> }
          </Wrapper>
        </Box>
      </Col>      
    )
  }

  return (
    <LayoutWrapper style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      {gapAnalysis && state.gabAnalysis.beginAssestment && materiality && state.materiality.beginAssestment 
       && actionAndKPI && state.targetActions.beginAssestment ? <LayoutWrapper>
      <Row style={rowStyle} justify="space-between" gutter={gutter} >
        <Col md={12} sm={12} xs={12} style={colStyle}>
          <PageHeader style={{display: 'flex', justifyContent: 'flex-start'}}>
            <span>Performance</span>
          </PageHeader>             
        </Col> 
        <Col md={12} sm={12} xs={12} >  
          <div style={{display: 'flex', justifyContent: 'flex-end'}} >
            <div>
              <div>Projects:</div>
              <DropdownMenu elements={projects} handleChange={handleChange} selectedItem={selectedProject} />
            </div>            
          </div>       
        </Col>          
      </Row>
      
      <Row style={rowStyle} justify="space-between" gutter={gutter}>      
        <Col md={24} sm={24} xs={24} style={colStyle}>
          <Box style={{display: 'flex', justifyContent: 'flex-end'}} >
            <Wrapper>
              <Title>Project Completion Status</Title>
              <HorizontalTimeline projectStatus={projectStatus} hasGabAnalysis={state.gabAnalysis.beginAssestment} hasMateriality={state.materiality.beginAssestment} hasTargetActions={state.targetActions.beginAssestment} />
            </Wrapper>                        
          </Box>
        </Col> 
        <Col md={24} sm={24} xs={24} style={colStyle}>
          <Button onClick={resumeAssestment} type="primary">
                {projectStatus === projectStatuses.new.value ? 'Begin Assessment' : 'Resume Assessment' }  
          </Button> 
        </Col>              
        <React.Fragment style={{justifyContent: 'center', alignItems: 'center'}}>
          {renderGapAnalysis()}
          {renderMateriality()}
          {renderActionKPI()}
        </React.Fragment>        
      </Row> 
    </LayoutWrapper> : <Spin size="large" style={{margin: 'auto'}} /> }
    </LayoutWrapper>  
    )
}

const DropdownMenu = ({elements, handleChange, selectedItem}) => {
  return (
    <Select value={selectedItem} onChange={handleChange} style={{width: 200}} >
      {elements.map((obj, index) => {
        return <Option key={obj.id} value={obj.id}>{obj.title}</Option>
      })}
    </Select>
  )
}

const Title = styled.div`
  width: 100%;
  font-weight: bold;
  font-size: 2em;
  display: flex;
  justify-content: space-between
`

const Description = styled.div`
  width: 100%;
  font-size: 1.5em;
  display: flex;
  padding: 3em;
  justify-content: space-between
`

const Wrapper = styled.div`
  height: 100%;
  width: 100%
`

export default connect(null, {breadcrumbUpdate, projectSelectTab})(withApollo(withRouter(Performance)))

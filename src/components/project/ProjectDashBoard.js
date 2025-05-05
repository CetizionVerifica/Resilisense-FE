import React, {Component} from 'react'
import {get} from 'lodash'
import moment from 'moment'
import {Tabs, Row, Col, Card, message, notification, Form, Button} from 'antd'
import {reduxForm, Field} from 'redux-form'
import {graphql, compose} from 'react-apollo'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import {generateYears} from '../../common/utils'
import {projectsMessages} from '../../messages'
import fetchProjectQuery from '../../graphql/fetchProject'
import {updateProject} from '../../graphql/projectMutation'
import basicStyle from '../../common/basicStyle'
import EditableInput from '../utility/EditableInput'
import EditableSelectInput from '../utility/EditableSelectInput'
import EditableDateInput from '../utility/EditableDateInput'
import PageHeader from '../utility/pageHeader'
import Box from '../utility/box'
import {breadcrumbUpdate, projectSelectTab} from '../../actions'
import LayoutWrapper from '../utility/layoutWrapper'
import ActionAndKPIList from '../actionsAndKPIs/ActionAndKPIList'
import GapList from '../gapAnalysis/GapList'
import MaterialityList from '../materialityAssessment/MaterialityList'
import ProjectSettings from './ProjectSettings'
import { projectStatuses } from '../../common/enum/projectStatuses'

const TabPane = Tabs.TabPane

class ProjectDashBoard extends Component {

  componentWillUpdate(nextprops) {
    const {fetchProjectQuery: {project}, breadcrumbUpdate} = nextprops
    if (project) {
      const breadcrumb = [{name: 'Home', link: '/'},
        {name: get(project, 'company.name'), link: `/company/${get(project, 'company.id')}`},
        {name: get(project, 'title')},
      ]
      breadcrumbUpdate(breadcrumb)
    }
  }
  shouldComponentUpdate(nextProps) {
    return !(nextProps.fetchProjectQuery.project === this.props.fetchProjectQuery.project)
  }

  handleTabChange =(v) => {
    this.props.projectSelectTab(v)
  }

  handleFormSubmit = (fields) => {
    const {fetchProjectQuery: {project}} = this.props
    this.setState({loading: true})
    this.props.updateProject({
      variables: {
        id: project.id,
        title: fields.title || project.title,
        year: fields.year || project.year,
        date: fields.date || project.date,
        ...fields,
      },
      //refetchQueries: [{query: fetchCompaniesQuery}],
    }).then(({data}) => {
      //console.log(data.addCompany.id)
      message.success('Processing complete!')
      this.setState({loading: false, visible: false})
    }).catch(({message, locations, path}) => {
      this.setState({loading: false})
      return notification.warning({
        message: 'Update Project',
        description: message,
      })
    })
    //this.props.signinUser({email, password})
  }

  render() {
    const {rowStyle, colStyle, gutter, orangeColor, greyColor} = basicStyle
    const {fetchProjectQuery: {project},
      intl: {formatMessage}, handleSubmit, selectedTab} = this.props
    const {lisence} = project ? project.company : ''
    if (!project) {
      return <div />
    }
    // console.log(project.company)
    return (
      <LayoutWrapper>
     
        {/* <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box>
              <Col md={24} sm={24} xs={24} style={colStyle}>
                <Card bordered={false}>
                  <Form>
                    <h4>
                      {formatMessage(projectsMessages.projectCompanyName)}
                      <span style={orangeColor} >
                        {get(project, 'company.name')}
                      </span>
                    </h4>
                
               
                   
                  
                    <h4> {formatMessage(projectsMessages.projectTitle)} <span style={greyColor} >
                      {get(project, 'title')}</span>
                    </h4>

                  
                    <h4> {formatMessage(projectsMessages.projectYear)} <span style={greyColor} >
                      {get(project, 'year')}</span>
                    </h4>

                  
                    <h4> {formatMessage(projectsMessages.numberOfEmployees)} <span style={greyColor} >
                      {get(project, 'numberOfEmployees')}</span>
                    </h4>

                    <h4> {formatMessage(projectsMessages.projectStartDate)} <span style={greyColor} >
                      {get(project, 'date')}</span>
                    </h4>
                   
                    <h4> {formatMessage(projectsMessages.projectEndDate)} <span style={greyColor} >
                      {get(project, 'endDate')}</span>
                    </h4>
                    
                    <h4> {formatMessage(projectsMessages.projectCreator)} <span style={greyColor} >
                      {get(project, 'createdBy.name')}</span>
                    </h4>
                    <h4>{formatMessage(projectsMessages.projectUpdateBy)} <span style={greyColor} >
                      {get(project, 'updatedBy.name')}</span>
                    </h4>
                    <h4> {formatMessage(projectsMessages.projectLastModified)} <span style={greyColor} >
                      {moment(get(project, 'updatedDate')).format('DD/MM/YYYY hh:mm')}
                    </span>
                    </h4>
                  </Form>
                </Card>

              </Col>
            </Box>
          </Col>
        </Row> */}
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box>
              {!lisence ? <React.Fragment>
                <Tabs animated={false} defaultActiveKey={selectedTab} onChange={this.handleTabChange}>
                  <TabPane tab="Gap Analysis" key="1">
                    <GapList gapAnalysis={get(project, 'gapAnalysis')} project={project} />
                  </TabPane>
                  <TabPane tab="Materiality Assessment" key="2">
                    <MaterialityList materiality={get(project, 'materiality')} projectId={get(project, 'id')} projectStatus={get(project, 'status')} />
                  </TabPane>
                  <TabPane tab="Actions & KPIs" key="3">
                    <ActionAndKPIList
                      companyId={get(project, 'company.id')}
                      projectId={get(project, 'id')}
                      projectYear={get(project, 'year')}
                      materialityId={get(project, 'materiality.id')}
                      setNewActionEnable={project.status === projectStatuses.materialitycompleted.value}
                    />
                  </TabPane>
              {/*    <TabPane tab="Review & Audit" key="4">
                    <div style={{marginRight: 30}}>
                      <Box style={{margin: 0}}>
                        <Row style={{marginBottom: 15}}>
                          <Col span={24}>
                            <Button
                              type="primary"
                              className=""
                              style={{marginRight: 15}}
                              onClick={() => this.props.history.push(`/isochecklist/${get(project, 'id')}`)}
                            >
                           ISO 26000 Audit Checklist
                            </Button>
                          </Col>
                        </Row>
                        <Row style={{marginBottom: 15}}>
                          <Col span={24} >
                            <Button
                              type="primary"
                              className=""
                              style={{marginRight: 15}}
                              onClick={() => this.props.history.push(`/annualreview/${get(project, 'id')}`)}
                            >
                           UN Global Compact Annual Review Checklist
                            </Button>
                          </Col>
                        </Row>
                      </Box>
                    </div>
                  </TabPane>

                  <TabPane tab="Settings" key="5">
                    <ProjectSettings projectId={project.id} />
                  </TabPane>
            */}
                </Tabs>
              </React.Fragment> : <React.Fragment>
                <Tabs animated={false} defaultActiveKey={selectedTab} onChange={this.handleTabChange}>
                  {lisence.includes('gap') && <TabPane tab="Gap Analysis" key="1">
                    <GapList gapAnalysis={get(project, 'gapAnalysis')} project={project} />
                  </TabPane> }
                  {lisence.includes('materiality') &&
                  <TabPane tab="Materiality Assessment" key="2">
                    <MaterialityList materiality={get(project, 'materiality')} projectId={get(project, 'id')} projectStatus={get(project, 'status')} />
                  </TabPane> }
                  {lisence.includes('actions') &&
                  <TabPane tab="Actions & KPIs" key="3">
                    <ActionAndKPIList
                      companyId={get(project, 'company.id')}
                      projectId={get(project, 'id')}
                      projectYear={get(project, 'year')}
                      materialityId={get(project, 'materiality.id')}
                      setNewActionEnable={project.status === projectStatuses.materialitycompleted.value}
                    />
                  </TabPane>
                  }
                {/*  <TabPane tab="Review & Audit" key="4">
                    <div style={{marginRight: 30}}>
                      <Box style={{margin: 0}}>
                        <Row style={{marginBottom: 15}}>
                          <Col span={24}>
                            <Button
                              type="primary"
                              className=""
                              style={{marginRight: 15}}
                              onClick={() => this.props.history.push(`/isochecklist/${get(project, 'id')}`)}
                            >
                           ISO 26000 Audit Checklist
                            </Button>
                          </Col>
                        </Row>
                        <Row style={{marginBottom: 15}}>
                          <Col span={24} >
                            <Button
                              type="primary"
                              className=""
                              style={{marginRight: 15}}
                              onClick={() => this.props.history.push(`/annualreview/${get(project, 'id')}`)}
                            >
                           UN Global Compact Annual Review Checklist
                            </Button>
                          </Col>
                        </Row>
                      </Box>
                    </div>
                  </TabPane>

                  <TabPane tab="Settings" key="5">
                    <ProjectSettings projectId={project.id} />
                  </TabPane>

                  */}
                </Tabs>
              </React.Fragment>}

            </Box>
          </Col>
        </Row>
      </LayoutWrapper>

    )
  }
}


const GraphqlProjectDashBoard = compose(
  reduxForm({
    form: 'projectForm',
    enableReinitialize: true,
  }),
  graphql(updateProject, {
    name: 'updateProject',
  }),
  graphql(fetchProjectQuery, {
    name: 'fetchProjectQuery',
    options: (props) => {return {variables: {id: props.match.params.id}}},
  }),
  connect(({project, auth}, {fetchProjectQuery}) => {
    return {
      initialValues: fetchProjectQuery.project,
      selectedTab: project.selectedTab,
    }
  }, {breadcrumbUpdate, projectSelectTab})
)(ProjectDashBoard)


export default injectIntl(GraphqlProjectDashBoard)



import React, {Component} from 'react'
import {get, filter, find, orderBy} from 'lodash'
import {Row, Col, Card, Progress, Tooltip, Button, message} from 'antd'
import {graphql, compose} from 'react-apollo'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import {createFileColumns} from './ProjectsListConfig'
import {projectsMessages} from '../../messages'
import {projectStatuses} from '../../common/enum/projectStatuses'
import {gapAnalysisQuestions} from '../../common/gapAnalysisQuestions'
import {firstAssessmentCompleted, finalAssessmentCompleted} from '../../actions/UserActions'
import fetchProjectQuery from '../../graphql/fetchProject'
import fetchProjectFilesQuery from '../../graphql/fetchGapFiles'
import {submitProjectAssessmentStatus} from '../../graphql/projectMutation'
import basicStyle from '../../common/basicStyle'
import PageHeader from '../utility/pageHeader'
import Box from '../utility/box'
import {breadcrumbUpdate, projectSelectTab} from '../../actions'
import LayoutWrapper from '../utility/layoutWrapper'
import TableWrapper from '../styles/table.style'
import FileAssessment from './FileAssessment'
import FileOverallScore from './FileOverallScore'
import {getAssessmentProgress, getFileScore} from './utility'


class ProjectAssessment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      overallScoreVisible: false,
      file: {},
      columns: createFileColumns(this.showFileAssessment, this.showFileOverallScore),
    }
  }

  componentWillUpdate(nextprops) {
    // console.log("Update: ProjectAssessment", this.state.visible);
    const {fetchProjectQuery: {project}, breadcrumbUpdate} = nextprops
    if (project) {
      const breadcrumb = [{name: 'Home', link: '/'},
        {name: get(project, 'company.name'), link: `/company/${get(project, 'company.id')}`},
        {name: get(project, 'title')},
      ]
      if (nextprops.fetchProjectQuery.project == this.props.fetchProjectQuery.project) return;
      breadcrumbUpdate(breadcrumb)
    }
  }
  
  // props change caused infinite rerender
  // shouldComponentUpdate(nextProps) {
  //   console.log("Update?" , this.state.visible)
  //   return nextProps.fetchProjectQuery.project !== this.props.fetchProjectQuery.project || this.state.visible || this.state.overallScoreVisible;
  // }

  onChange(pagination, filters, sorter) {
    if (sorter && sorter.columnKey && sorter.order) {
      if (sorter.order === 'ascend') {
        this.props.projectSorting(sorter.columnKey, 'asc')
      } else {
        this.props.projectSorting(sorter.columnKey, 'desc')
      }
    }
  }

  hideModal = () => this.setState({visible: false})

  showFileAssessment = (file) => {
    // console.log("File::::", this.state);   
    return this.setState({
      visible: true,
      file,
    })
  }

  hideFileOverallScore = () => this.setState({overallScoreVisible: false})

  showFileOverallScore = (file) => {
    // console.log("Score?", this.state)
    return this.setState({
      overallScoreVisible: true,
      file,
    })
  }

  getStatusText(status) {
    if (projectStatuses.firstAssessmentRequest.value === status) {
      return 'First Assessment'
    }

    if (projectStatuses.firstAssessmentCompleted.value === status) {
      return 'First Assessment Completed'
    }

    if (projectStatuses.secondAssessmentRequest.value === status) {
      return 'Second Assessment'
    }

    return 'Second Assessment Completed'
  }

  getNextStatus(status) {
    if (projectStatuses.firstAssessmentRequest.value === status) {
      return projectStatuses.firstAssessmentCompleted.value
    }

    if (projectStatuses.secondAssessmentRequest.value === status) {
      return projectStatuses.completed.value
    }

    return null
  }

  canSubmitFirstAssessment(status, progress) {

    if (progress !== 100) {
      return false
    }

    if (projectStatuses.firstAssessmentRequest.value === status) {
      return true
    }

    return false
  }

  canSubmitSecondAssessment(status, progress) {

    if (progress !== 100) {
      return false
    }

    if (projectStatuses.secondAssessmentRequest.value === status) {
      return true
    }

    return false
  }

  submitAssessment = () => {
    const {fetchProjectQuery: {project}, fetchProjectFilesQuery: {gapFiles}, mutate} = this.props
    const nextProjectStatus = this.getNextStatus(get(project, 'status'))

    const files = filter(gapFiles, f => f.keyConsiderations.length > 0)

    const revisingScores = []

    files.forEach(file => {
      const fileScores = file.keyConsiderations.map(kc => {
        const gapAnalysisQuest = find(gapAnalysisQuestions, {key: kc})
        const fileScore = getFileScore(file, kc)
        return {
          keyConsideration: gapAnalysisQuest.value,
          score: fileScore,
        }
      })

      revisingScores.push(...fileScores)

      // console.log("Revising scores:", revisingScores);
    })

    mutate({
      variables: {
        id: project.id,
        status: nextProjectStatus,
        revisingScores: revisingScores,
      },
    }).then(() => {

      const email = get(project, 'company.email')
      const companyName = get(project, 'company.name')
      if (nextProjectStatus === projectStatuses.firstAssessmentCompleted.value) {
        firstAssessmentCompleted(email, companyName)
      } else {
        finalAssessmentCompleted(email, companyName, project.id)
      }

      message.success('Processing complete!')
    })
  }

  render() {
    // console.log("RENDER PROJECT")
    const {rowStyle, colStyle, gutter, orangeColor, greyColor} = basicStyle
    const {fetchProjectQuery: {project}, fetchProjectFilesQuery: {gapFiles}, intl: {formatMessage}} = this.props

    if (!project) {
      return <div />
    }

    const assessmentProgress = getAssessmentProgress(gapFiles)
    const files = orderBy(filter(gapFiles, f => f.keyConsiderations.length > 0), ['assessmentComplete', 'name'], ['asc', 'asc'])

    return (
      <LayoutWrapper>
        <PageHeader>{project.title}</PageHeader>
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box>
              <Col md={24} sm={24} xs={24} style={colStyle}>
                <Card bordered={false}>
                  <h4>
                    {formatMessage(projectsMessages.projectCompanyName)} <span style={orangeColor} >
                      {get(project, 'company.name')}
                    </span>
                  </h4>
                  <h4>
                    {formatMessage(projectsMessages.projectTitle)} <span style={greyColor} >{get(project, 'title')}</span>
                  </h4>
                  <h4>
                    {formatMessage(projectsMessages.projectYear)} <span style={greyColor} >{get(project, 'year')}</span>
                  </h4>
                  <h4>
                    {formatMessage(projectsMessages.numberOfEmployees)} <span style={greyColor} >{get(project, 'numberOfEmployees')}</span>
                  </h4>
                  <h4>
                    {formatMessage(projectsMessages.assessmentStatus)} <span style={greyColor} >{this.getStatusText(get(project, 'status'))}</span>
                  </h4>
                  <div>
                    <Button
                      type="primary"
                      disabled={!this.canSubmitFirstAssessment(get(project, 'status'), assessmentProgress)}
                      style={{marginTop: 15, width: 190, height: 35}}
                      onClick={this.submitAssessment}
                      title="Submit documentation assessment"
                    >
            Submit First Assessment
                    </Button>
                    <Button
                      type="primary"
                      disabled={!this.canSubmitSecondAssessment(get(project, 'status'), assessmentProgress)}
                      style={{marginTop: 15, marginLeft: 10, width: 200, height: 35}}
                      onClick={this.submitAssessment}
                      title="Submit documentation assessment"
                    >
            Submit Second Assessment
                    </Button>
                    <Button
                      type="primary"
                      style={{marginTop: 15, marginLeft: 10, width: 200, height: 35}}
                      href={`/doc-assessment-report/${get(project, 'gapAnalysis.id')}`}
                      title="View Assessment Report"
                    >
            View Assessment Report
                    </Button>
                  </div>
                  <div style={{position: 'absolute', right: 20, top: 5}}>
                    <Tooltip placement="left" title="Overall Assessment Progress">
                      <Progress
                        type="circle" percent={assessmentProgress}
                        strokeWidth={8} width={70}
                        style={{backgroundColor: '#ffffff'}}
                        format={percent => percent + '%'}
                      />
                    </Tooltip>
                  </div>
                </Card>
              </Col>
            </Box>
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col md={24} sm={24} xs={24}>
            <TableWrapper
              size="small"
              columns={this.state.columns}
              onChange={this.onChange}
              dataSource={files}
              rowKey="id"
              className="sortingTable"
              pagination={files.length > 10}
            />
          </Col>
        </Row>
        <FileAssessment
          visible={this.state.visible}
          hideModal={this.hideModal}
          projectId={this.props.match.params.id}
          fileId={this.state.file.id}
          assessmentComplete={this.state.file.assessmentComplete}
        />
        <FileOverallScore
          visible={this.state.overallScoreVisible}
          hideModal={this.hideFileOverallScore}
          file={this.state.file}
        />
      </LayoutWrapper>
    )
  }
}

const GraphqlProjectAssessment = compose(
  graphql(fetchProjectQuery, {
    name: 'fetchProjectQuery',
    options: (props) => {return {variables: {id: props.match.params.id}}},
  }),
  graphql(fetchProjectFilesQuery, {
    name: 'fetchProjectFilesQuery',
    options: (props) => {return {variables: {projectId: props.match.params.id}}},
  }),
  graphql(submitProjectAssessmentStatus),
)(ProjectAssessment)


export default connect(null, {breadcrumbUpdate, projectSelectTab})(injectIntl(GraphqlProjectAssessment))



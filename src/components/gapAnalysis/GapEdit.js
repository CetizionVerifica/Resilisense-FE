import React, {Component} from 'react'
import {Row, Col, Tabs, Progress, Tag, Tooltip, Divider, Icon, Button} from 'antd'
import {values, filter, find, get, round} from 'lodash'
import {graphql} from 'react-apollo'
import {connect} from 'react-redux'
import styled from 'styled-components'
import scoreIcon from '../../images/score.png'
import {breadcrumbUpdate} from '../../actions'
import {projectStatuses} from '../../common/enum/projectStatuses'
import {performanceView} from '../../common/enum/performance'
import fetchGapAnalysisQuery from '../../graphql/fetchGapAnalysis'
import {coreSubjectNames} from '../../common/coreSubjectNames'
import {issueOfInterest} from '../../common/issueOfInterest'
import {overallPerformanceRelevance, gapEdit} from '../../common/tooltips'
import basicStyle from '../../common/basicStyle'
import PageHeader from '../utility/pageHeader'
import LayoutWrapper from '../utility/layoutWrapper'
import Box from '../utility/box'
import IssueOfInterestList from './IssueOfInterest'
import AddNotes from './AddNotes'
import RelateWithFile from './RelateWithFile'
import ViewPDF from './ViewPDF'
import SubmitForAssessment from './SubmitForAssessment'
import {openModal} from '../modals/modalActions'
import InfoTooltip from '../utility/InfoTooltip'
import {getTotalSettings, getCompletedSettings, getRelatedFilesPercent} from './_helper'

const TooltipWrapper = styled.div`
  position: absolute;
  top: 35px;
  right: 50px;
`

const TabPane = Tabs.TabPane
const {rowStyle, colStyle, gutter} = basicStyle
class GapEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      visible: false,
      relateWithFileVisible: false,
      viewPDF: false,
      submitForAssessmentVisible: false,
      selectedKeyConsideration: '',
      keyConsiderationNote: '',
      selectedFileId: '',
      name: '',
      filePath: '',
      assessmentRequested: false,
    }
  }
  hideModal = () => this.setState({visible: false})
  showNote = (keyConsideration, note) => {
    return this.setState({
      visible: true,
      selectedKeyConsideration: keyConsideration,
      keyConsiderationNote: note,
    })
  }

  hideSubmitForAssessmentModal = () => this.setState({submitForAssessmentVisible: false})

  hideRelateWithFileModal = () => this.setState({relateWithFileVisible: false})

  hideViewPDFModal = () => this.setState({viewPDF: false})


  showRelateWithFile = (keyConsideration, fileId, noDocument) => {
    return this.setState({
      relateWithFileVisible: true,
      selectedKeyConsideration: keyConsideration,
      selectedFileId: fileId,
      noDocument,
    })
  }
  showViewPDF = (keyConsideration, fileId, filePath, noDocument) => {
    return this.setState({
      viewPDF: true,
      selectedKeyConsideration: keyConsideration,
      selectedFileId: fileId,
      filePath: filePath,
      noDocument,
    })
  }


  componentWillUpdate(nextprops) {
    const {data: {gapAnalysis}, breadcrumbUpdate} = nextprops
    if (gapAnalysis) {
      const breadcrumb = [{name: 'Home', link: '/'},
        {
          name: get(gapAnalysis.project, 'company.name'),
          link: `/company/${get(gapAnalysis.project, 'company.id')}`,
        },
        {
          name: get(gapAnalysis.project, 'title'),
          link: `/project/${get(gapAnalysis.project, 'id')}`,
        },
        {name: 'Gap Analysis'},
      ]
      breadcrumbUpdate(breadcrumb)
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data.gapAnalysis !== this.props.data.gapAnalysis ||
      nextState !== this.state
    ) {
      return true
    } else {
      return false
    }
  }

  renderCoreSubjectResult(coreSubject) {
    return (<div style={{textAlign: 'center',
      backgroundColor: '#f7f7f7', paddingTop: 20, margin: 'auto 20px'}}
    >
      <div style={{textAlign: 'left', margin: '0px 20px'}}>
        <span style={{color: '#888'}}> Core Subject: </span>
        <span>{get(coreSubjectNames[get(coreSubject, 'coreSubject')], 'label')} </span>
        <Divider> Overview</Divider>
      </div>
      <Row style={rowStyle} justify="space-between" gutter={gutter}>
        {values(performanceView).map(item => {
          return (<Col md={11} sm={11} xs={24} style={colStyle} key={item.key}>
            <span style={{marginBottom: 10, display: 'block'}}>{item.label}: </span>
            <Tag color={item.color}>
              {round(get(coreSubject, item.value, 0) * 100, 2) }%
            </Tag>
          </Col>)
        })}
        <Col md={2} sm={2} xs={24} style={{marginTop: 25}}>
          <InfoTooltip content={overallPerformanceRelevance} />
        </Col>
      </Row>
    </div>)
  }
  renderIssueOfInterest(coreSubjectKey, coreSubject, canEditProject, canUploadFile) {
    const {data} = this.props
    const issueOfInterests = get(coreSubject, 'issueOfInterests')
    return filter(issueOfInterest, {coreSubject: coreSubjectKey}).map(issue => {
      const issueOfI = find(issueOfInterests, {issueOfInterest: issue.key})
      return (
        <div style={{margin: 20, marginBottom: 20}} key={issue.key}>

          <IssueOfInterestList
            issue={issue}
            issueOfInterest={issueOfI}
            gapAnalysisId={this.props.match.params.id}
            refetch={() => data.refetch()}
            showNote={this.showNote}
            showRelateWithFile={this.showRelateWithFile}
            showViewPDF={this.showViewPDF}
            showMissingOptions={this.state.assessmentRequested}
            canEdit={canEditProject}
            canUploadFile={canUploadFile}
          />
        </div>
      )
    })
  }

  getRemainingSetting(coreSubject, key) {
    const {files, scores} = getTotalSettings(key)
    const {uploadedFiles, withScore} = getCompletedSettings(coreSubject)
    return {
      files: files - uploadedFiles,
      scores: scores - withScore,
    }
  }

  requestAssessment = () => {
    const {data: {gapAnalysis}} = this.props
    const coreSubjects = get(gapAnalysis, 'coreSubjects')
    const remainingSettings = []

    values(coreSubjectNames).forEach(item => {
      const coreSubject = find(coreSubjects, {coreSubject: item.key})
      const remainingSetting = this.getRemainingSetting(coreSubject, item.key)

      if (remainingSetting.files !== 0 || remainingSetting.scores !== 0) {
        remainingSettings.push({key: item.key, ...remainingSetting})
      }
    })

    if (remainingSettings.length > 0) {
      this.setState({assessmentRequested: true})
      this.props.openModal('RemainingSettingsModal', {remainingSettings})
    } else {
      this.setState({submitForAssessmentVisible: true})
    }
  }

  renderTab(label, {files, scores}) {

    if (!this.state.assessmentRequested ||
      (files === 0 && scores === 0)) {
      return label
    }

    return (
      <div style={{display: 'flex'}}>
        <span>{label}</span>
        <div style={{marginLeft: 5, color: '#AF0606'}}>
          {files !== 0 && <div><Icon type="file" style={{fontSize: 15}} />{files}</div>}
          {scores !== 0 && <div><img src={scoreIcon} width={25} style={{marginRight: 3}} />{scores}</div>}
        </div>
      </div>
    )
  }

  refetchData = () => {
    this.props.data.refetch()
  }

  render() {
    const {
      selectedKeyConsideration,
      visible,
      relateWithFileVisible,
      viewPDF,
      submitForAssessmentVisible,
      selectedFileId,
      noDocument,
      keyConsiderationNote,
    } = this.state
    const {data: {gapAnalysis}} = this.props
    const coreSubjects = get(gapAnalysis, 'coreSubjects')
    const projectStatus = get(gapAnalysis, 'project.status', projectStatuses.new.value)
    const canEditProject = projectStatus === projectStatuses.new.value || projectStatus === projectStatuses.firstAssessmentCompleted.value
    const canSubmit = projectStatus === projectStatuses.new.value
    const canUpload = projectStatus === projectStatuses.new.value || projectStatus === projectStatuses.firstAssessmentRequest.value || projectStatus === projectStatuses.firstAssessmentCompleted.value
    const canSubmitSecondAssessment = projectStatus === projectStatuses.firstAssessmentCompleted.value
    const projectId = get(gapAnalysis, 'project.id')
    const companyName = get(gapAnalysis, 'project.company.name', '')
    const relatedDocumentsPercent = getRelatedFilesPercent(coreSubjects)

    return (
      <LayoutWrapper>
        <PageHeader>
          <span>{get(gapAnalysis, 'project.title')} - Gap Analysis</span>
          <Button
            type="primary"
            disabled={!canSubmit}
            style={{marginLeft: '15px', height: 35}}
            onClick={this.requestAssessment}
            title="Submit for first documentation assessment"
          >
            Submit for first documentation assessment
          </Button>
          <Button
            type="primary"
            disabled={!canSubmitSecondAssessment}
            style={{marginLeft: '15px', height: 35}}
            onClick={this.requestAssessment}
            title="Submit for second documentation assessment"
          >
            Submit for second documentation assessment
          </Button>
        </PageHeader>
        <div style={{position: 'absolute', right: 20, top: 5}}>
          <Tooltip placement="left" title="Overall Related Documents">
            <Progress
              type="circle" percent={relatedDocumentsPercent}
              strokeWidth={8} width={70}
              style={{backgroundColor: '#f0f2f5'}}
              format={percent => percent + '%'}
            />
          </Tooltip>
        </div>
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box>
              <Tabs animated={false} defaultActiveKey="organizationalGovernance" >
                {values(coreSubjectNames).map(item => {
                  const coreSubject = find(coreSubjects, {coreSubject: item.key})
                  const remainingSetting = this.getRemainingSetting(coreSubject, item.key)

                  return (<TabPane tab={this.renderTab(item.labelTab, remainingSetting)} key={item.key}>
                    {this.renderCoreSubjectResult(coreSubject)}
                    {this.renderIssueOfInterest(item.key, coreSubject, canEditProject, canUpload)}
                  </TabPane>)
                })}
              </Tabs>
              <TooltipWrapper>
                <InfoTooltip content={gapEdit} />
              </TooltipWrapper>
            </Box>
          </Col>
        </Row>
        <AddNotes
          visible={visible}
          handleOk={this.handleOk}
          hideModal={this.hideModal}
          gapAnalysisId={this.props.match.params.id}
          keyConsideration={selectedKeyConsideration}
          keyConsiderationNote={keyConsiderationNote}
        />
        <RelateWithFile
          visible={relateWithFileVisible}
          handleOk={this.handleOk}
          hideModal={this.hideRelateWithFileModal}
          gapAnalysisId={this.props.match.params.id}
          keyConsideration={selectedKeyConsideration}
          projectId={projectId}
          selectedFileId={selectedFileId}
          noDocument={noDocument}
          refetchData={this.refetchData}
        />

        <ViewPDF
          visible={viewPDF}
          handleOk={this.handleOk}
          hideModal={this.hideViewPDFModal}
          gapAnalysisId={this.props.match.params.id}
          keyConsideration={selectedKeyConsideration}
          projectId={projectId}
          selectedFileId={selectedFileId}
          noDocument={noDocument}
          refetchData={this.refetchData}
        />
        <SubmitForAssessment
          visible={submitForAssessmentVisible}
          hideModal={this.hideSubmitForAssessmentModal}
          projectId={projectId}
          projectStatus={projectStatus}
          companyName={companyName}
        />
      </LayoutWrapper>
    )
  }
}

const GapEditQL = graphql(fetchGapAnalysisQuery, {
  options: (props) => {return {variables: {id: props.match.params.id}}},
})(GapEdit)
export default connect(null, {breadcrumbUpdate, openModal})(GapEditQL)


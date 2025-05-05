import React, {Component} from 'react'
import {Row, Col, Tabs, Progress, Tag, Tooltip, Divider, Icon} from 'antd'
import {values, filter, find, get, round} from 'lodash'
import {graphql} from 'react-apollo'
import {connect} from 'react-redux'
import {breadcrumbUpdate} from '../../actions'
import {performanceView} from '../../common/enum/performance'
import fetchGapAnalysisQuery from '../../graphql/fetchGapAnalysis'
import {coreSubjectNames} from '../../common/coreSubjectNames'
import {issueOfInterest} from '../../common/issueOfInterest'
import {gapAnalysisQuestions} from '../../common/gapAnalysisQuestions'
import basicStyle from '../../common/basicStyle'
import PageHeader from '../utility/pageHeader'
import LayoutWrapper from '../utility/layoutWrapper'
import Box from '../utility/box'
import SupplierIssueOfInterestList from './SupplierIssueOfInterest'

const TabPane = Tabs.TabPane
const {rowStyle, colStyle, gutter} = basicStyle
class SupplierGap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      visible: false,
    }
  }

  componentWillUpdate(nextprops) {
    const {data: {gapAnalysis}, breadcrumbUpdate} = nextprops
    if (gapAnalysis) {
      const breadcrumb = [
        {name: 'Home', link: '/'},
        {name: 'Supplier Gap Analysis'},
      ]
      breadcrumbUpdate(breadcrumb)
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data.gapAnalysis !== this.props.data.gapAnalysis || nextState !== this.state) {
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
          return (<Col md={12} sm={12} xs={24} style={colStyle} key={item.key}>
            <span style={{marginBottom: 10, display: 'block'}}>{item.label}: </span>
            <Tag color={item.color}>
              {round(get(coreSubject, item.value, 0) * 100, 2) }%
            </Tag>
          </Col>)
        })}
      </Row>
    </div>)
  }
  renderIssueOfInterest(coreSubjectKey, coreSubject) {
    const issueOfInterests = get(coreSubject, 'issueOfInterests')
    return filter(issueOfInterest, {coreSubject: coreSubjectKey}).map(issue => {
      const issueOfI = find(issueOfInterests, {issueOfInterest: issue.key})
      return (
        <div style={{margin: 20, marginBottom: 20}} key={issue.key}>

          <SupplierIssueOfInterestList
            issue={issue}
            issueOfInterest={issueOfI}
            gapAnalysisId={this.props.match.params.id}
          />
        </div>
      )
    })
  }

  getTotalSettings(key) {
    let files = 0
    let scores = 0
    filter(issueOfInterest, {coreSubject: key}).map(issue => {
      const issueOfI = filter(values(gapAnalysisQuestions), {isuueOfInterest: issue.key})
      files += issueOfI.length
      scores += issueOfI.length
    })

    return {files, scores}
  }

  getCompletedSettings(coreSubject) {

    if (!coreSubject) {
      return {uploadedFiles: 0, withScore: 0}
    }

    const existingKeyConsiderations = []
    coreSubject.issueOfInterests.forEach(issueOfInterest => {
      existingKeyConsiderations.push(...issueOfInterest.keyConsiderations)
    })

    const uploadedFiles = existingKeyConsiderations.filter(kConsideration => kConsideration.file !== null || kConsideration.noRelatedDocument || kConsideration.noDocument)
    const withScore = existingKeyConsiderations.filter(kConsideration => {
      const relevance = get(kConsideration, 'relevanceValue', null)
      const performance = get(kConsideration, 'performanceValue', null)

      if (relevance === null) {
        return false
      }

      if (relevance !== 0 && performance === null) {
        return false
      }

      return true
    })

    return {uploadedFiles: uploadedFiles.length, withScore: withScore.length}
  }

  getRemainingSetting(coreSubject, key) {
    const {files, scores} = this.getTotalSettings(key)
    const {uploadedFiles, withScore} = this.getCompletedSettings(coreSubject)

    return {
      files: files - uploadedFiles,
      scores: scores - withScore,
    }
  }

  getRelatedFilesPercent(coreSubjects) {
    let totalFiles = 0
    let relatedFiles = 0

    values(coreSubjectNames).forEach(item => {
      const coreSubject = find(coreSubjects, {coreSubject: item.key})
      const {files} = this.getTotalSettings(item.key)
      const {uploadedFiles} = this.getCompletedSettings(coreSubject)

      totalFiles += files
      relatedFiles += uploadedFiles
    })

    return round((relatedFiles / totalFiles) * 100, 1)
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
          {files !== 0 && <div><Icon type="file" />{files}</div>}
          {scores !== 0 && <div><Icon type="pie-chart" />{scores}</div>}
        </div>
      </div>
    )
  }

  refetchData = () => {
    this.props.data.refetch()
  }

  render() {
    const {data: {gapAnalysis}} = this.props
    const coreSubjects = get(gapAnalysis, 'coreSubjects')
    const relatedDocumentsPercent = this.getRelatedFilesPercent(coreSubjects)

    return (
      <LayoutWrapper>
        <PageHeader>
          <span>{get(gapAnalysis, 'project.title')} - Gap Analysis</span>
        </PageHeader>
        <div style={{position: 'absolute', right: 20, top: 5}}>
          <Tooltip placement="left" title="Documentation Upload">
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
              <Tabs animated={false}  defaultActiveKey="organizationalGovernance" >
                {values(coreSubjectNames).map(item => {
                  const coreSubject = find(coreSubjects, {coreSubject: item.key})
                  const remainingSetting = this.getRemainingSetting(coreSubject, item.key)

                  return (<TabPane tab={this.renderTab(item.labelTab, remainingSetting)} key={item.key}>
                    {this.renderCoreSubjectResult(coreSubject)}
                    {this.renderIssueOfInterest(item.key, coreSubject)}
                  </TabPane>)
                })}

              </Tabs>
            </Box>
          </Col>
        </Row>
      </LayoutWrapper>
    )
  }
}

const SupplierGapQL = graphql(fetchGapAnalysisQuery, {
  options: (props) => {return {variables: {id: props.match.params.id}}},
})(SupplierGap)
export default connect(null, {breadcrumbUpdate})(SupplierGapQL)


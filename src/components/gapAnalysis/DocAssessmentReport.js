import React, {Component} from 'react'
import {graphql, compose} from 'react-apollo'
import {get, values, find, filter, round, some} from 'lodash'
import {Row, Col, Card, Button, message} from 'antd'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import styled from 'styled-components'
import Box from '../utility/box'
import {breadcrumbUpdate} from '../../actions'
import fetchGapAnalysisQuery from '../../graphql/fetchGapAnalysis'
import fetchProjectFilesQuery from '../../graphql/fetchGapFiles'

import PageHeader from '../utility/pageHeader'
import LayoutWrapper from '../utility/layoutWrapper'
import InfoTooltip from '../utility/InfoTooltip'
import {projectsMessages} from '../../messages'
import {issueOfInterest} from '../../common/issueOfInterest'
import {coreSubjectNames} from '../../common/coreSubjectNames'
import {projectStatuses} from '../../common/enum/projectStatuses'
import {gapAnalysisQuestions} from '../../common/gapAnalysisQuestions'
import TableWrapper from '../styles/table.style'
import basicStyle from '../../common/basicStyle'
import {getCompanyPerformance,
  getRevisingScorePerformance} from './report/_helper'
import {getFileScore, getCriteriaValues} from '../projectAssessment/utility'
import {TextCell} from '../../common/helperCells'
import {assessmentReportKcTooltip} from '../../common/tooltips'
import axios from 'axios'

const TooltipWrapper = styled.div`
  position: absolute;
  top: 25px;
  right: 15px;
`

class DocAssessmentReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gapColumns: this.createcolumns(props.isAdmin),
      documentColumns: this.createDocumentColumns(props.isAdmin),
      unlinkedGapColumns: this.createUnlinkedColumns(),
      fileColumns: this.createFileColumns(),
      gapFilesData: [],
    }
  }

  // componentDidMount() {
  //   // fetch gapfiles
  //   // get(data, 'gapAnalysis.project.id') 
  //   const {data: {gapAnalysis}} = this.props;
  //   // const projectid = get(gapAnalysis, 'project.id');
  //   console.log("DATA: ->", get(gapAnalysis, 'project.id'));
  //   if (get(gapAnalysis, 'project.id', null)) {
  //     this.fetchGabFiles(gapAnalysis.project.id);
  //   }
  // }

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
        {name: 'Documentation Assessment Report'},
      ]
      breadcrumbUpdate(breadcrumb)
    }
  }
  // only rerender when there is a different in data.gapAnalysis or admin
  shouldComponentUpdate(nextProps) {
    console.log("Next props:", nextProps);
    if (get(nextProps, 'fetchgapFiles.gapFiles') !== get(this.props, 'fetchgapFiles.gapFiles') || nextProps.data.gapAnalysis !== this.props.data.gapAnalysis || nextProps.isAdmin !== this.props.isAdmin) {
      return true
    } else {
      return false
    }
  }

  getFileOverallPerformance = keyConsiderations => {

    const authentic = some(keyConsiderations, kc => kc.authentic === 'Y') ? 0.2 : 0
    const communicated = some(keyConsiderations, kc => kc.communicated === 'Y') ? 0.2 : 0
    const upToDate = some(keyConsiderations, kc => kc.upToDate === 'Y') ? 0.2 : 0
    const appropriate = keyConsiderations.filter(kc => kc.kcCriterion === 'Y').length / keyConsiderations.length

    const performance = authentic + communicated + upToDate + (appropriate * 0.4)

    return round(performance * 100, 2) || 0
  }

  createFileColumns() {
    return [
      {
        title: 'Documentation',
        key: 'name',
        render: object => TextCell(object.name),
      },
      {
        title: 'Overall documentation assessment score',
        key: 'score',
        width: 200,
        render: object => TextCell(`${this.getFileOverallPerformance(object.keyConsiderations)}%`),
      },
    ]
  }

  expandedRowRender = (record) => {
    const {colStyle} = basicStyle
    const {keyConsiderations} = record

    const authentic = some(keyConsiderations, kc => kc.authentic === 'Y') ? 100 : 0
    const communicated = some(keyConsiderations, kc => kc.communicated === 'Y') ? 100 : 0
    const upToDate = some(keyConsiderations, kc => kc.upToDate === 'Y') ? 100 : 0
    const addressAppropriate = keyConsiderations.filter(kc => kc.kcCriterion === 'Y').length
    const appropriate = addressAppropriate / keyConsiderations.length
    const appropriatePercent = round(appropriate * 100, 2) || 0

    return (
      <div>
        <Row >
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Card bordered={false}>
              <h4>Documentation assessment criteria:</h4>
              <div>Authentic: {authentic}%</div>
              <div>Up to date: {upToDate}%</div>
              <div>Communicated: {communicated}%</div>
              <div>Appropriate: {appropriatePercent}% (addresses {addressAppropriate} of {keyConsiderations.length} KCs linked)</div>
            </Card>
          </Col>

        </Row >
        <Row >
          <Col span={24}>
            <TableWrapper
              rowKey="key"
              size="small"
              columns={this.state.documentColumns}
              dataSource={keyConsiderations}
              pagination={false}
              title={() => (<div >
                <span style={{color: '#888'}}> Key Considerations linked to documentation </span>
              </div>)}
            />
          </Col>
        </Row>

      </div>
    )
  };

  createcolumns(isAdmin) {
    const gapAnalysisColumn = [{
      title: 'Key Consideration',
      key: 'keyConsideration',
      render: object => {
        const kc = find(values(gapAnalysisQuestions), {key: object.keyConsideration})

        return kc.label
      },
    }, {
      title: 'Initial Company Performance Score',
      key: 'performance',
      width: 250,
      render: record => getCompanyPerformance(record.performanceValue, record.keyConsideration),
    },
    ]

    if (isAdmin) {
      gapAnalysisColumn.push({
        title: 'Revising Score',
        key: 'revisingScore',
        width: 250,
        render: record => TextCell(`${record.revisingScore * 100}%`),
      })
    }


    gapAnalysisColumn.push({
      title: 'Revised Company Performance Score',
      key: 'revisedScore',
      width: 250,
      render: record => {
        // console.log("Record:", record);
        return getRevisingScorePerformance(round(record.revisedScore * 100));
      },
    })

    return gapAnalysisColumn
  }

  createDocumentColumns(isAdmin) {
    const gapAnalysisColumn = [{
      title: 'Key Consideration',
      key: 'keyConsideration',
      render: object => object.keyConsideration,
    },
    {
      title: 'Addressed by documentation',
      key: 'addressed',
      width: 250,
      render: record => TextCell(record.kcCriterion === 'Y' ? 'Yes' : 'No'),
    },
    {
      title: 'Initial Company Performance Score',
      key: 'performance',
      width: 250,
      render: record => getCompanyPerformance(record.performanceValue, record.keyConsideration),
    },
    ]

    if (isAdmin) {
      gapAnalysisColumn.push({
        title: 'Revising Score',
        key: 'revisingScore',
        width: 250,
        render: record => TextCell(`${record.revisingScore * 100}%`),
      })
    }


    gapAnalysisColumn.push({
      title: 'Revised Company Performance Score',
      key: 'revisedScore',
      width: 250,
      render: record => {
        // console.log("Record:", record);
        return getRevisingScorePerformance(round(record.revisedScore * 100))
      },
    })

    return gapAnalysisColumn
  }

  createUnlinkedColumns() {
    const gapAnalysisColumn = [{
      title: 'Key Consideration',
      key: 'keyConsideration',
      render: object => {
        const kc = find(values(gapAnalysisQuestions), {key: object.keyConsideration})

        return kc.label
      },
    },
    {
      title: 'Company Performance Score',
      key: 'performance',
      width: 250,
      render: record => {
        // CSR- 94 -> solve problem with company performance score
        // console.log("Record:", record);
        const performanceValue = record.relevanceValue === 0 ? null : record.performanceValue;
        return getCompanyPerformance(performanceValue, record.keyConsideration)
      },
    },
    ]

    return gapAnalysisColumn
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

  render() {

    const {rowStyle, colStyle, gutter, orangeColor, greyColor} = basicStyle
    const linkedKcs = []
    const {data: {gapAnalysis}, intl: {formatMessage}} = this.props
    const coreSubjects = get(gapAnalysis, 'coreSubjects', [])
    const issuesOfInterestResults = []

    values(coreSubjectNames).map(item => {
      const coreSubject = find(coreSubjects, {coreSubject: item.key})

      const issueOfInterests = get(coreSubject, 'issueOfInterests')
      filter(issueOfInterest, {coreSubject: item.key}).forEach(issue => {
        const issueOfI = find(issueOfInterests, {issueOfInterest: issue.key})

        if (issueOfI) {
          const linked = filter(issueOfI.keyConsiderations, kc => kc.file !== null)
          const unlinked = filter(issueOfI.keyConsiderations, kc => kc.file === null)

          linkedKcs.push(...linked)
          issuesOfInterestResults.push({
            coreSubject: item.key,
            issueOfInterest: issueOfI.issueOfInterest,
            linked,
            unlinked,
          })
        }
      })
    })

    const files = []

    console.log("Files:", get(this.props.fetchgapFiles, 'gapFiles'));
    const gapFiles =  get(this.props.fetchgapFiles, 'gapFiles');
    if (gapFiles) {
      console.log("fetchProjectFilesQuery:", gapFiles);
      gapFiles.forEach(file => {

        const keyConsiderations = file.keyConsiderations.map(kc => {
          const gapAnalysisQuest = find(gapAnalysisQuestions, {key: kc})
          const fileScore = getFileScore(file, kc)
          const linkedKc = find(linkedKcs, {keyConsideration: kc}) || {}

          return {
            id: gapAnalysisQuest.label,
            keyConsideration: gapAnalysisQuest.label,
            score: fileScore,
            ...getCriteriaValues(file, kc),
            performanceValue: linkedKc.performanceValue,
            revisingScore: linkedKc.revisingScore || 0,
            revisedScore: linkedKc.revisedScore || 0,
            WeightValue: linkedKc.WeightValue || 0,
          }
        })

        files.push({
          name: file.name,
          keyConsiderations: keyConsiderations,
        })
      })
    }

    return (
      <LayoutWrapper>
        <PageHeader>
          <span>Assessment Report</span>
        </PageHeader><Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box>
              <Col md={24} sm={24} xs={24} style={colStyle}>
                <Card bordered={false}>
                  <h4>
                    {formatMessage(projectsMessages.projectCompanyName)} <span style={orangeColor} >
                      {get(gapAnalysis, 'project.company.name')}
                    </span>
                  </h4>
                  <h4>
                    {formatMessage(projectsMessages.projectTitle)} <span style={greyColor} >{get(gapAnalysis, 'project.title')}</span>
                  </h4>
                  <h4>
                    {formatMessage(projectsMessages.projectYear)} <span style={greyColor} >{get(gapAnalysis, 'project.year')}</span>
                  </h4>
                  <h4>
                    {formatMessage(projectsMessages.assessmentStatus)} <span style={greyColor} >{this.getStatusText(get(gapAnalysis, 'project.status'))}</span>
                  </h4>
                </Card>
              </Col>
            </Box>
          </Col>
        </Row>
        <Box >

          <Row style={{...rowStyle, fontWeight: 600}} justify="space-between" gutter={gutter}>
            <Col style={{marginTop: 25}}>
              <span style={{color: '#888'}}> Key Considerations linked to documentation </span>
              <Button
                type="primary"
                style={{marginLeft: 15}}
                onClick={() => this.props.history.push(`/gap/${gapAnalysis.id}`)}
              >Data input</Button>
            </Col>
          </Row>


          {issuesOfInterestResults.map(iOi => {
            if (iOi.linked.length === 0) {
              return null
            }

            return (
              <Row style={{marginTop: 20}} key={iOi.issueOfInterest} >
                <Col span={24}>
                  <TableWrapper
                    rowKey="key"
                    size="small"
                    columns={this.state.gapColumns}
                    dataSource={iOi.linked}
                    pagination={false}
                    title={() => (<div style={{display: 'flex'}}>
                      <div >
                        <div>Core Subject: {get(coreSubjectNames[get(iOi, 'coreSubject')], 'label')} </div>
                        <div>Issue Of Interest: {get(issueOfInterest[get(iOi, 'issueOfInterest')], 'label')} </div>
                      </div>

                      <TooltipWrapper><InfoTooltip content={assessmentReportKcTooltip} placement="leftTop" /></TooltipWrapper>
                    </div>)}
                  />
                </Col>
              </Row>
            )
          })}
        </Box>

        <Box style={{marginTop: 20}}>
          <Row style={{...rowStyle, fontWeight: 600}} justify="space-between" gutter={gutter}>
            <Col style={{marginTop: 25}}>
              <span style={{color: '#888'}}> Key Considerations not linked to documentation </span>
              <Button
                type="primary"
                style={{marginLeft: 15}}
                onClick={() => this.props.history.push(`/gap/${gapAnalysis.id}`)}
              >Data input</Button>
            </Col>
          </Row>

          {issuesOfInterestResults.map(iOi => {
            if (iOi.unlinked.length === 0) {
              return null
            }

            return (
              <Row style={{marginTop: 20}} key={iOi.issueOfInterest} >
                <Col span={24}>
                  <TableWrapper
                    rowKey="key"
                    size="small"
                    columns={this.state.unlinkedGapColumns}
                    dataSource={iOi.unlinked}
                    pagination={false}
                    title={() => (<div style={{display: 'flex'}}>
                      <div >
                        <div>Core Subject: {get(coreSubjectNames[get(iOi, 'coreSubject')], 'label')} </div>
                        <div>Issue Of Interest: {get(issueOfInterest[get(iOi, 'issueOfInterest')], 'label')} </div>
                      </div>

                      <TooltipWrapper><InfoTooltip content={assessmentReportKcTooltip} placement="leftTop" /></TooltipWrapper>
                    </div>)}
                  />
                </Col>
              </Row>
            )
          })}
        </Box>

        <Box style={{marginTop: 20}}>
          <Row>
            <Col span={24}>
              <TableWrapper
                rowKey="key"
                size="small"
                columns={this.state.fileColumns}
                dataSource={files}
                pagination={false}
                expandedRowRender={this.expandedRowRender}
                defaultExpandAllRows
                title={() => (<div >
                  <span style={{color: '#888'}}> Documentation breakdown list </span>
                </div>)}
              />
            </Col>
          </Row>
        </Box>
      </LayoutWrapper>
    )
  }
}


const DocAssessmentReportQL = compose(
  graphql(fetchGapAnalysisQuery, {
    options: (props) => {return {variables: {id: props.match.params.id}}},
  }),
  graphql(fetchProjectFilesQuery, {
    name: 'fetchgapFiles',
    skip: ({data}) => get(data, 'gapAnalysis.project.id', null) === null,
    options: ({data}) => {
      // console.log("Project:", get(data, 'gapAnalysis.project.id'));
      return {
        variables: {
          projectId: get(data, 'gapAnalysis.project.id')
        }
      }
    },
  }),
)(DocAssessmentReport)

function mapStateToProps({auth}) {
  const userRole = auth.currentUser ? auth.currentUser.role.split('|') : []

  return {
    isAdmin: !!userRole.includes('Admin'),
  }
}

export default connect(mapStateToProps, {breadcrumbUpdate})(injectIntl(DocAssessmentReportQL))

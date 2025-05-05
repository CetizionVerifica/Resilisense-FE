import React, {Component} from 'react'
import {get, values, filter, find} from 'lodash'
import moment from 'moment'
import {Button, Tabs, Progress, Tooltip, Card, Row, Col, message} from 'antd'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import {graphql, compose} from 'react-apollo'
import {withRouter} from 'react-router-dom'
import styled from 'styled-components'
import {fetchProjectSurvey} from '../../graphql/fetchProjectSurveys'
import {mUpdateStakeHolderGroup} from '../../graphql/materialityMutation'
import basicStyle from '../../common/basicStyle'
import {surveyFlags} from '../../common/enum/surveyFlags'
import {responseStatuses} from '../../common/enum/responseStatuses'
import {projectsMessages} from '../../messages'
import {breadcrumbUpdate, sendReminder, closeSurvey} from '../../actions'
import TableWrapper from '../styles/table.style'
import Box from '../utility/box'
import LayoutWrapper from '../utility/layoutWrapper'
import PageHeader from '../utility/pageHeader'
import {openModal} from '../modals/modalActions'
import {createRecipientColumns} from './SurveysListConfig'

const TabPane = Tabs.TabPane

const ActionsWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: baseline;
  margin-bottom: 25px;
`

const ActionsDiv = styled.div`
  width: 350px;
  display: flex;
  justify-content: space-between;
`

const dateFormat = 'DD/MM/YYYY'

class ViewProjectSurvey extends Component {
  constructor(props) {
    super(props)
    this.externalStakeholders = React.createRef();
    this.state = {
      internalColumns: createRecipientColumns(false, this.handleStakeholderGroup),
      externalColumns: createRecipientColumns(true, this.handleStakeholderGroup),
      surveyFlag: 'internal',
      visible: false,
      loading: false,
    }
  }

  componentDidMount() {
    const {breadcrumbUpdate} = this.props
    const breadcrumb = [{name: 'Home', link: '/'},
      {name: 'Surveys', link: '/surveys'},
    ]
    breadcrumbUpdate(breadcrumb)
  }

  handleStakeholderGroup = (groupXFactor, stakeholderId) => {
    const {data: {projectSurvey}, setStakeHolderGroup} = this.props
    const id = get(projectSurvey, 'project.materiality.id')

    setStakeHolderGroup({
      variables: {
        id,
        stakeholderId,
        groupXFactor,
      },
    }).then(() => {message.success('Processing complete!')},
      () => {
        this.setState({loading: false})
        message.warning('Can not set Stakeholder Group')
      })
  }

  onSendReminder = () => {
    const {data: {projectSurvey}} = this.props

    this.setState({loading: true})
    sendReminder(projectSurvey.id).then(() => {
      this.props.data.refetch()
    }, () => {
      message.error('There was an error sending the reminder')
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  onCloseSurvey = () => {
    const {data: {projectSurvey}} = this.props

    this.setState({loading: true})
    closeSurvey(projectSurvey.id).then(() => {
      this.props.data.refetch()
    }, () => {
      message.error('There was an error closing the survey')
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  renderSurveyDetails() {
    const {colStyle} = basicStyle
    const {data: {projectSurvey}, intl: {formatMessage}} = this.props
    const project = get(projectSurvey, 'project', {})
    const closeDate = get(projectSurvey, 'closeDate')
    const reminderSendDate = get(projectSurvey, 'reminderSendDate')

    return (
      <Col md={24} sm={24} xs={24} style={colStyle}>
        <Box >
          <Card bordered={false}>
            <h4>
              {formatMessage(projectsMessages.projectCompanyName)}
              <span>
                {get(project, 'company.name')}
              </span>
            </h4>
            <h4>
              {formatMessage(projectsMessages.projectTitle)}
              <span>
                <a href={`/project/${get(project, 'id')}`}>
                  {get(project, 'title')}
                </a>
              </span>
            </h4>
            <h4>
              {formatMessage(projectsMessages.projectYear)}
              <span>
                {get(project, 'year')}
              </span>
            </h4>
            <h4>
              Send Date:
              <span>
                {moment(get(projectSurvey, 'sendDate')).format(dateFormat)}
              </span>
            </h4>
            <h4>
              Reminder Send Date:
              <span>
                {reminderSendDate ? moment(reminderSendDate).format(dateFormat) : '-'}
              </span>
            </h4>
            <h4>
              Close Date:
              <span>
                {closeDate ? moment(closeDate).format(dateFormat) : '-'}
              </span>
            </h4>
          </Card>
        </Box >
      </Col>
    )
  }

  checkExternalStakeHolderClass(externalRecipients) {
    if (Array.isArray(externalRecipients)) {
      for (var element of externalRecipients) {
        if (!(element.groupXFactor >= 0)) {
          return false;
        }
      }
    } else {
      return false;
    }
    return true;
  }

  getResponseRate(responded, total) {
    if (total === 0) {
      return 0
    }

    return Math.floor(responded / total * 100)
  }

  renderProgress(internalRecipients, externalRecipients,
    intRespondedRecipients, internalResponsePercentage, extRespondedRecipients, externalResponsePercentage) {

    const {surveyFlag} = this.state
    const percentage = surveyFlag === 'internal' ? internalResponsePercentage : externalResponsePercentage
    const responded = surveyFlag === 'internal' ? intRespondedRecipients : extRespondedRecipients
    const total = surveyFlag === 'internal' ? internalRecipients.length : externalRecipients.length

    return (
      <div style={{marginLeft: 15}}>
        <Tooltip placement="right" title={`${responded} out of ${total} stakeholders responded`}>
          <Progress
            type="circle" percent={percentage}
            strokeWidth={8} width={70}
            format={percent => percent + '%'}
          />
        </Tooltip>
      </div>
    )
  }

  render() {
    const {rowStyle, colStyle, gutter} = basicStyle
    const {data: {projectSurvey, loading}} = this.props
    const materialityStakeholders = get(projectSurvey, 'project.materiality.stakeholders', [])
    const stakeholders = filter(materialityStakeholders, s => s.stakeholder !== null).map(s => ({
      id: s.stakeholder.id,
      groupXFactor: s.groupXFactor,
    }))
    const internalRecipients = get(projectSurvey, 'internal.recipients', [])
    const externalRecipients = get(projectSurvey, 'external.recipients', []).map(recipient => {
      const stakeholder = find(stakeholders, {id: recipient.stakeholder})
      return {
        ...recipient,
        groupXFactor: get(stakeholder, 'groupXFactor'),
      }
    })
    const actionRunning = this.state.loading || loading || !projectSurvey
    const intRespondedRecipients = internalRecipients.filter(r => r.status === responseStatuses.completelyResponded.value).length
    const internalResponsePercentage = this.getResponseRate(intRespondedRecipients, internalRecipients.length)
    const extRespondedRecipients = externalRecipients.filter(r => r.status === responseStatuses.completelyResponded.value).length
    const externalResponsePercentage = this.getResponseRate(extRespondedRecipients, externalRecipients.length)

    return (
      <LayoutWrapper>
        <PageHeader>Survey Details</PageHeader>
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          {this.renderSurveyDetails()}
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box >

              <ActionsWrapper>
                <ActionsDiv>
                  <Button
                    type="primary"
                    style={{width: 130, height: 30}}
                    disabled={actionRunning  }
                    onClick={this.onSendReminder}
                    title="Send reminder"
                  >
            Send reminder
                  </Button>
                  <Button
                    type="primary"
                    style={{width: 210, height: 30}}
                    onClick={() => {
                      if (this.checkExternalStakeHolderClass(externalRecipients)) {
                        this.props.openModal('IncorporateSurveyResultsModal',
                          {acceptDisclaimer: this.onCloseSurvey,
                            internalResponsePercentage,
                            externalResponsePercentage}
                        )                        
                      } else {
                        message.warning("Class field(s) under the External Stakeholder Survey have been left blank. Please select one of three options to be able to proceed with incorporating survey responses");
                      }
                  }}
                    disabled={actionRunning}
                    title="Incorporate survey responses"
                  >
            Incorporate survey responses
                  </Button>
                </ActionsDiv>
                {this.renderProgress(internalRecipients, externalRecipients, intRespondedRecipients,
                  internalResponsePercentage, extRespondedRecipients, externalResponsePercentage)}
              </ActionsWrapper>
              <Tabs defaultActiveKey="internal" onChange={key => this.setState({surveyFlag: key})} >
                {values(surveyFlags).map(surveyFlag => {
                  const recipients = surveyFlag.value === 'internal' ? internalRecipients : externalRecipients
                  const columns = surveyFlag.value === 'internal' ? this.state.internalColumns : this.state.externalColumns
                  return (
                    <TabPane tab={surveyFlag.labelTab} key={surveyFlag.key}>
                      <TableWrapper
                        size="small"
                        columns={columns}
                        dataSource={recipients}
                        rowKey="email"
                        className="sortingTable"
                        loading={loading}
                        pagination={recipients.length > 10}
                      />
                    </TabPane>
                  )
                })}
              </Tabs>

            </Box >
          </Col>
        </Row>
      </LayoutWrapper>
    )
  }
}

const ViewProjectSurveyQL = compose(
  graphql(fetchProjectSurvey, {
    options: (props) => {return {variables: {id: props.match.params.id}}},
  }),
  graphql(mUpdateStakeHolderGroup, {
    name: 'setStakeHolderGroup',
  }),
)(withRouter(ViewProjectSurvey))

export default connect(null, {breadcrumbUpdate, openModal})(injectIntl(ViewProjectSurveyQL))

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {values, get, uniqBy} from 'lodash'
import {Form, Button, message} from 'antd'
import {reduxForm, Field} from 'redux-form'
import {graphql, compose} from 'react-apollo'
import {injectIntl} from 'react-intl'
import {Scrollbars} from 'react-custom-scrollbars'
import Box from '../utility/box'
import LayoutWrapper from '../utility/layoutWrapper'
import PageHeader from '../utility/pageHeader'
import {sendSurvey} from '../../actions/SurveyActions'
import {companiesMessages} from '../../messages'
import {breadcrumbUpdate} from '../../actions'
import fetchSurveyStakeholders from '../../graphql/fetchSurveyStakeholders'
import fetchProjectQuery from '../../graphql/fetchProject'
import TableWrapper from '../styles/table.style'
import StackholderForm from '../stackholders/StackholderForm'
import EmployeeForm from '../employees/EmployeeForm'
import {createSurveyRecipientColumns} from './SurveysListConfig'

class SendProjectSurvey extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      addExternalVisible: false,
      addInternalVisible: false,
      columns: createSurveyRecipientColumns(),
      internal: [],
      external: [],
    }
  }

  componentDidMount() {
    const {breadcrumbUpdate} = this.props
    const breadcrumb = [{name: 'Home', link: '/'},
      {name: 'Surveys', link: '/surveys'},
      {name: 'Send Surveys', link: '/send-survey'},
    ]
    breadcrumbUpdate(breadcrumb)
  }

  showAddExternalModal = () => this.setState({addExternalVisible: true})
  hideAddExternalModal = () => this.setState({addExternalVisible: false})

  showAddInternalModal = () => this.setState({addInternalVisible: true})
  hideAddInternalModal = () => this.setState({addInternalVisible: false})

  handleFormSubmit = () => {

    const {agency, data: {project}, history} = this.props
    const {internal, external} = this.state

   // if (internal.length === 0 || external.length === 0) {
     // message.error('You should select recipients for both surveys')
     // return
   // }

    const hasInternalDuplicateEmails = uniqBy(internal, 'email').length !== internal.length
    const hasExternalDuplicateEmails = uniqBy(external, 'email').length !== external.length

    if (hasInternalDuplicateEmails || hasExternalDuplicateEmails) {
      message.error('There are recipients with the same email. Please choose each email only once.')
      return
    }

    this.setState({loading: true})

    sendSurvey(agency, project.id, internal, external).then(() => {
      message.success('Survey send successfully..')
      history.push(`/project/${project.id}`)
    }, () => {
      message.error('There was an error sending the survey')
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  handleInternalSelect = selectedRows => {
    this.setState({internal: [...selectedRows]})
  }

  handleExternalSelect = selectedRows => {
    this.setState({external: [...selectedRows]})
  }

  renderRecipients(surveyStakeholders, handleChange, title) {
    const stakeholders = get(surveyStakeholders, 'surveyStakeholders', [])
    const loading = get(surveyStakeholders, 'loading', false)
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        handleChange(selectedRows)
      },
    }

    return (
      <Scrollbars
        style={{marginTop: 15}}
        autoHide
        autoHeight
        autoHeightMin={0}
        autoHeightMax={250}
      >
        <TableWrapper
          size="small"
          columns={this.state.columns}
          dataSource={stakeholders.map(s => ({...s}))}
          rowKey="id"
          className="sortingTable"
          loading={loading}
          pagination={false}
          rowSelection={rowSelection}
          title={() => (<div >
            <span> {title} </span>
          </div>)}
        />
      </Scrollbars>
    )
  }

  refetchStakeholders = () => {
    const {fetchInternalStakeholders, fetchExternalStakeholders} = this.props

    if (!fetchInternalStakeholders || !fetchExternalStakeholders) {
      return
    }

    fetchInternalStakeholders.refetch()
    fetchExternalStakeholders.refetch()
  }

  render() {
    const {
      intl: {formatMessage},
      fetchExternalStakeholders,
      fetchInternalStakeholders,
      data: {loading, project},
    } = this.props
    if (loading) {
      return <div />
    }

    return (
      <LayoutWrapper>
        <PageHeader>Send Surveys</PageHeader>
        <Box >
          <div style={{marginRight: 30}}>
            <div>
              <div style={{marginTop: 15}}>
                <Button
                  key="addNewInternal"
                  type="primary"
                  onClick={this.showAddInternalModal}
                >
                  {formatMessage(companiesMessages.btnAddNewIntStakeholder)}
                </Button>
                <Button
                  key="addNewExternal"
                  style={{marginLeft: 10}}
                  type="primary"
                  onClick={this.showAddExternalModal}
                >
                  {formatMessage(companiesMessages.btnAddNewExtStakeholder)}
                </Button>
                <Button
                  key="send"
                  style={{marginLeft: 10}}
                  type="primary"
                  loading={this.state.loading}
                  onClick={this.handleFormSubmit}
                >
                    Send
                </Button>
              </div>
              {this.renderRecipients(fetchInternalStakeholders, this.handleInternalSelect, 'Internal Stakeholders')}
              {this.renderRecipients(fetchExternalStakeholders, this.handleExternalSelect, 'External Stakeholders')}
            </div>
            <StackholderForm
              visible={this.state.addExternalVisible}
              refetch={this.refetchStakeholders}
              title={companiesMessages.modalTitleAddNewExtStakeholder}
              handleOk={this.handleOk}
              hideModal={this.hideAddExternalModal}
              companyId={project.company.id}
            />
            <EmployeeForm
              visible={this.state.addInternalVisible}
              title={companiesMessages.modalTitleAddNewIntStakeholder}
              refetch={this.refetchStakeholders}
              handleOk={this.handleOk}
              hideModal={this.hideAddInternalModal}
              companyId={project.company.id}
            />
          </div>
        </Box>
      </LayoutWrapper>
    )
  }
}

const SendProjectSurveyForm = reduxForm({
  form: 'SendProjectSurvey',
})(SendProjectSurvey)

const mapStateToProps = state => {

  return {
    agency: state.auth.currentUser ? state.auth.currentUser.currentAgency : null,
  }
}

const SendProjectSurveyFormListQL = compose(
  graphql(fetchProjectQuery, {
    options: (props) => {return {variables: {id: props.match.params.id}}},
  }),
  graphql(fetchSurveyStakeholders, {
    name: 'fetchInternalStakeholders',
    skip: ({data}) => !data || !data.project,
    options: (props) => {
      const {data: {project}} = props
      return {
        variables: {
          companyId: project.company.id,
          type: 'internal',
        },
      }
    },
  }),
  graphql(fetchSurveyStakeholders, {
    name: 'fetchExternalStakeholders',
    skip: ({data}) => !data || !data.project,
    options: (props) => {
      const {data: {project}} = props
      return {
        variables: {
          companyId: project.company.id,
          type: 'external',
        },
      }
    },
  }),
)(SendProjectSurveyForm)

export default connect(mapStateToProps, {breadcrumbUpdate})(injectIntl(SendProjectSurveyFormListQL))

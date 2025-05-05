import React, {Component} from 'react'
import {connect} from 'react-redux'
import {values, some} from 'lodash'
import {Form, Modal, message, Button} from 'antd'
import {reduxForm, Field, formValueSelector} from 'redux-form'
import {graphql, compose} from 'react-apollo'
import {injectIntl} from 'react-intl'
import {commonMessages} from '../../../messages'
import fetchCompaniesWithProjects from '../../../graphql/fetchCompaniesWithProjectsQuery'
import fetchUserByEmail from '../../../graphql/fetchUserByEmail'
import {requestPartnerMutation} from '../../../graphql/companyMutation'
import {addSupplierRequest} from '../../../graphql/supplierRequestMutation'
import ModalStyle from '../../styles/modal.style'
import WithDirection from '../../../common/withDirection'
import {sendSupplierRequest} from '../../../actions/UserActions'
import {partnerFields} from './partnerFields'
const isoModal = ModalStyle(Modal)
const Modals = WithDirection(isoModal)

class Partner extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  addSupplierRequest = requestedYear => {

    // console.log("Year?", requestedYear);
    const {addSupplierRequestMutation, data: {companies}, companyId, partnerEmail, reset, refetch} = this.props

    addSupplierRequestMutation({
      variables: {
        company: companyId,
        requestedYear: requestedYear,
        type: 'Partner',
        email: partnerEmail,
      },
    }).then(({data}) => {

      const selectedCompany = companies.find(x => x.id === companyId)
      //sendSupplierRequest(partnerEmail, selectedCompany.name)

      //refetch()
      message.success('Processing complete!')
      reset()
      this.setState({loading: false, visible: false})
    })
  }

  requestPartnerToUser = (user, projectId) => {

    const {companyId, data: {companies}, currentAgency, reset, refetch, requestPartnerMutation} = this.props

    // User has always one agency
    const id = user.agencies[0].id

    requestPartnerMutation({
      variables: {
        id,
        companyId: companyId,
        agencyId: currentAgency,
        projectId: projectId,
      },
    }).then(({data}) => {
      const selectedCompany = companies.find(x => x.id === companyId)
      //sendSupplierRequest(user.email, selectedCompany.name)

      //refetch()
      message.success('Processing complete!')
      reset()
      this.setState({loading: false, visible: false})
    })
  }

  handleFormSubmit(fields) {
    const {fetchUserByEmail} = this.props
    this.setState({loading: true})

    // Search user by email to perform a partner request
    fetchUserByEmail.refetch().then((result) => {

      const user = result.data.userByEmail
      const project = this.props.data.companies[0].projects.filter(project => project.id === fields.projectName)
      // console.log(fields)

      if (user) {
        // If the user exists perform the partner request
        this.requestPartnerToUser(user, project[0].id)
      } else {
        // If the user exists perform the partner request
        this.addSupplierRequest(project[0].year)
      }
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.visible && !nextState.visible) {
      this.setState({visible: true})
    }
    if (!nextState.visible) {
      this.props.hideModal()
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
    this.props.showModal(this.state.visible)
  }

  handleCancel = () => {
    this.setState({visible: false})
  }

  renderFields(group, companies, projects, years) {
    const {intl: {formatMessage}} = this.props
    return values(group).map(field => {

      let options = field.options;


      if (field.key === 'companyName') {
        options = companies
      }

      if (field.key === 'projectName') {
        options = projects
      }

      if (field.key === 'projectYear') {
        options = years
      }

      return (
        <Field
          key={field.key}
          {...field}
          addonBefore={field.addonBefore}
          name={field.value}
          options={options}
          label={formatMessage(field.localization)}
          component={field.component}
          placeholder={formatMessage(field.localization)}
        />

      )
    })
  }

  render() {
    const {handleSubmit, intl: {formatMessage}, data: {loading, companies}, companyId} = this.props
    if (loading) {
      return <div />
    }
    const companiesOptions = Array.isArray(companies) ? companies.map(company => ({label: company.name, value: company.id})) : [];

    const selectedCompany = companies.find(x => x.id === companyId) || {projects: []}

    const projectOptions = selectedCompany.projects.map(project => ({
      label: project.title, value: project.id,
    }))

    const yearOptions = []
    selectedCompany.projects.forEach(project => {
      if (!some(yearOptions, opt => opt.year === project.year)) {
        yearOptions.push({label: project.year, value: project.id})
      }
    })

    return (
      <div style={{marginRight: 30}}>
        <Form className="login-form">
          <Modals
            visible={this.state.visible}
            title="Add Client to Company"
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                {formatMessage(commonMessages.commonCancel)}
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={this.state.loading}
                onClick={handleSubmit(this.handleFormSubmit.bind(this))}
              >
                {formatMessage(commonMessages.commonSave)}
              </Button>,
            ]}
          >
            <div>

              {this.renderFields(partnerFields, companiesOptions, projectOptions, yearOptions)}

            </div>
          </Modals>
        </Form>
      </div>

    )
  }
}

const PartnerForm = reduxForm({
  form: 'partner',
})(Partner)

// Decorate with connect to read form values
const selector = formValueSelector('partner') // <-- same as form name

const mapStateToProps = state => {
  // can select values individually
  const companyId = selector(state, 'companyId')
  const partnerEmail = selector(state, 'partnerEmail')
  const {currentUser} = state.auth
  const currentAgency = currentUser ? currentUser.currentAgency : ''

  return {
    companyId,
    partnerEmail,
    currentAgency,
  }
}

const PartnerFormListQL = compose(
  graphql(fetchCompaniesWithProjects),
  graphql(requestPartnerMutation, {
    name: 'requestPartnerMutation',
  }),
  graphql(addSupplierRequest, {
    name: 'addSupplierRequestMutation',
  }),
  graphql(fetchUserByEmail, {
    name: 'fetchUserByEmail',
    skip: ({partnerEmail}) => !partnerEmail,
    options: ({partnerEmail}) => {
      return {
        variables: {
          email: partnerEmail,
        },
      }
    },
  }),
)(PartnerForm)

export default connect(mapStateToProps)(injectIntl(PartnerFormListQL))

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {values, uniq, some} from 'lodash'
import clone from 'clone'
import {Form, Modal, message, Button} from 'antd'
import {reduxForm, Field, formValueSelector} from 'redux-form'
import {graphql, compose} from 'react-apollo'
import {injectIntl} from 'react-intl'
import {commonMessages} from '../../../messages'
import fetchCompaniesWithProjects from '../../../graphql/fetchCompaniesWithProjectsQuery'
import fetchUserByEmail from '../../../graphql/fetchUserByEmail'
import {requestSupplierMutation} from '../../../graphql/companyMutation'
import {addSupplierRequest} from '../../../graphql/supplierRequestMutation'
import ModalStyle from '../../styles/modal.style'
import WithDirection from '../../../common/withDirection'
import {sendSupplierRequest} from '../../../actions/UserActions'
import {supplierFields} from './supplierFields'
import {otherSupplierFields} from './otherSupplierFields';
import {Row, Col, Tabs} from 'antd'
import styled from 'styled-components';
import Box from '../../utility/box';

const isoModal = ModalStyle(Modal)
const Modals = WithDirection(isoModal)
const TabPane = Tabs.TabPane;

const TooltipWrapper = styled.div`
  margin-left: 10px;  
`;

class Supplier extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  addSupplierRequest = requestedYear => {
    const {addSupplierRequestMutation, data: {companies}, companyId, supplierEmail, reset, refetch} = this.props
    const selectedCompanyId = companies.length === 1 ? companies[0].id : companyId

    addSupplierRequestMutation({
      variables: {
        company: selectedCompanyId,
        requestedYear,
        type: 'Supplier',
        email: supplierEmail,
      },
    }).then(({data}) => {

      const selectedCompany = companies.find(x => x.id === selectedCompanyId)
      sendSupplierRequest(supplierEmail, selectedCompany.name)

      refetch()
      message.success('Processing complete!')
      reset()
      this.setState({loading: false, visible: false})
    })
  }

  requestSupplierToUser = (user, requestedYear) => {

    const {companyId, data: {companies}, currentAgency, reset, refetch, requestSupplierMutation} = this.props

    // User has always one agency
    const id = user.agencies[0].id
    const selectedCompanyId = companies.length === 1 ? companies[0].id : companyId

    requestSupplierMutation({
      variables: {
        id,
        companyId: selectedCompanyId,
        agencyId: currentAgency,
        requestedYear,
      },
    }).then(({data}) => {
      const selectedCompany = companies.find(x => x.id === selectedCompanyId)
      sendSupplierRequest(user.email, selectedCompany.name)

      refetch()
      message.success('Processing complete!')
      reset()
      this.setState({loading: false, visible: false})
    })
  }

  handleFormSubmit(fields) {

    console.log("Fields:", fields);
    const {fetchUserByEmail} = this.props
    this.setState({loading: true})

    // Search user by email to perform a supplier request
    fetchUserByEmail.refetch().then((result) => {

      const user = result.data.userByEmail

      if (user && some(user.agencies)) {
        // If the user exists perform the supplier request
        this.requestSupplierToUser(user, fields.projectYear)
      } else {
        // If the user exists perform the supplier request
        this.addSupplierRequest(fields.projectYear)
      }
    });
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

    return (
      <Row>
        {
          values(group).map((field, i) => {

            let options = field.options

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
              <Col span={field.sizeHalf ? 12 : 24} key={i} style={{paddingLeft: 5, paddingRight: 5}}>
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
              </Col>
            )
          })
        }
      </Row>
    )
  }
  
  renderOtherSupplierFields(group, companies, projects, years) {
    const {intl: {formatMessage}} = this.props
    return values(group).map(field => {

      let options = field.options

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

    const companiesOptions = companies.map(company => ({label: company.name, value: company.id}))

    const selectedCompany = companies.length === 1 ? companies[0] : companies.find(x => x.id === companyId) || {projects: []}

    const projectOptions = selectedCompany.projects.map(project => ({
      label: project.title, value: project.year,
    }))

    const years = uniq(selectedCompany.projects.map(p => p.year)).sort()

    const yearOptions = years.map(year => ({label: year, value: year}))

    const fields = clone(supplierFields)
    // const _otherSupplierFields = clone(otherSupplierFields);

    if (companiesOptions.length < 2) {
      delete fields.companyName
    }
    return (
      <div style={{marginRight: 30}}>
        <Form className="login-form">            
          <Modals
            visible={this.state.visible}
            title="Add Supplier to Company"
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
                {this.renderFields(fields, companiesOptions, projectOptions, yearOptions)}
              </div> 
          </Modals>
        </Form>
      </div>
    )
  }
}

const SupplierForm = reduxForm({
  form: 'supplier',
})(Supplier)

// Decorate with connect to read form values
const selector = formValueSelector('supplier') // <-- same as form name

const mapStateToProps = state => {
  // can select values individually
  const companyId = selector(state, 'companyId')
  const supplierEmail = selector(state, 'supplierEmail')
  const {currentUser} = state.auth
  const currentAgency = currentUser ? currentUser.currentAgency : ''
  
  return {
    companyId,
    supplierEmail,
    currentAgency,
  }
}

const SupplierFormListQL = compose(
  graphql(fetchCompaniesWithProjects),
  graphql(requestSupplierMutation, {
    name: 'requestSupplierMutation',
  }),
  graphql(addSupplierRequest, {
    name: 'addSupplierRequestMutation',
  }),
  graphql(fetchUserByEmail, {
    name: 'fetchUserByEmail',
    skip: ({supplierEmail}) => !supplierEmail,
    options: ({supplierEmail}) => {
      return {
        variables: {
          email: supplierEmail,
        },
      }
    },
  }),
)(SupplierForm)

export default connect(mapStateToProps)(injectIntl(SupplierFormListQL))

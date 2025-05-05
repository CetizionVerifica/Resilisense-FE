import React, {Component} from 'react'
import {values} from 'lodash'
import {Form, Modal, message, Button} from 'antd'
import {reduxForm, Field} from 'redux-form'
import {connect} from 'react-redux'
import {graphql} from 'react-apollo'
import {injectIntl} from 'react-intl'
import {commonMessages, companiesMessages} from '../../messages'
import {loadEmployee} from '../../actions'
import {updateEmployee} from '../../graphql/employeeMutation'
import ModalStyle from '../styles/modal.style'
import WithDirection from '../../common/withDirection'
import {employeeFields} from './employeeFields'
const isoModal = ModalStyle(Modal)
const Modals = WithDirection(isoModal)

class EmployeeEdit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }
  handleFormSubmit(fields) {
    const {employee, reset} = this.props
    this.setState({loading: true})
    this.props.mutate({
      variables: {
        id: employee.id,
        ...fields,
      },
      // refetchQueries: [{query: fetchCompanyQuery, variables: {id: companyId}}],
    }).then(({data}) => {
      message.success('Processing complete!')
      reset()
      this.setState({loading: false, visible: false})
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.employee !== this.props.employee) {
      nextProps.loadEmployee(nextProps.employee)
    }
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

  renderFields(group) {
    const {intl: {formatMessage}} = this.props
    return values(group).map(field => {
      return (
        <Field
          key={field.key}
          {...field}
          addonBefore={field.addonBefore}
          name={field.value}
          label={formatMessage(field.localization)}
          component={field.component}
          placeholder={formatMessage(field.localization)}
        />

      )
    })
  }

  render() {
    const {handleSubmit, employee, intl: {formatMessage}} = this.props
    if (!employee) {
      return <div />
    }
    return (
      <div style={{marginRight: 30}}>
        <Form className="login-form">
          <Modals
            visible={this.state.visible}
            title={formatMessage(companiesMessages.companyEditEmployee)}
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

              {this.renderFields(employeeFields)}

            </div>
          </Modals>
        </Form>
      </div>

    )
  }
}


const EmployeeEditQL = graphql(updateEmployee)(EmployeeEdit)

const EmployeeEditForm = reduxForm({
  form: 'employeeEdit',
  enableReinitialize: true,
})(EmployeeEditQL)

export default connect(
  ({employee}) => ({
    initialValues: employee.record,
  }), {loadEmployee}
)(injectIntl(EmployeeEditForm))

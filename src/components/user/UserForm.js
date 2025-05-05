import React, {Component} from 'react'
import {values} from 'lodash'
import {Form, Modal, message, Button, notification} from 'antd'
import {reduxForm, Field} from 'redux-form'
import {graphql} from 'react-apollo'
import {addUserToOrganisation} from '../../graphql/userMutation'
import ModalStyle from '../styles/modal.style'
import WithDirection from '../../common/withDirection'
import {userFields} from './userFields'
const isoModal = ModalStyle(Modal)
const Modals = WithDirection(isoModal)

export const confirmPassword = password => rePassword =>
  password && rePassword && password === rePassword ? undefined : 'Passwords do not match!'


class AddUserToAgency extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }
  handleFormSubmit(fields) {
    const {companyId, reset} = this.props
    this.setState({loading: true})
    this.props.mutate({
      variables: {
        companyId: companyId,
        ...fields,
      },
    }).then(({data}) => {
      message.success('Processing complete!')
      reset()
      this.setState({loading: false, visible: false})
    }).catch(({message, locations, path}) => {
      this.setState({loading: false, visible: false})
      return notification.warning({
        message: 'Add User',
        description: message,
      })
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

  renderFields(group) {
    return values(group).map(field => {
      return (
        <Field
          key={field.key}
          {...field}
          addonBefore={field.addonBefore}
          name={field.value}
          label={field.label}
          component={field.component}
          placeholder={field.label}
        />

      )
    })
  }

  render() {
    const {handleSubmit} = this.props
    return (
      <div style={{marginRight: 30}}>
        <Form className="login-form">
          <Modals
            visible={this.state.visible}
            title="Add User"
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>Return</Button>,
              <Button
                key="submit"
                type="primary"
                loading={this.state.loading}
                onClick={handleSubmit(this.handleFormSubmit.bind(this))}
              >
              Submit
              </Button>,
            ]}
          >
            <div>
              <Field
                {...userFields.email}
                name="email"
                placeholder="Email"
              />
            </div>
          </Modals>
        </Form>
      </div>

    )
  }
}

const AddUserForm = reduxForm({
  form: 'user',
})(AddUserToAgency)

export default graphql(addUserToOrganisation)(AddUserForm)


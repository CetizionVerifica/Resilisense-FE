import React, { Component } from 'react'
import { values } from 'lodash'
import { Form, Modal, Button, message } from 'antd'
import { reduxForm, Field } from 'redux-form'
import { graphql } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { commonMessages, companiesMessages } from '../../messages'
import { addStakeholderToCompany } from '../../graphql/stakeholderMutation'
import ModalStyle from '../styles/modal.style'
import WithDirection from '../../common/withDirection'
import { stackholderFields } from './stackholderFields'
const isoModal = ModalStyle(Modal)
const Modals = WithDirection(isoModal)

class Stakeholder extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }
  handleFormSubmit(fields) {
    const { companyId, reset, refetch } = this.props
    this.setState({ loading: true })
    this.props.mutate({
      variables: {
        companyId: companyId,
        ...fields,
      },
      //refetchQueries: [{query: fetchCompanyQuery, variables: {id: companyId}}],
    }).then(({ data }) => {
      refetch()
      message.success('Processing complete!')
      reset()
      this.setState({ loading: false, visible: false })
    })
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextProps.visible && !nextState.visible) {
      this.setState({ visible: true })
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
  };

  handleCancel = () => {
    this.setState({ visible: false })
  };


  renderFields(group) {
    const { intl: { formatMessage } } = this.props
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
    const { handleSubmit, intl: { formatMessage }, title } = this.props
    return (
      <div style={{ marginRight: 30 }}>
        <Form className="login-form">
          <Modals
            visible={this.state.visible}
            title={formatMessage(title ? title : companiesMessages.btnAddNewStakeholder)}
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                {formatMessage(commonMessages.commonCancel)}
              </Button>,
              <Button key="submit"
                type="primary"
                loading={this.state.loading}
                onClick={handleSubmit(this.handleFormSubmit.bind(this))}
              >
                {formatMessage(commonMessages.commonSave)}
              </Button>,
            ]}
          >
            <div>

              {this.renderFields(stackholderFields)}

            </div>
          </Modals>
        </Form>
      </div>

    )
  }
}

const StakeholderForm = reduxForm({
  form: 'stakeholder',
})(Stakeholder)

export default graphql(addStakeholderToCompany)(injectIntl(StakeholderForm))

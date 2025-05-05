import React, {Component} from 'react'
import {values, get} from 'lodash'
import {Form, Modal, Steps, Button, notification} from 'antd'
import {reduxForm, Field} from 'redux-form'
import {graphql} from 'react-apollo'
import {injectIntl} from 'react-intl'
import {companiesMessages} from '../../messages'
import IntlMessages from '../utility/intlMessages'
import {addCompanyMutation} from '../../graphql/companyMutation'
import ModalStyle from '../styles/modal.style'
import WithDirection from '../../common/withDirection'
import {companyInformation, contactPerson} from './companyFields'

const isoModal = ModalStyle(Modal)
const Modals = WithDirection(isoModal)

const Step = Steps.Step

const steps = [
  {
    title: <IntlMessages {...companiesMessages.companyInformation} />,
    content: companyInformation,
    key: 1,
  },
  {
    title: <IntlMessages {...companiesMessages.companyContactPerson} />,
    content: contactPerson,
    key: 2,
  },
]

class Company extends Component {
  handleFormSubmit(fields) {
    const {refetch} = this.props
    this.setState({loading: true})
    this.props
      .mutate({
        variables: {
          ...fields,
          sector: get(fields, 'sectorType[0]', ''),
          type: get(fields, 'sectorType[1]', ''),
          users: this.props.currentUser ? [this.props.currentUser._id] : [],
        },
        //refetchQueries: [{query: fetchCompaniesQuery}],
      })
      .then(({data}) => {
        refetch()
        this.props.handleOk(data.addCompany.id)
        this.setState({loading: false, visible: false})
      })
      .catch(({message, locations, path}) => {
        this.setState({loading: false})
        return notification.warning({
          message: 'Create Company',
          description: message,
        })
      })
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      current: 0,
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
  };

  handleOk = () => {
    this.setState({loading: true})
    setTimeout(() => {
      this.props.handleOk()
      this.setState({loading: false, visible: false})
    }, 2000)
  };

  handleCancel = () => {
    this.setState({visible: false})
  };
  next() {
    const current = this.state.current + 1
    this.setState({current})
  }
  prev() {
    const current = this.state.current - 1
    this.setState({current})
  }

  renderFields(group) {
    const {
      intl: {formatMessage},
    } = this.props
    return values(group).map((field) => {
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
    const {
      handleSubmit,
      pristine,
      intl: {formatMessage},
    } = this.props
    return (
      <div style={{marginRight: 30}}>
        <Form className="login-form">
          <Modals
            visible={this.state.visible}
            title={formatMessage(companiesMessages.addNewCompany)}
            onCancel={this.handleCancel}
            footer={[
              <div className="steps-action" key={0}>
                {this.state.current < steps.length - 1 && (
                  <Button
                    type="primary"
                    disabled={pristine}
                    onClick={() => this.next()}
                  >
                    {formatMessage(companiesMessages.nextPage)}
                  </Button>
                )}
                {this.state.current > 0 && (
                  <Button style={{marginLeft: 8}} onClick={() => this.prev()}>
                    {formatMessage(companiesMessages.previousPage)}
                  </Button>
                )}
                {this.state.current === steps.length - 1 && (
                  <Button
                    type="primary"
                    onClick={handleSubmit(this.handleFormSubmit.bind(this))}
                    loading={this.state.loading}
                  >
                    {formatMessage(companiesMessages.companyDone)}
                  </Button>
                )}
              </div>,
            ]}
          >
            <div>
              <Steps
                style={{marginBottom: 20}}
                current={this.state.current}
                progressDot
              >
                {steps.map((item) => (
                  <Step key={item.key} title={item.title} />
                ))}
              </Steps>
              <div className="steps-content">
                {this.renderFields(steps[this.state.current].content)}
              </div>
            </div>
          </Modals>
        </Form>
      </div>
    )
  }
}

const CompanyForm = reduxForm({
  form: 'companyModel',
})(Company)

export default graphql(addCompanyMutation)(injectIntl(CompanyForm))

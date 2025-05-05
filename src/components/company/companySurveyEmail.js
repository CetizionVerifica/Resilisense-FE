import React, {Component} from 'react'
import {Row, Col, Button, message, Modal, notification,  Form} from 'antd'
import {connect} from 'react-redux'
import {reduxForm, Field} from 'redux-form'
import {injectIntl} from 'react-intl'
import {graphql} from 'react-apollo'
import Box from '../utility/box'
import { updateEmailTemplatesMutation} from '../../graphql/companyMutation'
import {companiesMessages} from '../../messages'
import {internalEmailTemplates, externalEmailTemplates} from './companyFields'
import basicStyle from '../../common/basicStyle'
import {values, get} from 'lodash'



const confirm = Modal.confirm


class CompanySettings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      current: 0,
    }
  }
  handleEmailMsgFormSubmit(fields) {
  
    const {companyId} = this.props
    this.setState({loading: true})
    this.props.mutate({
      variables: {
        ...fields,
      },
      //refetchQueries: [{query: fetchCompaniesQuery}],
    }).then(({data}) => {
      message.success('Processing complete!')
      this.setState({loading: false})
    }).catch(({message, locations, path}) => {
      this.setState({loading: false})
      return notification.warning({
        message: 'Update Company',
        description: message,
      })

    })
    //this.props.signinUser({email, password})
  }

  renderFields(group) {
    const {data, intl: {formatMessage}} = this.props
    return values(group).map(field => {
      return (
        <Field
          key={field.key}
          {...field}
          addonBefore={field.addonBefore}
          name={field.value}
          value={data[field.key]}
          label={formatMessage(field.localization)}
          component={field.component}
          placeholder={formatMessage(field.localization)}
        />
      )
    })
  }

  render() {
    const {handleSubmit, intl: {formatMessage}} = this.props
    const {rowStyle, colStyle, gutter} = basicStyle
    return (
      <div style={{marginRight: 30}}>
        <Form onSubmit={handleSubmit(this.handleEmailMsgFormSubmit.bind(this))} className="login-form">
          <Row style={rowStyle} justify="space-between" gutter={gutter}>
            <Col md={12} sm={24} xs={24} style={colStyle}>
              <Box title={formatMessage(companiesMessages.internalEmailMsgTitle)} bordered>
                {this.renderFields(internalEmailTemplates)}
              </Box>
            </Col>
            <Col md={12} sm={24} xs={24} style={colStyle}>
              <Box title={formatMessage(companiesMessages.externalEmailMsgTitle)} bordered>
                {this.renderFields(externalEmailTemplates)}
              </Box>
            </Col>
          </Row>
          <div style={{marginTop: 20, textAlign: 'right'}}>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={this.state.loading}
            >
              {formatMessage(companiesMessages.companyDone)}
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}


//   render() {
//     const {handleSubmit, intl: {formatMessage}} = this.props
//     const {rowStyle, colStyle, gutter} = basicStyle
//   //const {data, intl: {formatMessage}} = this.props


//     return (
//       <Row style={rowStyle} justify="space-between" gutter={gutter}>

//       <Col md={12} sm={12} xs={12} style={colStyle}>
//         <Form onSubmit={handleSubmit(this.handleEmailMsgFormSubmit.bind(this))} className="login-form">
        
//         <Box bordered>
//                 {this.renderFields(internalEmailTemplates)}
//         </Box>

//         <div style={{marginTop: 20, textAlign: 'right'}} />

//         <Button
//           type="success"
//           loading={this.state.loading}
//           onClick={this.handleEmailMsgFormSubmit.bind(this)}
//           className="login-form-button"
//         >
//                     Update
//         </Button>
//       </Form>

//       </Col>

//       <Col md={12} sm={12} xs={12} style={colStyle}>
//       <Form onSubmit={handleSubmit(this.handleEmailMsgFormSubmit.bind(this))} className="login-form">
        
//         <Box  bordered>
//                 {this.renderFields(externalEmailTemplates)}
//         </Box>

//         <div style={{marginTop: 20, textAlign: 'right'}} />

//         <Button
//           type="success"
//           loading={this.state.loading}
//           onClick={this.handleEmailMsgFormSubmit.bind(this)}
//           className="login-form-button"
//         >
//                     Update
//         </Button>
//       </Form>

//       </Col>
//       </Row>

//     )
//   }
// }


const CompanySettingsForm = reduxForm({
  form: 'templates',
  enableReinitialize: true,
})(CompanySettings)

const InitializeCompanySettingsForm = connect(
  
  (state, ownProps) => ({
    initialValues: {
      ...ownProps.data,
   //   sectorType: [get(ownProps.data, 'sector'), get(ownProps.data, 'type')],
    },
  }),
)(CompanySettingsForm)

export default graphql(updateEmailTemplatesMutation)(injectIntl(InitializeCompanySettingsForm))

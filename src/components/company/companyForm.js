import React, {Component} from 'react'
import {values, get, omit} from 'lodash'
import {connect} from 'react-redux'
import {SelectField} from 'redux-form-antd'
import {Form, Row, Col, Button, message, notification} from 'antd'
import {reduxForm, Field} from 'redux-form'
import {graphql, compose} from 'react-apollo'
import {injectIntl} from 'react-intl'
import {updateCompanyMutation} from '../../graphql/companyMutation'
import fetchUserFromRole from '../../graphql/fetchUserByRole'
import Box from '../utility/box'
import {companiesMessages} from '../../messages'
import {companyInformation, contactPerson} from './companyFields'
import basicStyle from '../../common/basicStyle'

class Company extends Component {

  constructor(props) {

    super(props)
    this.state = {
      visible: false,
      current: 0,
    }
  }

  handleFormSubmit(fields) {
    this.setState({loading: true})
    this.props.mutate({
      variables: {
        ...fields,
        sector: get(fields, 'sectorType[0]', ''),
        type: get(fields, 'sectorType[1]', ''),
      },
      //refetchQueries: [{query: fetchCompaniesQuery}],
    }).then(({data}) => {
      //console.log(data.addCompany.id)
      message.success('Processing complete!')
      this.setState({loading: false, visible: false})
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
    const {data, handleSubmit, intl: {formatMessage}, fetchUserFromRole: {userByRole}, userRole} = this.props
    const {rowStyle, colStyle, gutter} = basicStyle
    const companyFields = userRole.includes('Admin') || userRole.includes('Reseller') ? companyInformation : {...companyInformation, lisence: {...companyInformation.lisence, disabled: true}}
    return (
      <div style={{marginRight: 30}}>
        <Form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className="login-form">
          <Row style={rowStyle} justify="space-between" gutter={gutter}>
            <Col md={12} sm={24} xs={24} style={colStyle}>
              <Box title={formatMessage(companiesMessages.companyInformation)} bordered>
                {this.renderFields(companyFields)}

                {userRole.includes('Admin') && userByRole && <Field
                  key="reseller"
                  options={userByRole.map(item => {
                    return {
                      label: item.name,
                      value: item._id,
                    }
                  })}
                  name="reseller"
                  value={data.reseller}
                  label="Resellers"
                  component={SelectField}
                  placeholder={'Resellers'}
                />}
              </Box>
            </Col>
            <Col md={12} sm={24} xs={24} style={colStyle}>
              <Box title={formatMessage(companiesMessages.companyContactPerson)} bordered>
                {this.renderFields(contactPerson)}
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

const CompanyForm = reduxForm({
  form: 'company',
  enableReinitialize: true,
})(Company)

const CompanyFormQl = compose(
  graphql(fetchUserFromRole, {
    name: 'fetchUserFromRole',
    options: () => {
      return {
        variables: {
          role: 'Reseller',
        },
      }
    },
  }),
)(CompanyForm)

const InitializeCompanyForm = connect(
  (state, ownProps) => ({
    initialValues: {
      ...ownProps.data,
      sectorType: [get(ownProps.data, 'sector'), get(ownProps.data, 'type')],
    },
    userRole: state.auth.currentUser ? state.auth.currentUser.role.split('|') : [],
  }),
)(CompanyFormQl)

export default graphql(updateCompanyMutation)(injectIntl(InitializeCompanyForm))

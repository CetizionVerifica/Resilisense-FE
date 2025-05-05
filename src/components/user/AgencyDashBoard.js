import React, {Component} from 'react'
import {get, values} from 'lodash'
import moment from 'moment'
import {Tabs, Row, Col, Card, message, Form, Button} from 'antd'
import {graphql, compose} from 'react-apollo'
import {connect} from 'react-redux'
import {reduxForm, Field} from 'redux-form'
import fetchAgencyQuery from '../../graphql/fetchAgency'
import {updateAgency} from '../../graphql/agencyMutation'
import basicStyle from '../../common/basicStyle'
import PageHeader from '../utility/pageHeader'
import Box from '../utility/box'
import {breadcrumbUpdate} from '../../actions'
import LayoutWrapper from '../utility/layoutWrapper'
import {agencyFields} from './userFields'
import UsersList from './UsersList'

const TabPane = Tabs.TabPane

class AgencyDashBoard extends Component {
  state = {
    loading: false,
    agencyId: this.props.agencyId,
  }

  componentWillReceiveProps(nextprops) {
    if (this.state.agencyId !== nextprops.agencyId) {
      this.setState({agencyId: nextprops.agencyId})
    }
  }
  componentDidMount() {
    const breadcrumb = [{name: 'Home', link: '/'}, {name: 'My Organization'}]
    this.props.breadcrumbUpdate(breadcrumb)
  }
  handleFormSubmit(fields) {
    this.setState({loading: true})
    this.props.updateAgency({
      variables: {
        ...fields,
      },
      //refetchQueries: [{query: fetchCompaniesQuery}],
    }).then(({data}) => {
      //console.log(data.addCompany.id)
      message.success('Processing complete!')
      this.setState({loading: false, visible: false})
    })
    //this.props.signinUser({email, password})
  }


  renderFields(group) {
    const {fetchAgencyQuery: {agency}} = this.props
    return values(group).map(field => {
      return (
        <Field
          key={field.key}
          {...field}
          addonBefore={field.addonBefore}
          name={field.value}
          value={agency[field.key]}
          label={field.label}
          component={field.component}
          placeholder={field.label}
        />
      )
    })
  }

  render() {
    const {rowStyle, colStyle, gutter, greyColor} = basicStyle
    const {fetchAgencyQuery: {agency}, handleSubmit} = this.props

    if (!agency) {
      return <div />
    }
    return (
      <LayoutWrapper>
        <PageHeader>{get(agency, 'name')}</PageHeader>
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box>

              <Col md={18} sm={18} xs={24} style={colStyle}>

                <Card bordered={false}>
                  <h4> Name: <span style={greyColor} >
                    {get(agency, 'name')}  </span>
                  </h4>
                  <h4> Description: <span style={greyColor} >
                    {get(agency, 'descriptions')}  </span>
                  </h4>
                  <h4> Email: <span style={greyColor} >
                    {get(agency, 'email')}  </span>
                  </h4>
                  <h4> Phone: <span style={greyColor} >
                    {get(agency, 'phone')} </span>
                  </h4>
                  <h4> Country: <span style={greyColor} >
                    {get(agency, 'country')} </span>
                  </h4>
                  <h4> Website: <span style={greyColor} >
                    {get(agency, 'website')} </span>
                  </h4>
                  <h4> Industry: <span style={greyColor} >
                    {get(agency, 'industry')} </span>
                  </h4>

                  <h4> Date created: <span style={greyColor} >
                    {moment(get(agency, 'date')).format('DD/MM/YYYY hh:mm')}
                  </span>
                  </h4>
                </Card>

              </Col>


            </Box>
          </Col>
        </Row>
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box>
              <Tabs animated={false} defaultActiveKey="1" >
                <TabPane tab="Details" key="1">
                  <Form
                    onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
                    className="login-form"
                  >
                    <Box bordered>
                      {this.renderFields(agencyFields)}
                    </Box>

                    <div style={{marginTop: 20, textAlign: 'right'}}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        loading={this.state.loading}
                      >
                        Save
                      </Button>
                    </div>
                  </Form>
                </TabPane>
                <TabPane tab="User" key="2">
                  <UsersList users={get(agency, 'users')} />
                </TabPane>
              </Tabs>
            </Box>
          </Col>
        </Row>
      </LayoutWrapper>

    )
  }
}

const AgencyForm = reduxForm({
  form: 'updateAgency',
  enableReinitialize: true,
})(AgencyDashBoard)

const InitializeAgencyForm = connect(
  ({app}, ownProps) => ({
    agencyId: app.agency,
    initialValues: get(ownProps, 'fetchAgencyQuery.agency'),
  }), {breadcrumbUpdate}
)(AgencyForm)

export default compose(
  graphql(updateAgency, {
    name: 'updateAgency',
  }),
  graphql(fetchAgencyQuery, {
    name: 'fetchAgencyQuery',
    fetchPolicy: 'network-only',
  }),
)(InitializeAgencyForm)



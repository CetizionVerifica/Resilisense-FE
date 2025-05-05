import React, {Component} from 'react'
import {Row, Col, Tabs} from 'antd'
import {get} from 'lodash'
import {graphql} from 'react-apollo'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import {breadcrumbUpdate} from '../../actions'
import fetchCompanyQuery from '../../graphql/fetchCompany'
import basicStyle from '../../common/basicStyle'
import PageHeader from '../utility/pageHeader'
import LayoutWrapper from '../utility/layoutWrapper'
import Box from '../utility/box'
import WithDirection from '../../common/withDirection'
import {companiesMessages} from '../../messages'
import EmplayeesList from '../employees/EmployeesList'
import StackholderList from '../stackholders/StackholderList'
import ProjectsList from '../project/ProjectsList'
import ActionAndKPIList from '../actionsAndKPIs/CompanyActionAndKPIList'
import Company from './companyForm'
import CompanyEmail from './companySurveyEmail'

import CompanySettings from './companySettings'

const TabsWithDirection = WithDirection(Tabs)
const TabPane = WithDirection(Tabs.TabPane)


class CompanyEdit extends Component {
  // componentWillUpdate(nextprops) {
  //   const {data: {company}, breadcrumbUpdate} = nextprops
  //   if (company) {
  //     const breadcrumb = [{name: 'Home', link: '/'},
  //       {name: get(company, 'name')},
  //     ]
  //     breadcrumbUpdate(breadcrumb)
  //   }
  // }
  render() {
    const {data: {company}, intl: {formatMessage}, userRole } = this.props
    const {rowStyle, colStyle, gutter} = basicStyle
    if (!company) {
      return <div />
    }
    return (
      <LayoutWrapper>
        <PageHeader><span> {company.name }</span></PageHeader>
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box>
              <TabsWithDirection defaultActiveKey="1" >
                <TabPane tab={formatMessage(companiesMessages.companyDetails)} key="1">
                  <Company data={company} />
                </TabPane>
                <TabPane tab={formatMessage(companiesMessages.companyProjects)} key="2">
                  <ProjectsList companyId={company.id} />
                </TabPane>
                
                {!userRole.includes('Admin') && !userRole.includes('Reseller')  &&
                <TabPane tab={formatMessage(companiesMessages.companyEmployees)} key="3">
                  <EmplayeesList companyId={company.id} />
                </TabPane>
  }
  {!userRole.includes('Admin') && !userRole.includes('Reseller')  &&
                <TabPane tab={formatMessage(companiesMessages.companyStakeholders)} key="4">
                  <StackholderList companyId={company.id} />
                </TabPane>
  }
  {!userRole.includes('Admin') && !userRole.includes('Reseller')  &&
                <TabPane tab={formatMessage(companiesMessages.companyActionsKPIs)} key="5">
                  <ActionAndKPIList companyId={company.id} />
                </TabPane>
  }
                <TabPane tab={formatMessage(companiesMessages.companyEmailTemplates)} key="6">
                  <CompanyEmail data={company} />
                </TabPane>
               

              </TabsWithDirection>
            </Box>
          </Col>
        </Row>
      </LayoutWrapper>
    )
  }
}


const CompanyEditQL = graphql(fetchCompanyQuery, {
  options: (props) => {return {variables: {id: props.match.params.id}}},
})(CompanyEdit)

export default connect(null, {breadcrumbUpdate})(injectIntl(CompanyEditQL))

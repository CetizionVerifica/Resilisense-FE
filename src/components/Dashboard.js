import React, {Component} from 'react'
import {Button, Row, Col, Modal} from 'antd'
import {graphql} from 'react-apollo'
import {connect} from 'react-redux'
import {dashboardMessages} from '../messages/dashboard'
import {breadcrumbUpdate} from '../actions'
import {fetchProjects} from './../graphql/fetchProjects'
import basicStyle from '../common/basicStyle'
import CsrInfo from '../common/csrInfo'
import PageHeader from './utility/pageHeader'
import Box from './utility/box'
import IntlMessages from './utility/intlMessages'
import TableWrapper from './styles/table.style'
import {columns} from './project/ProjectsListConfig'
import LayoutWrapper from './utility/layoutWrapper'
//import {InputSearch} from './utility/inputSearch'
import {withRouter} from 'react-router-dom'
import Fundinglogo from '../images/img3.jpg'
import EuLogo from '../images/img2.jpg'
import cyprusLogo from '../images/img1.jpg'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      visible: false,
      current: 0,
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
    })
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    })
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    })
  }

  onChange(date, dateString) {
    // console.log(date, dateString)
  }
  componentDidMount() {
    const {breadcrumbUpdate} = this.props
    const breadcrumb = [{name: 'Home'}]
    breadcrumbUpdate(breadcrumb)
  }

  render() {
    const {rowStyle, colStyle, gutter} = basicStyle
    const {
      data: {loading, projects},
      userRole,
    } = this.props

    if (!projects) {
      return <div />
    }
    return (

      <LayoutWrapper>
        <PageHeader>
          <IntlMessages {...dashboardMessages.titleWelcome} />
        </PageHeader>

        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box >

              <p><IntlMessages {...dashboardMessages.dashboardIntro1} /></p>
              <p><IntlMessages {...dashboardMessages.dashboardIntro2} /></p>
              <p><IntlMessages {...dashboardMessages.dashboardIntro3} /></p>
              <Button type="primary" onClick={this.showModal}>
                <IntlMessages {...dashboardMessages.btnReadMore} />
              </Button>
            </Box>
            <Modal
              title={<IntlMessages {...dashboardMessages.titleWelcome} />}
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              width="80%"
            >
              <CsrInfo />
            </Modal>
          </Col>

        </Row>

        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          {userRole !== 'Admin' && <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box title={<IntlMessages {...dashboardMessages.latestProjects} />} >
              <TableWrapper
                size="small"
                columns={columns}
                dataSource={projects}
                loading={loading}
                rowKey="id"
                className="sortingTable"
                pagination={projects.length > 10}
              />
            </Box>
          </Col>}
          {/*<Col md={8} sm={12} xs={24} style={colStyle}>
            <Box title={<IntlMessages {...dashboardMessages.titleSearch} />} bordered>
              <Row style={{marginBottom: 15}}>

                <Col span={24}><InputSearch
                  placeholder={<IntlMessages {...dashboardMessages.searchProject} />}
                  className="isoSearchNotes"
                  value={this.state.search}
                  onChange={this.onChange}
                /></Col>
    </Row>
              <Row style={{marginBottom: 15}} justify="space-between" gutter={gutter}>
                <Col span={12}>
                  <label>{<IntlMessages {...dashboardMessages.fromDate} />}</label>
                  <DatePicker style={{width: '100%'}} onChange={this.onChange} />
                </Col>
                <Col span={12}>
                  <label style={{display: 'block'}}>{<IntlMessages {...dashboardMessages.toDate} />}</label>
                  <DatePicker style={{width: '100%'}} onChange={this.onChange} />
                </Col>
              </Row>
              <Row style={{marginBottom: 15}} justify="space-between" gutter={gutter}>
                <Col span={24}>
                  <label style={{display: 'block'}}>
                    {<IntlMessages {...dashboardMessages.dashboardUser} />}
                  </label>
                  <Select style={{width: '100%'}} onChange={this.onChange}>
                    {users.map(user => (<Option key={user._id} value={user._id}>{user.name}</Option>))}
                  </Select>
                </Col>
              </Row>
              <Row style={{marginBottom: 15}} justify="space-between" gutter={gutter}>
                <Col span={24}>
                  <Button type="primary" className="" onClick={() => this.props.history.push('/projects')}>
                    {<IntlMessages {...dashboardMessages.btnSearch} />}
                  </Button>
                </Col>

              </Row>
            </Box>
          </Col>*/}
        </Row>
        <div style={{width: '100%'}}>
          <Box>
            <Row justify="space-between" gutter={gutter}>
              <Col md={8} sm={12} xs={24} style={{textAlign: 'center'}}>
                <img alt="logo" src={cyprusLogo} style={{width: 100}} />
              </Col>
              <Col md={8} sm={12} xs={24} style={{textAlign: 'center'}}>
                <img alt="logo" src={EuLogo} style={{width: 100}} />
              </Col>
              <Col md={8} sm={12} xs={24} style={{textAlign: 'center'}}>
                <img alt="logo" src={Fundinglogo} style={{width: 100}} />
              </Col>

            </Row>
          </Box>
        </div>
      </LayoutWrapper>
    )
  }
}


const DashboardQL = graphql(fetchProjects, {
  options: (props) => {
    return {
      variables: {
        sort: 'date',
        order: 'desc',
        limit: 5,
      },
    }
  },
})(Dashboard)

function mapStateToProps({intl, auth}) {
  const {messages, locale} = intl
  return {
    messages,
    locale,
    userRole: auth.currentUser ? auth.currentUser.role : null,
  }
}
export default connect(mapStateToProps, {breadcrumbUpdate})(withRouter(DashboardQL))

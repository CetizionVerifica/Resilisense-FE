import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Layout, Breadcrumb, Icon, Tooltip} from 'antd'
import {withApollo} from 'react-apollo'
import fetchUserQuery from '../../graphql/fetchUser'
import TopbarUser from './TopBarUser'
import TopBarAgency from './TopBarAgency'
import TopBarLanguage from './TopBarLanguage'
import TopbarWrapper from './topbar.style'
import { setSelectedMenu} from '../../actions'


const {Header} = Layout


function Topbar(props) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    async function fetchUser() {
      const result = await props.client.query({ query: fetchUserQuery})
      setUser(result.data.user)
    }
    fetchUser()
  }, [])

  function renderBreadcumb(breadcrumb) {
    return breadcrumb.map((item, index) => {
    const selected = item.name === 'Home' ? ['performance'] : [item.indicator]

      return (<Breadcrumb.Item onClick={() => props.setSelectedMenu(selected)} key={index} >
        {item.link ? <Link to={item.link}>{item.name}</Link> : item.name }
      </Breadcrumb.Item>)
    })
  }

    const collapsed = props.collapsed && !props.openDrawer
    const { locale, currentUser} = props
    const styling = {
      background: '#fff',
      width: '100%',
      height: 50,
    }

    return (
      <TopbarWrapper>
        <Header
          style={styling}
          className={
            collapsed ? 'isomorphicTopbar collapsed' : 'isomorphicTopbar'
          }
        >

          <div className="isoLeft">
            <TopBarAgency currentUser={user} />
          </div>
          <ul className="isoRight">
            <li
              // onClick={() => this.setState({selectedItem: 'user'})}
              className="isoUser"
            >
              <Tooltip placement="bottom" title="Support">
                <a className="isoDropdownLink"
                  href="https://seven-toolkit.atlassian.net/servicedesk/customer/portal/2" target="_blank"
                >
                  <Icon type="customer-service" />
                </a>
              </Tooltip>
            </li>
         {/*  <li
              onClick={() => this.setState({selectedItem: 'user'})}
              className="isoUser"
            >
              <Tooltip placement="bottom" title="Help">
                <Link className="isoDropdownLink" to="/helps">
                  <Icon type="question-circle-o" />
                </Link>
              </Tooltip>
            </li>*/}
            <li
              // onClick={() => this.setState({selectedItem: 'user'})}
              className="isoUser"
            >
              <TopBarLanguage currentUser={user} locale={locale} />
            </li>
            <li
              // onClick={() => this.setState({selectedItem: 'user'})}
              className="isoUser"
            >
              <TopbarUser currentUser={user} />
            </li>
          </ul>
        </Header>
        <div className="breadcrumb">
          <Breadcrumb separator=">">
            {renderBreadcumb(props.breadcrumb)}
          </Breadcrumb>
        </div>
      </TopbarWrapper>
    )
}
function mapStateToProps({app, auth}) {
  const {breadcrumb, locale, agency} = app
  return {breadcrumb, locale, auth, agency, currentUser: auth.currentUser}
}

// const AppQL = graphql(fetchUserQuery)(Topbar)
export default connect(mapStateToProps, { setSelectedMenu })(withApollo(Topbar))

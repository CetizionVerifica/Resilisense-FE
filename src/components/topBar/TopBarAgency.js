import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {get} from 'lodash'
import {injectIntl} from 'react-intl'
import {Menu, Dropdown, Icon, message} from 'antd'
import {graphql} from 'react-apollo'
import {currentAgencyUser} from '../../graphql/userMutation'
import {fetchProjects} from '../../graphql/fetchProjects'
import fetchUserQuery from '../../graphql/fetchUser'
import fetchAgencyQuery from '../../graphql/fetchAgency'
import {menusMessages} from '../../messages'
import {agencySwitch} from '../../actions'


class TopbarAgency extends Component {
  constructor(props) {
    super(props)
    this.handleVisibleChange = this.handleVisibleChange.bind(this)
    this.hide = this.hide.bind(this)
    this.state = {
      visible: false,
    }
  }
  hide() {
    this.setState({visible: false})
  }
  handleVisibleChange() {
    this.setState({visible: !this.state.visible})
  }

  changeAgency = (agency) => () => {
    const {currentUser, agencySwitch} = this.props
    this.setState({loading: true})
    this.props.mutate({
      variables: {
        id: currentUser._id,
        agency,
      },
      refetchQueries: [
        {query: fetchUserQuery},
        {query: fetchAgencyQuery},
        {
          query: fetchProjects,
          variables: {sort: 'date', order: 'desc', limit: 5},
        }],
    }).then(({data}) => {
      message.success('Processing complete!')
      agencySwitch(agency)
      this.props.history.push('/')

    })
  }

  render() {
    const {currentUser, intl: {formatMessage}} = this.props
    const menu = (
      <Menu>
        {get(currentUser, 'agencies', []).map(agency => {
          return (<Menu.Item key={agency.id}>
            <a className="isoDropdownLink"
              onClick={this.changeAgency(agency.id)}
            >
              {get(agency, 'name')}
            </a>
          </Menu.Item>)
        })}

      {/*}  <Menu.Divider />
        <Menu.Item key="3" >
          <Link className="isoDropdownLink" to="/new-organization">
            {formatMessage(menusMessages.topMenucreateOrganization)}
          </Link>
        </Menu.Item>*/}
      </Menu>
    )

    return (
      <Dropdown overlay={menu} >
        <div className="ant-dropdown-link">
          <Icon type="appstore-o" />
          <span style={{padding: '0px 10px'}}>{get(currentUser, 'currentAgency.name')}</span>
          <Icon type="down" />
        </div>
      </Dropdown>
    )
  }
}

const TopbarAgencyQL = graphql(currentAgencyUser)(withRouter(TopbarAgency))
export default connect(null, {agencySwitch})(injectIntl(TopbarAgencyQL))

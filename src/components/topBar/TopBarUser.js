import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {get} from 'lodash'
import {injectIntl} from 'react-intl'
import {Popover, Avatar} from 'antd'
import {menusMessages} from '../../messages'
//import IntlMessages from '../utility/intlMessages'
import {openModal} from '../modals/modalActions'

import {signoutUser} from '../../actions'
import TopbarDropdownWrapper from './topbarDropdown.style'

class TopbarUser extends Component {
  constructor(props) {
    super(props)
    this.handleVisibleChange = this.handleVisibleChange.bind(this)
    this.hide = this.hide.bind(this)
    this.state = {
      visible: false,
    }
  }
  componentWillMount() {
    const {currentUser} = this.props
    if (currentUser && !currentUser.termsAndConditions) {
      this.props.openModal('UserLicenseModal')
    }
  }
  componentWillReceiveProps(nextporp) {
    const {currentUser} = nextporp
    if (currentUser && !currentUser.termsAndConditions) {
      this.props.openModal('UserLicenseModal')
    }
  }
  hide() {
    this.setState({visible: false})
  }
  handleVisibleChange() {
    this.setState({visible: !this.state.visible})
  }
  setAvatrName(name) {
    if (!name) {
      return null
    }
    const initials = name.match(/\b\w/g) || []
    return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase()
  }
  render() {
    const {currentUser, intl: {formatMessage}} = this.props
    const content = (
      <TopbarDropdownWrapper className="isoUserDropdown">
        <Link className="isoDropdownLink" to={'/my-profile'}>
          {formatMessage(menusMessages.topMenuMyProfileSettings)}
        </Link>
        <Link className="isoDropdownLink" to="/my-organization">
          {formatMessage(menusMessages.topMenuMyCompanySettings)}
        </Link>
        <a className="isoDropdownLink" onClick={this.props.signoutUser}>
          {formatMessage(menusMessages.topMenuLogout)}
        </a>
      </TopbarDropdownWrapper>
    )

    return (
      <Popover
        content={content}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        arrowPointAtCenter
        placement="bottomLeft"
      >
        <div className="isoImgWrapper">
          <Avatar style={{backgroundColor: '#f56a00',
            verticalAlign: 'middle',
            textTransform: 'uppercase'}} size="large"
          >
            {this.setAvatrName(get(currentUser, 'name'))}
          </Avatar>
          {/*<span className="userActivity" />*/}
        </div>
      </Popover>
    )
  }
}
export default connect(null, {signoutUser, openModal})(injectIntl(TopbarUser))

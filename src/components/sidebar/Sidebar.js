import React, {Component} from 'react'
import {connect} from 'react-redux'
import ClientSidebar from './ClientSidebar'

class Sidebar extends Component {

  render() {

    const {userRole} = this.props

    return <ClientSidebar {...this.props} />
  }
}

function mapStateToProps({auth}) {
  return {
    userRole: auth.currentUser ? auth.currentUser.role : null,
  }
}

export default connect(mapStateToProps)(Sidebar)

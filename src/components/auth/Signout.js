import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {signoutUser} from '../../actions'

class Signout extends Component {
  componentWillMount() {
    this.props.signoutUser()
  }
  render() {
    return (
      <Redirect push to="/signin" />
    )
  }
}

function mapStateToProps({auth}) {
  return {
    authenticated: auth.authenticated,
  }
}

export default connect(mapStateToProps, {signoutUser})(Signout)

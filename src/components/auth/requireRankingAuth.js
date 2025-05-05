import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

export default function(ComposedComponent) {
  class AdminAuthentication extends Component {
    static contextTypes = {
      router: PropTypes.object,
    }
    componentWillMount() {
      if (!this.props.authenticated) {
        this.context.router.history.push('/signin')
      }

      if (this.props.userRole !== null && !this.props.userRole.includes('Ranking')) {
        this.context.router.history.push('/')
      }
    }
    componentWillUpdate(nextProps) {
      if (!nextProps.authenticated) {
        this.context.router.history.push('/signin')
      }

      if (!nextProps.userRole.includes('Ranking')) {
        this.context.router.history.push('/')
      }
    }
    render() {
      return <ComposedComponent {...this.props} />
    }
  }
  function mapStateToProps({auth}) {
    return {
      authenticated: auth.authenticated,
      userRole: auth.currentUser ? auth.currentUser.role.split('|') : null,
    }
  }

  return connect(mapStateToProps)(AdminAuthentication)
}

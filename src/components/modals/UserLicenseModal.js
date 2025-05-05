import React, {Component} from 'react'
import {Modal} from 'antd'
import {connect} from 'react-redux'
import TermsAndConditions from '../termsAndConditions/termsAndConditions'
import {closeModal} from './modalActions'

const actions = {closeModal}

class UserLicenseModal extends Component {
  render() {
    return (
      <Modal
        size="mini"
        visible
        title="Terms And Conditions"
        onCancel={this.props.closeModal}
        footer=""
        closable={false}
        maskClosable={false}
      >
        <TermsAndConditions onCancel={this.props.closeModal} />
      </Modal>
    )
  }
}

export default connect(null, actions)(UserLicenseModal)

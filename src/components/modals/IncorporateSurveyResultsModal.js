import React, {Component} from 'react'
import {Modal, Button} from 'antd'
import {connect} from 'react-redux'
import {closeModal} from './modalActions'

const actions = {closeModal}

class IncorporateSurveyResultsModal extends Component {

  handleAccept = () => {
    const {closeModal, acceptDisclaimer} = this.props
    closeModal()
    acceptDisclaimer()
  }

  render() {
    return (
      <Modal
        size="mini"
        visible
        title="Disclaimer"
        onCancel={this.props.closeModal}
        footer={[
          <Button key="back" onClick={this.props.closeModal}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={this.handleAccept}>OK</Button>,
        ]}
        closable={false}
        maskClosable={false}
      >
        <div>
          <span>Proceeding will produce the materiality matrices (end-results) based on a CSR survey
            response rate of <strong>{this.props.externalResponsePercentage}%</strong> for external stakeholders
            and <strong>{this.props.internalResponsePercentage}%</strong> for internal stakeholders. Do you wish to proceed?</span>
        </div>
      </Modal>
    )
  }
}

export default connect(null, actions)(IncorporateSurveyResultsModal)

import React, {Component} from 'react'
import {Modal, Button} from 'antd'
import {connect} from 'react-redux'
import {closeModal} from './modalActions'

const actions = {closeModal}

class SupplierRequestDisclaimerModal extends Component {

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
          <Button key="back" onClick={this.props.closeModal}>Return</Button>,
          <Button key="submit" type="primary" onClick={this.handleAccept}>Accept</Button>,
        ]}
        closable={false}
        maskClosable={false}
      >
        <div>
          <span>By clicking accept, you are accepting the supplier request</span>
        </div>
      </Modal>
    )
  }
}

export default connect(null, actions)(SupplierRequestDisclaimerModal)

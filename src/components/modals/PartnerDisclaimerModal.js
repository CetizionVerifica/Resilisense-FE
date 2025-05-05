import React, {Component} from 'react'
import {Modal, Button} from 'antd'
import {connect} from 'react-redux'
import {closeModal} from './modalActions'

const actions = {closeModal}

class PartnerDisclaimerModal extends Component {

  handleAccept = () => {
    const {closeModal, acceptDisclaimer} = this.props
    closeModal()
    acceptDisclaimer()
  }

  render() {

    const {companyName} = this.props

    return (
      <Modal
        size="mini"
        visible
        title="Disclaimer"
        onCancel={this.props.closeModal}
        footer={[
          <Button key="back" onClick={this.props.closeModal}>I do not wish to proceed</Button>,
          <Button key="submit" type="primary" onClick={this.handleAccept}>I provide consent</Button>,
        ]}
        closable={false}
        maskClosable={false}
      >
        <div>
          <p>'{companyName}' has requested to link with you, as one of their main suppliers, in order to initiate communication and sharing of your data.
          As part of '{companyName}'’s supply chain risk management exercise, you will be required to carry out
          a Gap Analysis - a self-assessment of your current performance with respect to a set of Corporate Social Responsibility (CSR)
          criteria '{companyName}' has prepared with The 7 Toolkit.
          Upon successful completion of the Gap Analysis, <strong>your data and results specific to the Gap Analysis will then be shared
          with '{companyName}'. You are therefore required to provide your consent for sharing your Gap Analysis data
          with '{companyName}' before you can proceed with data entry.</strong></p>

          <p>The 7 Toolkit also offers a range of other features such as Materiality Assessment,
            Stakeholder Engagement and Actions and KPIs. Please note that if you opt to use these features,
            your data and results will not be shared with '{companyName}',
            or any other third party you choose to link with in the future via the 7 Toolkit.
            Only data pertaining to the Gap Analysis will be shared with the partner you choose to link to.</p>
        </div>
      </Modal>
    )
  }
}

export default connect(null, actions)(PartnerDisclaimerModal)

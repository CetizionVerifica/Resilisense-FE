import React, {Component} from 'react'
import {Modal, Button} from 'antd'
import {connect} from 'react-redux'
import {coreSubjectNames} from '../../common/coreSubjectNames'
import {closeModal} from './modalActions'

const actions = {closeModal}

class RemainingSettingsModal extends Component {
  render() {
    return (
      <Modal
        size="mini"
        visible
        title="Outstanding information"
        onCancel={this.props.closeModal}
        footer={[
          <Button key="back" onClick={this.props.closeModal}>Return</Button>,
        ]}
        closable={false}
        maskClosable={false}
      >
        <div>
          <div style={{marginBottom: 10}}>
            <span>All required information must be provided before proceeding to submission.
              There are certain key considerations for which documentation has not been uploaded and/or scores have not been allocated.
              Outstanding points are outlined below:</span>
          </div>
          {this.props.remainingSettings.map(setting => {

            const warnings = []
            if (setting.files > 0) {
              warnings.push(`${setting.files} missing documentation`)
            }

            if (setting.scores > 0) {
              warnings.push(`${setting.scores} missing scores`)
            }

            return (<div key={setting.key}>
              <strong>{coreSubjectNames[setting.key].label}:</strong> {warnings.join(' and ')}
            </div>)
          })}
        </div>
      </Modal>
    )
  }
}

export default connect(null, actions)(RemainingSettingsModal)

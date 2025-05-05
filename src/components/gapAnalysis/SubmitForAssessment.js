import React, {Component} from 'react'
import {Modal, message, Button} from 'antd'
import {graphql} from 'react-apollo'
import {injectIntl} from 'react-intl'
import {changeProjectStatus} from '../../graphql/projectMutation'
import {projectStatuses} from '../../common/enum/projectStatuses'
import {firstAssessmentNotification, finalAssessmentNotification} from '../../actions/UserActions'
import ModalStyle from '../styles/modal.style'
import WithDirection from '../../common/withDirection'

const isoModal = ModalStyle(Modal)
const Modals = WithDirection(isoModal)

class SubmitForAssessment extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }
  handleProjectSubmit = () => {
    const {projectId, projectStatus, companyName} = this.props
    this.setState({loading: true})

    let status = projectStatuses.firstAssessmentRequest.value

    if (projectStatus === projectStatuses.firstAssessmentCompleted.value) {
      status = projectStatuses.secondAssessmentRequest.value
    }

    this.props.mutate({
      variables: {
        id: projectId,
        status: status,
      },
    }).then(({data}) => {

      if (projectStatus === projectStatuses.new.value) {
        firstAssessmentNotification(companyName)
      } else {
        finalAssessmentNotification(companyName)
      }

      message.success('Document assessment submission complete!')
      this.setState({loading: false, visible: false})
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.visible && !nextState.visible) {
      this.setState({visible: true})
    }
    if (!nextState.visible) {
      this.props.hideModal()
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
    this.props.showModal(this.state.visible)
  }

  handleCancel = () => {
    this.setState({visible: false})
  }

  getDisclaimerMessage(projectStatus) {
    if (projectStatus === projectStatuses.new.value) {
      return (
        <div>
          <span>Be aware that if you choose to proceed, all data input functionalities will be locked:</span>
          <ul style={{marginTop: 10}}>
            <li>All scores will be permanently locked</li>
            <li>Uploading and editing documentation will only  be unlocked after the first
                documentation assessment report is received, and permanently locked upon submission thereafter</li>
          </ul>
        </div>
      )
    }

    return (
      <div>
        <span>Be aware that if you choose to proceed, all data input functionalities will be locked</span>
      </div>
    )
  }

  render() {
    const {intl: {formatMessage}, projectStatus} = this.props

    if (projectStatus !== projectStatuses.new.value &&
      projectStatus !== projectStatuses.firstAssessmentCompleted.value) {
      return null
    }

    const disclaimerMessage = this.getDisclaimerMessage(projectStatus)

    return (
      <div style={{marginRight: 30}}>
        <Modals
          visible={this.state.visible}
          size="mini"
          title="Disclaimer"
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>Return</Button>,
            <Button
              key="submit"
              type="primary"
              loading={this.state.loading}
              onClick={this.handleProjectSubmit}
            >
              Submit
            </Button>,
          ]}
        >
          {disclaimerMessage}
        </Modals>
      </div>
    )
  }
}

export default (graphql(changeProjectStatus)(injectIntl(SubmitForAssessment)))



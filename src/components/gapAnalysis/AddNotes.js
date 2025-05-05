import React, {Component} from 'react'
import {values} from 'lodash'
import {connect} from 'react-redux'
import {Form, Modal, message, Button} from 'antd'
import {reduxForm, Field} from 'redux-form'
import {graphql} from 'react-apollo'
import {injectIntl} from 'react-intl'
import {updateGapAnalysisMutation} from '../../graphql/gapAnalysisMutation'
import ModalStyle from '../styles/modal.style'
import WithDirection from '../../common/withDirection'
import {gapFields} from './gapFields'

const isoModal = ModalStyle(Modal)
const Modals = WithDirection(isoModal)

class addNoteGAP extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }
  handleFormSubmit(fields) {
    const {keyConsideration, reset, gapAnalysisId} = this.props
    this.setState({loading: true})
    const record = {
      id: gapAnalysisId,
      keyConsideration: keyConsideration.key,
      coreSubject: keyConsideration.coreSubject,
      issueOfInterest: keyConsideration.isuueOfInterest,
    }
    this.props.mutate({
      variables: {
        ...record,
        ...fields,
      },
      //refetchQueries: [{query: fetchEmployees, variables: {companyId}}],
    }).then(({data}) => {
      // refetch()
      message.success('Processing complete!')
      reset()
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

  renderFields(group) {
    return values(group).map(field => {
      return (
        <Field
          key={field.key}
          {...field}
          name={field.value}
          label={field.label}
          component={field.component}
          placeholder={field.label}
        />

      )
    })
  }

  render() {
    const {handleSubmit, keyConsideration, intl: {formatMessage}} = this.props
    return (
      <div style={{marginRight: 30}}>
        <Form className="login-form">
          <Modals
            visible={this.state.visible}
            title="Add Note"
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>Return</Button>,
              <Button
                key="submit"
                type="primary"
                loading={this.state.loading}
                onClick={handleSubmit(this.handleFormSubmit.bind(this))}
              >
              Submit
              </Button>,
            ]}
          >
            <div>
              {keyConsideration && formatMessage(keyConsideration.localization)}
              {this.renderFields(gapFields)}
            </div>
          </Modals>
        </Form>
      </div>

    )
  }
}

const addNoteGapForm = reduxForm({
  form: 'addNoteGap',
  enableReinitialize: true,
})(addNoteGAP)


export default connect(
  (state, ownProps) => ({
    initialValues: {note: ownProps.keyConsiderationNote},
  })
)(graphql(updateGapAnalysisMutation)(injectIntl(addNoteGapForm)))



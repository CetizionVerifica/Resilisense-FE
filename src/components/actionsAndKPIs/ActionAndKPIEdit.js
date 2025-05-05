import React, {Component} from 'react'
import {values, filter, get, find} from 'lodash'
import {Form, Modal, message, Button, notification} from 'antd'
import {reduxForm, Field} from 'redux-form'
import {connect} from 'react-redux'
import {graphql} from 'react-apollo'
import ModalStyle from '../styles/modal.style'
import {loadActionAndKPI} from '../../actions'
import WithDirection from '../../common/withDirection'
import {updateProjectActionAndKPI} from '../../graphql/actionsAndKPIsMutation'
import {actionAndKPIFields} from './actionAndKPIFields'
const isoModal = ModalStyle(Modal)
const Modals = WithDirection(isoModal)

class ActionsAndKPIsEdit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.actionAndKPI !== this.props.actionAndKPI) {
      nextProps.loadActionAndKPI(nextProps.actionAndKPI)
    }
  }
  handleFormSubmit(fields) {
    const {reset, projectId, projectYear, actionAndKPI} = this.props
    this.setState({loading: true})
    // console.log("Edit feilds:", fields);
    this.props.mutate({
      variables: {
        id: actionAndKPI.id,
        projectId,
        year: projectYear,
        ...fields,
      },
      //refetchQueries: [{query: fetchCompanyQuery, variables: {id: companyId}}],
    }).then(({data}) => {
      message.success('Processing complete!')
      reset()
      this.setState({loading: false, visible: false})
    }).catch(({message, locations, path}) => {
      this.setState({loading: false})
      return notification.warning({
        message: 'Update Project Actions and KPIs',
        description: message,
      })
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
    this.props.loadActionAndKPI({})
    this.setState({visible: false})
  }

  renderFields(group) {
    return values(filter(group, {group: 'project'})).map(field => {
      return (
        <Field
          key={field.key}
          {...field}
          name={field.name}
          label={field.label}
          component={field.component}
          placeholder={field.label}
          options={field.options}
          autosize={field.autosize}
          style={field.style}
          iseditable=""
        />

      )
    })

  }

  render() {
    const {handleSubmit, actionAndKPI} = this.props
    if (!actionAndKPI) {
      return <div />
    }
    return (
      <div style={{marginRight: 30}}>
        <Form className="login-form">
          <Modals
            visible={this.state.visible}
            title="Add New Action and KPI"
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
              {this.renderFields(actionAndKPIFields)}
            </div>
          </Modals>
        </Form>
      </div>
    )
  }
}


const ActionsAndKPIsEditQL = graphql(updateProjectActionAndKPI)(ActionsAndKPIsEdit)

const ActionsAndKPIsEditForm = reduxForm({
  form: 'actionsAndKPIsEdit',
  enableReinitialize: true,
})(ActionsAndKPIsEditQL)

export default connect(
  ({actionsAndKPIs}, {projectId}) => {
    const projectsPerformance = get(actionsAndKPIs.record, 'projectPerformance')
    const project = find(projectsPerformance, {project: projectId}) || {}
    return {
      initialValues: {
        performance: project.performance,
        targetPerformance: project.targetPerformance,
      },
    }
  }, {loadActionAndKPI}
)(ActionsAndKPIsEditForm)

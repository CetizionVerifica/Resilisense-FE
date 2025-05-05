import React, {Component} from 'react'
import {Row, Col, Button, message, Select, Modal, notification} from 'antd'
import {withRouter} from 'react-router-dom'
import {graphql} from 'react-apollo'
import Box from '../utility/box'
import {fetchProjects} from '../../graphql/fetchProjects'
import {removeProject} from '../../graphql/projectMutation'
import basicStyle from '../../common/basicStyle'
const confirm = Modal.confirm
const Option = Select.Option
const users = []
class ProjectSettings extends Component {
  state = {
    loading: false,
    iconLoading: false,
  }
  handleFormSubmit() {
    const {projectId} = this.props
    this.setState({loading: true})
    this.props.mutate({
      variables: {
        id: projectId,
      },
      refetchQueries: [{query: fetchProjects}],
    }).then(({data}) => {
      //console.log(data.addCompany.id)
      message.success('Processing complete!')
      this.setState({loading: false})
      this.props.history.push('/projects')
    }).catch(({message, locations, path}) => {
      this.setState({loading: false})
      return notification.warning({
        message: 'Deleting Project',
        description: message,
      })

    })
    //this.props.signinUser({email, password})
  }

  showDeleteConfirm() {
    const self = this
    return confirm({
      title: 'Are you sure delete this Project?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        self.handleFormSubmit()
      },
      onCancel() {
        // console.log('Cancel')
      },
    })
  }

  render() {
    const {rowStyle, colStyle, gutter} = basicStyle
    return (
      <Row style={rowStyle} justify="space-between" gutter={gutter}>
        <Col md={12} sm={24} xs={24} style={colStyle}>


          <Box title="Add User" bordered>

            <Row style={{marginBottom: 15}} justify="space-between" gutter={gutter}>
              <Col span={24}>

                <Select style={{width: '100%'}} onChange={this.onChange}>
                  {users.map(user => (<Option key={user._id} value={user._id}>{user.name}</Option>))}
                </Select>
              </Col>
            </Row>
            <Row style={{marginBottom: 15}} justify="space-between" gutter={gutter}>
              <Col span={24}>
                <Button type="primary" className="" onClick={() => {}}>
              Add
                </Button>
              </Col>

            </Row>
          </Box>

        </Col>
        <Col md={12} sm={24} xs={24} style={colStyle}>


          <Button
            type="danger"
            loading={this.state.loading}
            onClick={this.showDeleteConfirm.bind(this)}
            className="login-form-button"
          >
                  Delete Project
          </Button>

          <div style={{marginTop: 20, textAlign: 'right'}} />
        </Col>
      </Row>

    )
  }
}


export default graphql(fetchProjects)(graphql(removeProject)(withRouter(ProjectSettings)))

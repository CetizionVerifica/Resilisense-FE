import React, {Component} from 'react'
import {Row, Col, Button, message, Modal, notification} from 'antd'
import {graphql} from 'react-apollo'
import {removeCompany} from '../../graphql/companyMutation'
import basicStyle from '../../common/basicStyle'
const confirm = Modal.confirm

class CompanySettings extends Component {
  state = {
    loading: false,
    iconLoading: false,
  }
  handleFormSubmit() {
    const {companyId} = this.props
    this.setState({loading: true})
    this.props.mutate({
      variables: {
        id: companyId,
      },
      //refetchQueries: [{query: fetchCompaniesQuery}],
    }).then(({data}) => {
      //console.log(data.addCompany.id)
      message.success('Processing complete!')
      this.setState({loading: false})
    }).catch(({message, locations, path}) => {
      this.setState({loading: false})
      return notification.warning({
        message: 'Deleting Company',
        description: message,
      })

    })
    //this.props.signinUser({email, password})
  }

  showDeleteConfirm() {
    const self = this
    return confirm({
      title: 'Are you sure delete this Company?',
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

        <Col md={24} sm={24} xs={24} style={colStyle}>


          <Button
            type="danger"
            loading={this.state.loading}
            onClick={this.showDeleteConfirm.bind(this)}
            className="login-form-button"
          >
                      Delete Company
          </Button>

          <div style={{marginTop: 20, textAlign: 'right'}} />

        </Col>
      </Row>

    )
  }
}


export default graphql(removeCompany)(CompanySettings)

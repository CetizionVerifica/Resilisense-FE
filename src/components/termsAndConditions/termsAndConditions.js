import React, {Component} from 'react'
import {Button, Checkbox, message, notification, Divider} from 'antd'
import {graphql} from 'react-apollo'
import {acceptTermsAndConditionsUser} from '../../graphql/userMutation'

class TermsAndConditions extends Component {
    state={
      accept: false,
    }
    handelClose = () => {
      this.props.mutate({
        variables: {},
      }).then(({data}) => {
        message.success('Processing complete!')
        this.props.onCancel()
      }).catch(({message, locations, path}) => {
        return notification.warning({
          message: 'Terms and Conditions',
          description: message,
        })
      })
    }
    handelAccept = () => {
      this.setState({accept: !this.state.accept})
    }
    render() {
      return (
        <div>
          <Checkbox onChange={this.handelAccept} checked={this.state.accept}>
          By proceeding to use our software,  you are agreeing to our <br />
            <a href="/assets/user-license-agreeementV2.pdf" target="_blank">Terms and Conditions</a>.
          </Checkbox>
          <Divider />
          <div style={{textAlign: 'center'}}>
            <Button
              type="primary"
              onClick={this.handelClose}
              disabled={!this.state.accept}
            >
            Accept
            </Button>
          </div>

        </div>
      )
    }
}


const TermsAndConditionsQL = graphql(acceptTermsAndConditionsUser)(TermsAndConditions)
export default TermsAndConditionsQL


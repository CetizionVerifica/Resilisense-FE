import React, {Component} from 'react'
import {reduxForm, Field} from 'redux-form'
import {Row, Col, Form, Button, Card} from 'antd'
import {Redirect} from 'react-router-dom'
import {signupUser} from '../../actions'
import {userFields} from '../user/userFields'
import {connect} from 'react-redux'
import logo from '../../images/logo-seventoolkit.png'
import asponLogo from '../../images/aspon_logo_w.png'
import Fundinglogo from '../../images/img3.jpg'
import EuLogo from '../../images/img2.jpg'
import cyprusLogo from '../../images/img1.jpg'

class Signin extends Component {
  handleFormSubmit(fields) {
    // console.log(fields)
    this.props.signupUser(fields)
  }
  renderAlert() {
    if (this.props.auth.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops! </strong> {this.props.auth.errorMessage}
        </div>
      )
    }
  }


  render() {
    const {handleSubmit, auth} = this.props
    if (auth.authenticated) {
      return <Redirect push to="/" />
    }
    return (

      <div className="row" style={{display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 'calc(100vh)'}}
      >
        <div style={{display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh)'}}
        >
          <img alt="user" src={logo} />
          <img alt="user" src={asponLogo} />
          {auth.msg && <div style={{textAlign: 'center', margin: 10, backgroundColor: '#FFF', padding: 20}}>
            <p>Thank you for registering on the 7 Toolkit.</p>
            <p>A confirmation email will be sent to you shortly with details for proceeding to payment.</p>
            <p>Access to the toolkit will be granted once the payment has been received
              (please note this can take 3 to 5 working days).</p>
            <p> For more information please contact
              <a href="mailto:info@seven-toolkit.com"> info@seven-toolkit.com</a></p></div>}
          {!auth.msg && <Card style={{width: 368, margin: '10px auto'}}>
            <Form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>

              <Field
                {...userFields.name}
                name="name"
                label=""
                placeholder="Full name"
              />
              <Field
                {...userFields.organisation}
                name="organisation"
                label=""
                placeholder="Organisation"
              />
              <Field
                {...userFields.jobPosition}
                name="jobPosition"
                label=""
                placeholder="Job title"
              />
              <Field
                {...userFields.email}
                name="email"
                label=""
                placeholder="Work email"
              />
              <Field
                {...userFields.password}
                name="password"
                label=""
                placeholder="Password"
              />
              <Field
                {...userFields.name}
                name="phone"
                label=""
                placeholder="Work telephone number"
              />
              <Field
                {...userFields.comments}
                name="comments"
                label=""
                required={false}
                placeholder="Comments"
              />
              <div style={{marginTop: 20, textAlign: 'right'}}>
                <Button htmlType="submit" className="login-form-button"
                  type="primary"
                  style={{width: '100%'}}
                > Sign up</Button>
              </div>
            </Form>
          </Card>}
        </div>
        <div style={{width: '100%', backgroundColor: '#fff'}}>
          <Row style={{margin: 15}} justify="space-between" >
            <Col md={8} sm={12} xs={24} style={{textAlign: 'center'}}>
              <img alt="logo" src={cyprusLogo} style={{width: 100}} />
            </Col>
            <Col md={8} sm={12} xs={24} style={{textAlign: 'center'}}>
              <img alt="logo" src={EuLogo} style={{width: 100}} />
            </Col>
            <Col md={8} sm={12} xs={24} style={{textAlign: 'center'}}>
              <img alt="logo" src={Fundinglogo} style={{width: 100}} />
            </Col>

          </Row>
        </div>
      </div>


    )
  }
}

function mapStateToProps({auth}) {
  return {auth}
}

const signupFrom = reduxForm({
  form: 'signup',
})(Signin)


export default connect(mapStateToProps, {signupUser})(signupFrom)


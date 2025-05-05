import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { values } from "lodash";
import { withRouter, Redirect } from "react-router-dom";
import { Row, Col, Form, Button, Card, Spin } from "antd";
import { signinUser } from "../../actions";
import { signinFields } from "./authFields";
import { connect } from "react-redux";
import logo from "../../images/logo-seventoolkit.png";
import asponLogo from "../../images/aspon_logo_w.png";
import Fundinglogo from "../../images/img3.jpg";
import EuLogo from "../../images/img2.jpg";
import cyprusLogo from "../../images/img1.jpg";

class Signin extends Component {
  state = {
    loading: false, // Local loading state
  };

  handleFormSubmit = ({ email, password }) => {
    this.setState({ loading: true }); // Show spinner while submitting
    this.props.signinUser({ email, password });
  };

  renderAlert() {
    if (this.props.auth.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops! </strong> {this.props.auth.errorMessage}
        </div>
      );
    }
  }

  renderFields() {
    return values(signinFields).map((field) => {
      return (
        <Field
          key={field.key}
          {...field}
          addonBefore={field.addonBefore}
          name={field.value}
          component={field.component}
        />
      );
    });
  }

  render() {
    const { handleSubmit, auth } = this.props;
    const { loading } = this.state;

    // Show spinner if loading and no user data yet
    if (auth.authenticated && !auth.currentUser) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
        </div>
      );
    }

    // Handle redirection based on user role
    if (auth.authenticated && auth.currentUser) {
      console.log("User authenticated:", auth.currentUser);
      const redirectPath =
        auth.currentUser.role === "superadmin"
          ? "/super-admin"
          : auth.currentUser.role === "Admin"
          ? "/companies"
          : "/";
      return <Redirect push to={redirectPath} />;
    }

    return (
      <div
        className="row"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <img alt="logo" src={logo} style={{ width: 130 }} />
          <Card style={{ width: 368, margin: "10px auto" }}>
            {/* {this.renderAlert()} */}
            <Form onSubmit={handleSubmit(this.handleFormSubmit)}>
              {this.renderFields()}
              <a
                onClick={() => this.props.history.push("/forgot-password")}
                style={{ margin: "5px 0" }}
              >
                Forgot password
              </a>
              <div style={{ marginTop: 20, textAlign: "right" }}>
                <Button
                  htmlType="submit"
                  className="login-form-button"
                  type="primary"
                  style={{ width: "100%" }}
                  // loading={loading} // Button spinner
                >
                  Sign in
                </Button>
              </div>
            </Form>
          </Card>
        </div>
        <div style={{ width: "100%", backgroundColor: "#fff" }}>
          <Row style={{ margin: 15 }} justify="space-between">
            <Col md={8} sm={12} xs={24} style={{ textAlign: "center" }}>
              <img alt="cyprusLogo" src={cyprusLogo} style={{ width: 100 }} />
            </Col>
            <Col md={8} sm={12} xs={24} style={{ textAlign: "center" }}>
              <img alt="EuLogo" src={EuLogo} style={{ width: 100 }} />
            </Col>
            <Col md={8} sm={12} xs={24} style={{ textAlign: "center" }}>
              <img alt="Fundinglogo" src={Fundinglogo} style={{ width: 100 }} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
function mapStateToProps({ auth }) {
  return { auth };
}

const signinForm = reduxForm({
  form: "signin",
})(Signin);

export default connect(mapStateToProps, { signinUser })(withRouter(signinForm));

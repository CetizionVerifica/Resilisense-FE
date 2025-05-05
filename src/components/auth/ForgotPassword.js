import React from "react";
import { Row, Col, Form, Button, Card } from "antd";
import logo from "../../images/logo-seventoolkit.png";
import { forgotFields } from "./authFields";
import { values } from "lodash";
import { withApollo } from "react-apollo";
import Swal from "sweetalert2";
import forgotPasswordMutation from "../../graphql/forgotPasswordMutation";
import { reduxForm, Field } from "redux-form";
import Fundinglogo from "../../images/img3.jpg";
import EuLogo from "../../images/img2.jpg";
import cyprusLogo from "../../images/img1.jpg";
function ForgotPassword(props) {
  async function handleFormSubmit({ email }) {
    try {
      await props.client.mutate({
        mutation: forgotPasswordMutation,
        variables: { email },
      });
      Swal.fire(
        "Success!",
        "You will receive a request password email. Please check your mailbox. Thank you",
        "success"
      ).then(() => {
        window.location.href = `/reset-password?email=${encodeURIComponent(
          email
        )}`;
      });
    } catch (error) {
      Swal.fire("Oops!", error.message.split(":")[1], "error");
    }
  }
  function renderFields() {
    return values(forgotFields).map((field) => {
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

  return (
    <div
      className="row"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "calc(100vh)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh)",
        }}
      >
        <img alt="logo" src={logo} style={{ width: 130 }} />

        <Card style={{ width: 368, margin: "10px auto" }}>
          <Form onSubmit={props.handleSubmit(handleFormSubmit)}>
            {renderFields()}

            <div style={{ marginTop: 20, textAlign: "right" }}>
              <Button
                htmlType="submit"
                className="login-form-button"
                type="primary"
                style={{ width: "100%" }}
              >
                Submit
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

const ForgotPasswordForm = reduxForm({
  form: "forgot",
})(ForgotPassword);

export default withApollo(ForgotPasswordForm);

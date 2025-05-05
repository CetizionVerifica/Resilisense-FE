import React, { Component } from "react";
import axios from "axios";
import { get, values, filter } from "lodash";
import {
  Tabs,
  Row,
  Col,
  Checkbox,
  message,
  Form,
  Button,
  Input,
  Card,
} from "antd";
import { graphql, compose, withApollo } from "react-apollo";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import Swal from "sweetalert2";

import fetchUserQuery from "../../graphql/fetchUser";
import { updateUser, updateNewUserPassword } from "../../graphql/userMutation";
import basicStyle from "../../common/basicStyle";
import PageHeader from "../utility/pageHeader";
import Box from "../utility/box";
import { breadcrumbUpdate } from "../../actions";
import LayoutWrapper from "../utility/layoutWrapper";
import { userFields, newPasswordFields } from "./userFields";
import logo from "../../images/logo-seventoolkit.png";
import asponLogo from "../../images/aspon_logo_w.png";
import Fundinglogo from "../../images/img3.jpg";
import EuLogo from "../../images/img2.jpg";
import cyprusLogo from "../../images/img1.jpg";

const TabPane = Tabs.TabPane;
const { TextArea } = Input;

function getBase64(img, callback) {
  const reader = new FileReader(); // eslint-disable-line
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
class UserDashBoard extends Component {
  state = {
    loading: false,
    userId: null,
    user: null,
  };
  componentDidMount() {
    const query = window.location.search.split("?")[1];
    const token = query.split("=")[1];
    axios
      .get("/api/current_user", {
        headers: { authorization: token }, // eslint-disable-line
      })
      .then(({ data }) => {
        if (data) {
          this.setState({ userId: data._id, user: data });
          // console.log("token", data);
          // console.log( data._id)

          // this.props.client.query({query: fetchUserQuery, variables: {userId: data._id}})
          //   .then(user => {
          //     console.log('usr', user)
          //   })
        }
      });
  }

  handleFormSubmit(fields) {
      this.setState({ loading: true });
      // console.log(this.state.userId)
      this.props.client
        .mutate({
          mutation: updateNewUserPassword,
          variables: {
            ...fields,
            userId: this.state.userId,
          },
          //refetchQueries: [{query: fetchCompaniesQuery}],
        })
        .then(({ data }) => {
          //console.log(data.addCompany.id)
          message.success("Processing complete!");
          this.setState({ loading: false, visible: false });
          Swal.fire(
            "Success!",
            "You changed password successfully",
            "success"
          ).then(() => {
            window.location.href = "/signin";
          });
        });
    //this.props.signinUser({email, password})
  }
  handleChange = (info) => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl,
          loading: false,
        })
      );
    }
  };

  renderFields(group) {
    const { user } = this.state;
    return values(filter(group, { iseditable: true })).map((field) => {
      return (
        <Field
          key={field.key}
          {...field}
          addonBefore={field.addonBefore}
          name={field.value}
          // value={user[field.key]}
          label={field.label}
          component={field.component}
          placeholder={field.label}
        />
      );
    });
  }

  render() {
    // const {rowStyle, colStyle, gutter, greyColor} = basicStyle
    const { handleSubmit } = this.props;
    const { user } = this.state;
    const breadcrumb = [{ name: "Home", link: "/" }, { name: "My Profile" }];
    // breadcrumbUpdate(breadcrumb)
    // if (!user) {
    //   return <div />
    // }
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
          }}
        >
        <img alt="logo" src={logo} style={{ width: "10%" }} />
          <Card style={{ width: 368, margin: "10px auto" }}>
            <Form
              onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
              className="login-form"
            >
              <Box bordered>
                {this.renderFields(newPasswordFields)}
              </Box>

              <div style={{ marginTop: 20, textAlign: "center" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  loading={this.state.loading}
                >
                  Change Password
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

const UserForm = reduxForm({
  form: "updateUser",
  enableReinitialize: true,
})(UserDashBoard);

const InitializeUserForm = connect(null, { breadcrumbUpdate })(UserForm);

export default withApollo(InitializeUserForm);

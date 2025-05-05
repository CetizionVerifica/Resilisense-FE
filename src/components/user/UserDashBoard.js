import React, { Component } from "react";
import { get, values, filter } from "lodash";
import moment from "moment";
import { Tabs, Row, Col, Card, message, Form, Button } from "antd";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import fetchUserQuery from "../../graphql/fetchUser";
import { updateUser, updateUserPassword } from "../../graphql/userMutation";
import basicStyle from "../../common/basicStyle";
import PageHeader from "../utility/pageHeader";
import Box from "../utility/box";
import { breadcrumbUpdate } from "../../actions";
import LayoutWrapper from "../utility/layoutWrapper";
import { userFields, changePasswordFields } from "./userFields";

const TabPane = Tabs.TabPane;
function getBase64(img, callback) {
  const reader = new FileReader(); // eslint-disable-line
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
class UserDashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFormSubmitPassword = this.handleFormSubmitPassword.bind(this)
  }

  async handleFormSubmit(fields) {
    try {
      this.setState({ loading: true });
      await this.props
        .updateUser({
          variables: {
            ...fields,
          },
          //refetchQueries: [{query: fetchCompaniesQuery}],
        })
        .then(({ data }) => {
          //console.log(data.addCompany.id)
          message.success("Processing complete!");
          this.setState({ loading: false, visible: false });
        });
    } catch (error) {
      this.setState({ loading: false, visible: false });

      message.error(error.message)
    }

    //this.props.signinUser({email, password})
  }
  async handleFormSubmitPassword(fields) {
    try {
      this.setState({ loading: true });
      
      await this.props.updateUserPassword({
        variables: {
          oldPassword: fields.oldpassword,
          newPassword: fields.newPassword
        },
      }).then(({ data }) => {
        //console.log(data.addCompany.id)
        message.success("Changing password complete!");
        this.setState({ loading: false, visible: false });
      });
    } catch (error) {
      this.setState({ loading: false, visible: false });

      message.error(error.message)
    }

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
    const {
      fetchUserQuery: { user },
    } = this.props;
    return values(filter(group, { iseditable: true })).map((field) => {
      return (
        <Field
          key={field.key}
          {...field}
          addonBefore={field.addonBefore}
          name={field.value}
          value={user[field.key]}
          label={field.label}
          component={field.component}
          placeholder={field.label}
        />
      );
    });
  }

  render() {
    const { rowStyle, colStyle, gutter, greyColor } = basicStyle;
    const {
      fetchUserQuery: { user },
      handleSubmit,
    } = this.props;
    const breadcrumb = [{ name: "Home", link: "/" }, { name: "My Profile" }];
    breadcrumbUpdate(breadcrumb);
    if (!user) {
      return <div />;
    }
    return (
      <LayoutWrapper>
        <PageHeader>{get(user, "name")}</PageHeader>
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box>
              <Col md={18} sm={18} xs={24} style={colStyle}>
                <Card bordered={false}>
                  <h4>
                    {" "}
                    Full Name:{" "}
                    <span style={greyColor}>{get(user, "name")} </span>
                  </h4>
                  <h4>
                    {" "}
                    Email: <span style={greyColor}>{get(user, "email")} </span>
                  </h4>
                  <h4>
                    {" "}
                    Job Postion:{" "}
                    <span style={greyColor}>{get(user, "jobPosition")} </span>
                  </h4>
                  <h4>
                    {" "}
                    Phone: <span style={greyColor}>{get(user, "phone")} </span>
                  </h4>
                  <h4>
                    {" "}
                    Active:{" "}
                    <span style={greyColor}>{get(user, "active")} </span>
                  </h4>
                  <h4>
                    {" "}
                    Created Date:{" "}
                    <span style={greyColor}>
                      {moment(get(user, "date")).format("DD/MM/YYYY")}
                    </span>
                  </h4>
                </Card>
              </Col>
            </Box>
          </Col>
        </Row>
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box>
              <Tabs animated={false} >
                <TabPane tab="Details" key="1">
                  <Form
                    onSubmit={handleSubmit(this.handleFormSubmit)}
                    className="login-form"
                  >
                    <Box bordered>{this.renderFields(userFields)}</Box>
                    <div style={{ marginTop: 20, textAlign: "right" }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        loading={this.state.loading}
                      >
                        Save
                      </Button>
                    </div>
                  </Form>
                </TabPane>
                <TabPane tab="Change Password" key="2">
                  <Form
                    onSubmit={handleSubmit(this.handleFormSubmitPassword)}
                    className="login-form"
                  >
                    <Box bordered>
                      {this.renderFields(changePasswordFields)}
                    </Box>
                    <div style={{ marginTop: 20, textAlign: "right" }}>
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
                </TabPane>
              </Tabs>
            </Box>
          </Col>
        </Row>
      </LayoutWrapper>
    );
  }
}

const UserForm = reduxForm({
  form: "updateUser",
  enableReinitialize: true,
})(UserDashBoard);

const InitializeUserForm = connect(
  (state, ownProps) => ({
    initialValues: get(ownProps, "fetchUserQuery.user"),
  }),
  { breadcrumbUpdate }
)(UserForm);

export default compose(
  graphql(updateUser, {
    name: "updateUser",
  }),
  graphql(updateUserPassword, {
    name: "updateUserPassword",
  }),
  graphql(fetchUserQuery, {
    name: "fetchUserQuery",
  })
)(InitializeUserForm);

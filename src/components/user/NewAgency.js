import React, { Component } from "react";
import { values, find } from "lodash";
import { Row, Col, message, Form, Button, notification, Cascader } from "antd";
import { graphql } from "react-apollo";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { addAgency } from "../../graphql/agencyMutation";
import basicStyle from "../../common/basicStyle";
import PageHeader from "../utility/pageHeader";
import Box from "../utility/box";
import { breadcrumbUpdate } from "../../actions";
import LayoutWrapper from "../utility/layoutWrapper";
import { agencyFields } from "./userFields";
import { companySectorTypes } from "../../common/enum/companySectors";

class AddNewAgency extends Component {
  state = {
    loading: false,
    selectedIndustry: null,
  };

  handleFormSubmit(fields) {
    if (!this.state.selectedIndustry) {
      return;
    }

    this.setState({ loading: true });
    console.log("Current User:", this.props.currentUser); // Add console log to check current user
    this.props
      .mutate({
        variables: {
          industry: this.state.selectedIndustry,
          // Add current user ID with optional chaining
          ...fields,
        },
        //refetchQueries: [{query: fetchCompaniesQuery}],
      })
      .then(({ data }) => {
        //console.log(data.addCompany.id)
        message.success("Processing complete!");
        this.setState({ loading: false, visible: false });
      })
      .catch(({ message, locations, path }) => {
        // console.log(message, locations, path)
        this.setState({ loading: false });
        return notification.warning({
          message: "Create Organization",
          description: message,
        });
      });

    //this.props.signinUser({email, password})
  }

  handleIndustryChange = (value) => {
    const sector = find(companySectorTypes, { value: value[0] });
    const industry = find(sector.children, { value: value[1] });
    this.setState({ selectedIndustry: `${sector.label} / ${industry.label}` });
  };

  renderFields(group) {
    return values(group).map((field) => {
      return (
        <Field
          key={field.key}
          {...field}
          addonBefore={field.addonBefore}
          name={field.value}
          label={field.label}
          component={field.component}
          placeholder={field.label}
        />
      );
    });
  }

  render() {
    const { rowStyle, colStyle, gutter } = basicStyle;
    const { handleSubmit, breadcrumbUpdate } = this.props;
    const breadcrumb = [
      { name: "Home", link: "/" },
      { name: "New Organization" },
    ];
    breadcrumbUpdate(breadcrumb);
    return (
      <LayoutWrapper>
        <PageHeader>Create New Organization</PageHeader>
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box>
              <Form
                onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
                className="login-form"
              >
                {this.renderFields(agencyFields)}
                <div className="ant-form-item-label">
                  <label className="ant-form-item-required">Industry</label>
                </div>
                <Cascader
                  options={companySectorTypes}
                  style={{ width: "100%" }}
                  onChange={this.handleIndustryChange}
                  placeholder="Please select"
                />
                <div style={{ marginTop: 20, textAlign: "right" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    loading={this.state.loading}
                  >
                    Create New Organization
                  </Button>
                </div>
              </Form>
            </Box>
          </Col>
        </Row>
      </LayoutWrapper>
    );
  }
}

const AgencyForm = reduxForm({
  form: "addAgency",
})(AddNewAgency);

// Map state to props to get the current user
const mapStateToProps = (state) => ({
  currentUser: state.Auth.currentUser,
});

export default connect(mapStateToProps, { breadcrumbUpdate })(
  graphql(addAgency)(AgencyForm)
);

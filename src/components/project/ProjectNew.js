import React, { Component } from "react";
import { values, get } from "lodash";
import { Form, Button, message, notification } from "antd";
import { reduxForm, Field } from "redux-form";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import { breadcrumbUpdate } from "../../actions";
import PageHeader from "../utility/pageHeader";
import { graphql, compose, withApollo } from "react-apollo";
import { injectIntl } from "react-intl";
import { newPorjectMessages } from "../../messages";
import fetchCompaniesQuery from "../../graphql/fetchCompaniesQuery";
import { addProjectToCompany } from "../../graphql/projectMutation";
import Box from "../utility/box";
import { newProject } from "./projectFields";
import LayoutWrapper from "../utility/layoutWrapper";
import CompanyFormModal from "../company/companyFormModal";

class ProjectNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  handleOk = () => {
    setTimeout(() => {
      message.success("Processing complete!");
    }, 1000);
  };
  handleFormSubmit(fields) {
    const { currentUser } = this.props;
    console.log("fields", currentUser._id);
    this.setState({ loading: true });
    this.props
      .mutate({
        variables: {
          date: moment(new Date()).unix(),
          reseller: currentUser._id,
          ...fields,
        },
      })
      .then(({ data }) => {
        const id = get(data, "addProject.id");
        message.success("Processing complete!");
        this.setState({ loading: false, visible: false });
        this.props.history.push(`/project/${id}`);
      })
      .catch(({ message, locations, path }) => {
        this.setState({ loading: false, visible: false });
        return notification.warning({
          message: "Create New Project",
          description: message,
        });
      });
  }

  renderFields(group, companies) {
    const {
      intl: { formatMessage },
    } = this.props;
    return values(group).map((field) => {
      return (
        <div key={field.key}>
          <Field
            {...field}
            key={field.key}
            addonBefore={field.addonBefore}
            name={field.value}
            options={field.key === "companyName" ? companies : field.options}
            component={field.component}
            label={formatMessage(field.localization)}
            placeholder={formatMessage(field.localization)}
            style={{ marginBottom: 5 }}
          />
          {field.key === "companyName" && (
            <div style={{ textAlign: "right" }}>
              <Button
                type="dashed"
                onClick={this.showModal}
                icon="plus"
                className="login-form-button"
              >
                {formatMessage(newPorjectMessages.btnAddNewCompany)}
              </Button>
            </div>
          )}
        </div>
      );
    });
  }
  componentDidMount() {
    const {
      intl: { formatMessage },
      breadcrumbUpdate,
    } = this.props;
    const breadcrumb = [
      { name: "Home", link: "/" },
      { name: formatMessage(newPorjectMessages.titleCreateNewPorject) },
    ];
    breadcrumbUpdate(breadcrumb);
    this.props.change("companyId", this.props.match.params.companyId);
  }

  render() {
    const {
      handleSubmit,
      data: { loading, companies },
      intl: { formatMessage },
    } = this.props;
    if (loading) {
      return <div />;
    }
    const companiesOptions = companies.map((company) => {
      const newCompany = {};
      newCompany.label = company.name;
      newCompany.value = company.id;
      return { label: company.name, value: company.id };
    });
    return (
      <LayoutWrapper>
        <PageHeader>
          {" "}
          {formatMessage(newPorjectMessages.titleCreateNewPorject)}
        </PageHeader>
        <Box>
          <div style={{ marginRight: 30 }}>
            <Form
              initialize={{ companyId: "5ca4922f0e6cae0014b17e9a" }}
              onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
              className="login-form"
            >
              {this.renderFields(newProject, companiesOptions)}

              <div style={{ marginTop: 20, textAlign: "right" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  loading={this.state.loading}
                >
                  {formatMessage(newPorjectMessages.btnCreateProject)}
                </Button>
              </div>
            </Form>
          </div>
          <CompanyFormModal
            visible={this.state.visible}
            handleOk={this.handleOk}
            hideModal={this.hideModal}
            refetch={this.props.data.refetch}
          />
        </Box>
      </LayoutWrapper>
    );
  }
}

const ProjectNewForm = reduxForm({
  form: "project",
})(ProjectNew);
// const ProjectNewFormQl = graphql(addProjectToCompany)(
//   graphql(fetchCompaniesQuery, {
//     options: (props) => {
//       return {
//         variables: {
//           sort: 'date',
//         },
//         fetchPolicy: 'network-only',
//       }
//     },
//   })(withRouter(ProjectNewForm))
// )
const ProjectNewFormQl = compose(
  graphql(addProjectToCompany),
  graphql(fetchCompaniesQuery, {
    options: (props) => {
      return {
        variables: {
          sort: "date",
        },
        fetchPolicy: "network-only",
      };
    },
  })
)(withRouter(ProjectNewForm));
function mapStateToProps({ auth }) {
  return {
    currentUser: auth.currentUser ? auth.currentUser : null,
    userRole: auth.currentUser ? auth.currentUser.role.split("|") : [],
  };
}

export default connect(mapStateToProps, { breadcrumbUpdate })(
  injectIntl(withApollo(ProjectNewFormQl))
);

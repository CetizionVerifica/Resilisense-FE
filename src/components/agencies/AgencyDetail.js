import React, { useEffect, useState } from "react";
import { values, get } from "lodash";
import { Form, Button, message, notification } from "antd";
import { reduxForm, Field } from "redux-form";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import fetchAgencyById from "../../graphql/fetchAgencyById";
import fetchUsers from "../../graphql/fetchUsers";
import fetchCompany from "../../graphql/fetchCompany";
import fetchAllProjects from "../../graphql/fetchAllProjects";
import { updateAgencyById } from '../../graphql/agencyMutation'
import moment from "moment";
import { breadcrumbUpdate } from "../../actions";
import PageHeader from "../utility/pageHeader";
import { withApollo } from "react-apollo";
import { updateAgencyFields } from "./agenciesField";
import { injectIntl } from "react-intl";
import Box from "../utility/box";
import { agencyMessages } from "../../messages";

import LayoutWrapper from "../utility/layoutWrapper";

function AgencyDetail(props) {
  const [usersOption, setUsersOption] = useState([]);
  const [companiesOption, setCompaniesOption] = useState([])
  const [projectsOption, setProjectsOption] = useState([])

  useEffect(() => {
    props.client
      .query({ query: fetchUsers })
      .then((result) => {
        const users = result.data.users.map((user) => {
          return {
            label: user.name,
            value: user._id,
          };
        });
        setUsersOption(users);
      })
      .catch(console.log);
  }, []);
  useEffect(() => {
    props.client
      .query({ query: fetchCompany })
      .then((result) => {
        const companies = result.data.companies.map(company => {
          return {
            label: company.name,
            value: company.id
          }
        })
        setCompaniesOption(companies)
        
      })
      .catch(console.log);
  }, [])
  useEffect(() => {
    props.client
      .query({ query: fetchAllProjects })
      .then((result) => {
        const projects = result.data.allProjects.map((project) => {
          return {
            label: project.title,
            value: project.id,
          };
        });
        setProjectsOption(projects);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    props.client
      .query({
        query: fetchAgencyById,
        variables: { id: props.match.params.id },
      })
      .then((result) => {
        const { name, email, date, updatedBy, users, companies, projects } = result.data.agencyById;
        props.change("name", name);
        props.change("email", email);
        props.change("date", moment(date).format("MM-DD-YYYY"));
        props.change("updatedBy", updatedBy.name);
        props.change(
          "users",
          users.map((user) => user._id)
        );
        props.change(
          "companies",
          companies.map((company) => company.id)
        );
        props.change(
          "projects",
          projects.map((project) => project.id)
        );
      })
      .catch(console.log);
  }, [props.match.params.id]);

  const {
    handleSubmit,
    intl: { formatMessage },
  } = props;

  function handleFormSubmit(fields) {
    const params = {
      users: fields.users,
      companies: fields.companies,
      projects: fields.projects,
    };
    props.client
      .mutate({
        mutation: updateAgencyById,
        variables: { id: props.match.params.id, ...params },
      })
      .then((result) => {
        message.success("Processing complete!");
      })
      .catch((error) => {
        message.error(error.message);
      });
  }

  function renderFields(group, companies) {
    const {
      intl: { formatMessage },
    } = props;

    return values(group).map((field) => {
      let options;
      switch (field.key) {
        case "users":
          options = usersOption;
          break;
        case "companies":
          options = companiesOption
          break;
        case "projects": 
          options = projectsOption
          break;
        default:
          options = field.options;
          break;
      }
      return (
        <div key={field.key}>
          <Field
            {...field}
            key={field.key}
            addonBefore={field.addonBefore}
            name={field.value}
            options={options}
            component={field.component}
            label={formatMessage(field.localization)}
            placeholder={formatMessage(field.localization)}
            style={{ marginBottom: 5 }}
          />
        </div>
      );
    });
  }
  return (
    <LayoutWrapper>
      <PageHeader>Agency detail</PageHeader>
      <Box>
        <div style={{ marginRight: 30 }}>
          <Form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="login-form"
          >
            {renderFields(updateAgencyFields)}
            <div style={{ marginTop: 20, textAlign: "right" }}>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={false}
              >
                {formatMessage(agencyMessages.btnUpdateAgency)}
              </Button>
            </div>
          </Form>
        </div>
      </Box>
    </LayoutWrapper>
  );
}

const AgencyDetailForm = reduxForm({
  form: "agencyDetail",
})(AgencyDetail);

export default connect(null, { breadcrumbUpdate })(
  injectIntl(withRouter(withApollo(AgencyDetailForm)))
);

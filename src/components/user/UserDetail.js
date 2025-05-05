import React, { useEffect, useState } from "react";
import { values, get } from "lodash";
import { Form, Button, message, notification } from "antd";
import { reduxForm, Field } from "redux-form";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import fetchUserById from "../../graphql/fetchUserById";
import fetchAgencies from "../../graphql/fetchAgencies";
import fetchCompanies from "../../graphql/fetchCompanies";

import { breadcrumbUpdate } from "../../actions";
import PageHeader from "../utility/pageHeader";
import { withApollo } from "react-apollo";
import { updateUserFields } from "./userFields";
import { injectIntl } from "react-intl";
import Box from "../utility/box";
import { updateUserById } from "../../graphql/userMutation";
import { userMessages } from "../../messages";

import LayoutWrapper from "../utility/layoutWrapper";

function UserDetail(props) {
  const [agenciesOption, setAgenciesOption] = useState([]);
  const [companiesOption, setCompaniesOption] = useState([]);
  const { currentUser } = props; //

  console.log("currentUser", currentUser);
  useEffect(() => {
    // Fetch list of agencies for the dropdown
    props.client
      .query({ query: fetchAgencies })
      .then((result) => {
        console.log("result", result);
        const agencies = result.data.agencies.map((agency) => ({
          label: agency.name,
          value: agency.id,
          reseller: agency.reseller, // Make sure this property is carried over
        }));

        // Fix the filter logic
        setAgenciesOption(
          agencies.filter((agency) => {
            // Check if currentUser exists and has an _id
            if (currentUser && currentUser._id) {
              // Compare agency's reseller with currentUser's _id
              return agency.reseller === currentUser._id;
            }
            return false; // If no current user, don't show agencies
          })
        );
      })
      .catch(console.error);
  }, [currentUser]); // Also add currentUser as dependency
  useEffect(() => {
    // Fetch list of companies for the dropdown
    props.client
      .query({ query: fetchCompanies })
      .then((result) => {
        console.log("companies", result);
        const companies = result.data.companies.map((company) => ({
          label: company.name,
          value: company.id,
          reseller: company.reseller, // Ensure reseller property is included
        }));

        // Filter companies by the current user's ID
        setCompaniesOption(
          companies.filter((company) => {
            // Check if currentUser exists and has an _id
            if (currentUser && currentUser._id) {
              // Compare company's reseller with currentUser's _id
              return company.reseller === currentUser._id;
            }
            return false; // If no current user, don't show companies
          })
        );
      })
      .catch(console.error);
  }, [currentUser]);
  useEffect(() => {
    props.client
      .query({ query: fetchUserById, variables: { id: props.match.params.id } })
      .then((result) => {
        const {
          name,
          jobPosition,
          agencies,
          email,
          phone,
          companies,
          website,
          serviceProductInfo,
          lisence,
          percentageServiceProduct,
          country,
          sector,
          type,
          active,
        } = result.data.userById;
        props.change("name", name);
        props.change("jobPosition", jobPosition);
        props.change("phone", phone);
        props.change("email", email);
        props.change("website", website);
        props.change("serviceProductInfo", serviceProductInfo);
        props.change("lisence", lisence);
        props.change("percentageServiceProduct", percentageServiceProduct);
        props.change("country", country);
        props.change("sector", sector);
        props.change("type", type);
        props.change("active", active ? "true" : "false");
        props.change("sectorType", [sector, type]);
        props.change(
          "agencies",
          agencies.map((agency) => agency.id)
        );
        props.change(
          "companies",
          companies.map((company) => company.id)
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
      ...fields,
      active: fields.active === "true" ? true : false,
      sector: get(fields, "sectorType[0]", ""),
      type: get(fields, "sectorType[1]", ""),
    };
    props.client
      .mutate({
        mutation: updateUserById,
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
      return (
        <div key={field.key}>
          <Field
            {...field}
            key={field.key}
            addonBefore={field.addonBefore}
            name={field.value}
            options={
              field.key === "agencies"
                ? agenciesOption
                : field.key === "companies"
                ? companiesOption
                : field.options
            }
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
      <PageHeader> User detail</PageHeader>
      <Box>
        <div style={{ marginRight: 30 }}>
          <Form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="login-form"
          >
            {renderFields(updateUserFields)}
            <div style={{ marginTop: 20, textAlign: "right" }}>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={false}
              >
                {formatMessage(userMessages.btnUpdateUser)}
              </Button>
            </div>
          </Form>
        </div>
      </Box>
    </LayoutWrapper>
  );
}

const UserDetailForm = reduxForm({
  form: "userDetail",
})(UserDetail);

function mapStateToProps({ auth }) {
  return {
    currentUser: auth.currentUser || null,
  };
}

export default connect(mapStateToProps, { breadcrumbUpdate })(
  injectIntl(withRouter(withApollo(UserDetailForm)))
);

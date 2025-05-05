import React, { useEffect, useState } from "react";
import { values, get } from "lodash";
import { Form, Modal, Button, notification, message } from "antd";
import { reduxForm, Field } from "redux-form";
import fetchAgencies from "../../graphql/fetchAgencies";
import fetchCompanies from "../../graphql/fetchCompanies";
import { addUserFields } from "./userFields"; // Adjusted fields for "Add User"
import { injectIntl } from "react-intl";
import { addUser } from "../../graphql/userMutation"; // Use a `createUser` mutation
import { userMessages } from "../../messages";
import ModalStyle from "../styles/modal.style";
import WithDirection from "../../common/withDirection";
import { addCompanyMutation } from "../../graphql/companyMutation";
import { graphql } from "react-apollo";

const isoModal = ModalStyle(Modal);
const Modals = WithDirection(isoModal);

function AddUserModal({
  visible,
  onClose,
  client,
  intl,
  handleSubmit,
  onUserAdded,
  currentUser,
}) {
  const [agenciesOption, setAgenciesOption] = useState([]);
  const [companiesOption, setCompaniesOption] = useState([]);

  useEffect(() => {
    // Fetch list of agencies for the dropdown
    client
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
  }, [client, currentUser]); // Also add currentUser as dependency
  useEffect(() => {
    // Fetch list of companies for the dropdown
    client
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
  }, [client, currentUser]); // Add currentUser to dependencies
  function handleFormSubmit(fields) {
    const params = {
      ...fields,
      active: fields.active === "true", // Convert "true"/"false" strings to boolean
      agencies: fields.agencies || [], // Ensure agencies field is sent as an array
      companies: fields.companies || [], // Ensure companies field is sent as an array
      sector: get(fields, "sectorType[0]", ""),
      type: get(fields, "sectorType[1]", ""),
    };
    client
      .mutate({
        mutation: addUser,
        variables: params,
        // Send the new user data to the API
      })
      .then(() => {
        message.success("Processing complete!");
        onClose(); // Close the modal after successful addition
        if (onUserAdded) onUserAdded(); // Refresh the user list
      })
      .catch((error) => {
        notification.error({
          message: error.message,
        });
      });
  }

  function renderFields(group) {
    return values(group).map((field) => (
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
          label={intl.formatMessage(field.localization)}
          placeholder={intl.formatMessage(field.localization)}
          style={{ marginBottom: 5 }}
        />
      </div>
    ));
  }

  return (
    <Modals
      visible={visible}
      onCancel={onClose}
      footer={null}
      title={intl.formatMessage(userMessages.AddUser)}
    >
      <Form onSubmit={handleSubmit(handleFormSubmit)} className="login-form">
        {renderFields(addUserFields)} {/* Render fields for adding a user */}
        <div style={{ marginTop: 20, textAlign: "right" }}>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            {intl.formatMessage(userMessages.userDone)}
          </Button>
        </div>
      </Form>
    </Modals>
  );
}

const AddUserReduxForm = reduxForm({
  form: "userModel",
})(AddUserModal);

export default graphql(addUser)(injectIntl(AddUserReduxForm));

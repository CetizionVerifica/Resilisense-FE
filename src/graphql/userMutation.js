import gql from "graphql-tag";
const addUser = gql`
  mutation addUser(
    $password: String!
    $email: String!
    $name: String!
    $jobPosition: String
    $phone: String
    $extension: String
    $website: String
    $serviceProductInfo:String
    $lisence: [String]
    $percentageServiceProduct:String
    $country: String
    $sector: String
    $type: String
    $agencies: [String]
    $companies: [String]
  ) {
    addUser(
      password: $password
      data: {
        name: $name
        email: $email
        jobPosition: $jobPosition
        phone: $phone
        extension: $extension
        password: $password
        website: $website
        serviceProductInfo: $serviceProductInfo
        lisence: $lisence
        percentageServiceProduct: $percentageServiceProduct
        country: $country
        sector: $sector
        type: $type
        companies:$companies
        agencies: $agencies

      }
    ) {
      _id
      name
      email
      phone
      active
      date
      jobPosition
      website
      serviceProductInfo
      percentageServiceProduct
      country
      lisence
      sector
      type
      agencies {
        id
        users {
          _id
          name
          email
          phone
        }
      }
      companies {
        id
        users {
          _id
          name
          email
          phone
        }
      }
    }
  }
`;

const addUserToOrganisation = gql`
  mutation addUserToOrganisation($email: String!) {
    addUserToOrganisation(email: $email) {
      _id
      name
      email
      phone
      active
      date
      jobPosition
      agencies {
        id
        users {
          _id
          name
          email
          phone
        }
      }
    }
  }
`;
const updateUserById = gql`
  mutation updateUserById(
    $id: ID
    $email: String
    $name: String
    $jobPosition: String
    $phone: String
    $active: Boolean
    $website: String
    $serviceProductInfo: String
    $percentageServiceProduct: String
    $country: String
    $lisence: [String]
    $sector: String
    $type: String
    $agencies: [ID]
    $companies: [ID]
  ) {
    updateUserById(
      id: $id
      data: {
        active: $active
        agencies: $agencies
        email: $email
        name: $name
        jobPosition: $jobPosition,
        phone: $phone
        website: $website
        serviceProductInfo: $serviceProductInfo
        percentageServiceProduct: $percentageServiceProduct
        country: $country
        lisence: $lisence
        sector: $sector
        type: $type
        companies: $companies
      }
    ) {
      name
      jobPosition
      role
      phone
      extension
      lang
      active
      website
      serviceProductInfo
      percentageServiceProduct
      country
      lisence
      type
      sector      
      termsAndConditions
      date
      agencies {
        id
      }
      companies {
        id
      }
    }
  }
`;

const updateUser = gql`
  mutation updateUser(
    $email: String!
    $name: String!
    $jobPosition: String
    $phone: String
    $extension: String
  ) {
    updateUser(
      data: {
        name: $name
        email: $email
        jobPosition: $jobPosition
        phone: $phone
        extension: $extension
      }
    ) {
      _id
      name
      email
      phone
      active
      date
      currentAgency {
        id
        name
      }
      active
      jobPosition
      agencies {
        id
        name
      }
    }
  }
`;

const removeUser = gql`
  mutation removeUser($id: ID!) {
    removeUser(id: $id) {
      id
    }
  }
`;
const updateUserEmail = gql`
  mutation updateUserEmail($id: ID!, $value: String!) {
    updateUserEmail(id: $id, value: $value) {
      id
      email
    }
  }
`;

const updateUserPassword = gql`
  mutation updateUserPassword($oldPassword: String!, $newPassword: String!) {
    updateUserPassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      _id
    }
  }
`;
const updateNewUserPassword = gql`
  mutation updateNewUserPassword($newPassword: String!, $userId: String!) {
    updateNewUserPassword(newPassword: $newPassword, userId: $userId) {
      name
      jobPosition
      role
      phone
      extension
      lang
      active
      termsAndConditions
      date
    }
  }
`;

const activeUser = gql`
  mutation activeUser($id: ID!, $active: Boolean!) {
    activeUser(id: $id, active: $active) {
      id
      active
    }
  }
`;

const languageUser = gql`
  mutation updateLanguageUser($lang: String!) {
    updateLanguageUser(language: $lang) {
      _id
      lang
    }
  }
`;

const acceptTermsAndConditionsUser = gql`
  mutation acceptTermsAndConditionsUser($terms: Boolean) {
    acceptTermsAndConditionsUser(terms: $terms) {
      _id
      termsAndConditions
    }
  }
`;
const currentAgencyUser = gql`
  mutation updateCurrentAgencyUser($agency: ID!) {
    updateCurrentAgencyUser(agency: $agency) {
      _id
      currentAgency {
        id
        name
      }
    }
  }
`;
export {
  addUser,
  addUserToOrganisation,
  updateUser,
  updateUserById,
  removeUser,
  updateUserEmail,
  updateUserPassword,
  activeUser,
  languageUser,
  currentAgencyUser,
  acceptTermsAndConditionsUser,
  updateNewUserPassword,
};

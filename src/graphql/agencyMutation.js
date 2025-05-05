import gql from 'graphql-tag'
const addAgency = gql`
mutation addAgency(
  $email: String!,
  $name: String!,
  $descriptions: String,
  $phone: String,
  $country: String,
  $website: String,
  $industry: String) {
  addAgency(data: {
    name: $name,
    email: $email,
    descriptions: $descriptions,
    phone: $phone,
    country: $country,
    website: $website,
    industry: $industry,
    }) {
    id
    name
    email
    phone
    descriptions
    country
    website
    industry
    active
    date
      projects {
        id
      }
      companies {
        id
      }
    users {
      _id
      name
      jobPosition
      phone
    }
  }
}`
const updateAgency = gql`
mutation updateAgency(
  $email: String!,
  $name: String!,
  $descriptions: String,
  $phone: String,
  $country: String,
  $website: String,
  $industry: String) {
  updateAgency(data: {
    name: $name,
    email: $email,
    descriptions: $descriptions,
    phone: $phone,
    country: $country,
    website: $website,
    industry: $industry,
    }) {
    id
    name
    email
    phone
    descriptions
    country
    website
    industry
    active
    date
  }
}

`
const updateAgencyById = gql`
mutation updateAgencyById ($id: ID!, $users: [ID], $companies: [ID], $projects: [ID]){
  updateAgencyById(id: $id, data: { users: $users, companies: $companies, projects: $projects}) {
    id
    companies {
      id
    }
    users {
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
    projects {
      id
    }
  }
}
`

const removeAgency = gql`
mutation removeAgency($id: ID!) {
  removeAgency(id: $id) {
    id
  }
}
`
const removeUserFromAgency = gql`
mutation removeUserFromAgency($userId: ID!) {
  removeUserFromAgency(userId: $userId) {
    id
    users {
      _id
      name
      email
      phone
    }
  }
}
`

const showSupplierResultsMutation = gql`
 mutation showSupplierResults(
   $id: ID!,
   $partnerId: ID,
   $projectId: ID,
   $show: Boolean   
   ){
    showSupplierResults(
     id: $id,
     partnerId: $partnerId,
     projectId: $projectId,
     show: $show
  ){
     id
   }
 }
`

export {
  addAgency,
  updateAgency,
  removeAgency,
  removeUserFromAgency,
  showSupplierResultsMutation,
  updateAgencyById
}

import gql from 'graphql-tag'

const addStakeholderToCompany = gql`
 mutation addStakeholderToCompany(
  $companyName: String!,
  $name: String!,
  $jobPosition: String!,
  $email: String!,
  $phone: String,
  $extention: String,
  $fax: String,
  $companyId: ID!,
  ){
    addStakeholderToCompany(
      id: $companyId,
      data:{
        companyName: $companyName,
        name: $name,
        jobPosition: $jobPosition,
        email: $email,
        phone: $phone,
        fax: $fax,
        extention: $extention,
      }){
     id
   }
 }`
const addStakeholdersToCompany = gql`
mutation AddStakeholdersToCompany(
 $data: [StakeholderInputType!],
 $companyId: ID!,
 ){
   addStakeholdersToCompany(
     id: $companyId,
     data:$data){
    id
  }
}`
const removeStakeholder = gql`
mutation RemoveStakeholder($id: ID!) {
  removeStakeholder(id: $id) {
    id
  }
}
`

const updateStakeholder = gql`
mutation UpdateStakeholder(
  $id: ID!,
  $companyName: String!,
  $name: String!,
  $jobPosition: String!,
  $email: String!,
  $phone: String,
  $extention: String,
  $fax: String) {
  updateStakeholder(
    id: $id,
    data:{
      companyName: $companyName,
      name: $name,
      jobPosition: $jobPosition,
      email: $email,
      phone: $phone,
      fax: $fax,
      extention: $extention,
    }) {
      id
      name
      companyName
      jobPosition
      phone
      email
      fax
      extention
  }
}
`

const activeStakeholder = gql`
mutation activeStakeholder($id: ID!, $active:Boolean! ) {
  activeStakeholder(id: $id, active: $active) {
    id
    active
  }
}
`
export {
  addStakeholderToCompany,
  addStakeholdersToCompany,
  removeStakeholder,
  updateStakeholder,
  activeStakeholder,
}

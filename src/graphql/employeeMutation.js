import gql from 'graphql-tag'

const addEmployeeToCompany = gql`
 mutation AddEmployeeToCompany(
  $name: String!,
  $jobPosition: String!,
  $email: String!,
  $phone: String,
  $extention: String,
  $fax: String,
  $companyId: ID!,
  ){
    addEmployeeToCompany(
      id: $companyId,
      data:{
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

const addEmployeesToCompany = gql`
mutation AddEmployeesToCompany(
 $data: [EmployeeInputType!],
 $companyId: ID!,
 ){
   addEmployeesToCompany(
     id: $companyId,
     data:$data){
    id
  }
}`

const removeEmployee = gql`
mutation RemoveEmployee($id: ID!) {
  removeEmployee(id: $id) {
    id
  }
}
`

const updateEmployee = gql`
mutation updateEmployee(
  $id: ID!,
  $name: String!,
  $jobPosition: String!,
  $email: String!,
  $phone: String,
  $extention: String,
  $fax: String) {
  updateEmployee(
    id: $id,
    data:{
      name: $name,
      jobPosition: $jobPosition,
      email: $email,
      phone: $phone,
      fax: $fax,
      extention: $extention,
    }) {
      id
      name
      jobPosition
      phone
      email
      fax
      extention
  }
}
`

const activeEmployee = gql`
mutation activeEmployee($id: ID!, $active:Boolean! ) {
  activeEmployee(id: $id, active: $active) {
    id
    active
  }
}
`
export {
  addEmployeesToCompany,
  addEmployeeToCompany,
  removeEmployee,
  updateEmployee,
  activeEmployee,
}

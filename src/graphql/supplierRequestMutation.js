import gql from 'graphql-tag'
const addSupplierRequest = gql`
 mutation addSupplierRequest(
  $email: String!,
  $type: String!,
  $requestedYear: Int!,
  $company: ID!  
  ){
    addSupplierRequest(
      email: $email,
      type: $type,
      requestedYear: $requestedYear,      
      company: $company
     ){
     id
   }
 }`

export {
  addSupplierRequest,
}

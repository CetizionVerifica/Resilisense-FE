import gql from 'graphql-tag'
export default gql`
{
  pendingSupplierRequests {
    company {
      id
      name
    }
    requestedYears
  }
}
`

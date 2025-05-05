import gql from 'graphql-tag'
export default gql`
query employees(
  $companyId: ID!
  $sort: String,
  $order: String,
  $limit: Int,
  $page: Int,
  $search: String,
  $s: String
  ){
  employees(
    companyId: $companyId,
    sort: $sort,
    order: $order,
    limit: $limit,
    page: $page,
    search: $search,
    s: $s
  ) {
    id
    name
    email
    phone
    extention
    jobPosition
    fax
    active
    company{
        id
    }
  }
}
`

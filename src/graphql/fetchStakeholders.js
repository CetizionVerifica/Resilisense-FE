import gql from 'graphql-tag'
export default gql`
query stakeholders(
  $companyId: ID!
  $sort: String,
  $order: String,
  $limit: Int,
  $page: Int,
  $search: String,
  $s: String
  ){
  stakeholders(
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
    companyName
    email
    phone
    extention
    jobPosition
    fax
    active
    isCompany
    company{
        id
    }
  }
}
`

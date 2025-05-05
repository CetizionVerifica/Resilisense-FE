import gql from "graphql-tag";
export default gql`
  query users(
    $sort: String
    $order: String
    $limit: Int
    $page: Int
    $search: String
    $s: String
  ) {
    users(
      sort: $sort
      order: $order
      limit: $limit
      page: $page
      search: $search
      s: $s
    ) {
      _id
      email
      name
      role
      active
      reseller
      totalCompaniesAllowed
      agencies {
        id
      }
    }
  }
`;

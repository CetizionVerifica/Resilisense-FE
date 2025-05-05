import gql from "graphql-tag";
export default gql`
  query companies(
    $sort: String
    $order: String
    $limit: Int
    $page: Int
    $search: String
    $s: String
  ) {
    companies(
      sort: $sort
      order: $order
      limit: $limit
      page: $page
      search: $search
      s: $s
    ) {
      id
      name
      personName
      personEmail
      personPhone
      lisence
      reseller

      users {
        name
      }
    }
  }
`;

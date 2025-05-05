import gql from "graphql-tag";
export default gql`
  query {
    agencies {
      id
      email
      name
      date
      reseller
      users {
        _id
      }
      projects {
        id
      }
      companies {
        id
      }

      updatedBy {
        _id
        name
      }
    }
  }
`;

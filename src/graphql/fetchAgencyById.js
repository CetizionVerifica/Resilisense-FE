import gql from "graphql-tag";
export default gql`
  query agencyById($id: ID) {
    agencyById(id: $id) {
      id
      email
      name
      date
      users {
        _id
        name
      }
      projects {
        id
        title
      }
      companies {
        id
        name
      }
      updatedBy {
        _id
        name
      }
    }
  }
`;

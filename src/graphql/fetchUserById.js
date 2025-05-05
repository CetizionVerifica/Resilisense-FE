import gql from "graphql-tag";
export default gql`
  query userById($id: ID!) {
    userById(id: $id) {
      _id
      name
      email
      jobPosition
      serviceProductInfo
      percentageServiceProduct
      country
      lisence
      type
      sector
      website
      date
      role
      agencies {
        id
        name
      }
      companies {
        id
        name
      }
      active
      phone
    }
  }
`;

import gql from "graphql-tag";
export default gql`
  {
    agency {
      id
      name
      email
      descriptions
      phone
      country
      website
      industry
      active
      logo
      date
      reseller
      projects {
        id
      }
      companies {
        id
      }
      users {
        _id
        name
        email
        phone
        date
      }
      updatedBy {
        _id
        name
      }
      createdBy {
        _id
        name
      }
    }
  }
`;

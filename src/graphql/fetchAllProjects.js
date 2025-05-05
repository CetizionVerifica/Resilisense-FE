import gql from "graphql-tag";
export default gql`
  query {
    allProjects {
      id
      title
    }
  }
`;

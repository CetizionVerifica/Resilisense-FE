import gql from 'graphql-tag'
export default gql`
query projectCompany($project: String!){
    projectCompany(project: $project) {
        lisence
    }
  }
`
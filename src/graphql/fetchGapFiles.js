import gql from 'graphql-tag'
export default gql`
query gapFiles($projectId: ID!){
  gapFiles(projectId: $projectId) {
    id
    name
    path
    keyConsiderations
    assessmentComplete
    criteria {
      name
      value
    }
  }
}
`

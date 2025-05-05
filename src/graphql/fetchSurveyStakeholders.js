import gql from 'graphql-tag'
export default gql`
query surveyStakeholders(
  $companyId: ID!
  $type: String!
  ){
    surveyStakeholders(
    companyId: $companyId,
    type: $type
  ) {
    id
    name
    email
    phone
    jobPosition
  }
}
`

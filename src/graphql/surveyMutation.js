import gql from 'graphql-tag'
const flagSurvey = gql`
 mutation flagSurvey(
  $id: ID!,
  $flag: String!,
  ){
    flagSurvey(
      id: $id,
      flag: $flag,
     ){
      id
      title
      flag
   }
 }`

export {
  flagSurvey,
}

import gql from 'graphql-tag'
export default gql`
query companiesByUser(
  $id: ID
  ){
companiesByUser(
  id: $id
  ) {
    id
    name
    personName
    personEmail
    personPhone
    lisence
    users {
      name
    }
  }
}
`


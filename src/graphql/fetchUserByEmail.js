import gql from 'graphql-tag'
export default gql`
query userByEmail(
  $email: String
  ){
  userByEmail(
    email: $email
  ) {
    _id
    email
    agencies {
      id
    }
  }
}
`

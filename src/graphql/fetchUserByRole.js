import gql from 'graphql-tag'
export default gql`
query userByRole($role: String!){
    userByRole(role: $role) {
        _id
      name
      role
    }
  }
`


import gql from 'graphql-tag'
const forgotPasswordMutation = gql`
mutation forgotPassword($email: String!) {
    forgotPassword(email: $email) 
}
`

export default forgotPasswordMutation
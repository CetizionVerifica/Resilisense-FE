import gql from 'graphql-tag'
export default gql`
{
  pendingPartnerRequests {
    company {
      id
      name
    }
    partnerRequestedProjects {
      id
      title
    }
  }
}
`

import gql from 'graphql-tag'
export default gql`
query partners(
  $id: String
  ){
  partners(
  id: $id
  ) {
    id
    name
    partners {
      id      
      partnerCompany {
        id
        name
        agency {
          id
          name
        }
      }
      projects {
        id
        title
        year
        status        
      }
      requestedYears
      partnerRequestedProjects {
        id
        title
        year
        agency{
          id
        }
      }
      showProjectResults {
        id
      }
    }
  }
}
`


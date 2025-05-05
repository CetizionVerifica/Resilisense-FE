import gql from 'graphql-tag'
export default gql`
query suppliers(
  $id: String
  ){
  suppliers(
  id: $id
  ) {
    id
    name
    suppliers {
      id
      agency {
        id
        name
      }
      projects {
        id
        title
        year
        status
        supplierProperties {
          supplier
          fullAccessToResults
          physicalAudit
        }
        company {
          id
          email
          name
          country
          sector
          type
          personName
          jobPosition
          personEmail
        }
        gapAnalysis {
          id
          relevance
          weightedPerformance
          coreSubjects {
            coreSubject
            relevanceValue
            WeightValue
            performanceValue
            issueOfInterests {
              issueOfInterest
              relevanceValue
              performanceValue
              WeightValue
            }
          }
        }
      }
    }
  }
}
`


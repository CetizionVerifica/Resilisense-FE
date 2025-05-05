import gql from 'graphql-tag'
export default gql`
query gapAnalysis($id: ID!){
  gapAnalysis(id: $id) {
    id
    project {
      id
      title
      year
      status
      updatedDate
      company {
        id
        name
      }
    }
    coreSubjects {
      coreSubject
      issueOfInterests {
        issueOfInterest
        customField
        extraCustomField
        keyConsiderations {
          keyConsideration
          performanceValue
          actualPerformanceValue
          relevanceValue
          revisedWeightValue
          relevanceWeightValue
          WeightValue
          issueLevel
          note
          revisingScore
          revisedScore
          noDocument
          noRelatedDocument
          file {
            id
          }
        }
        performanceValue
        revisedScore
        relevanceValue
        revisedWeightValue
        relevanceWeightValue
        WeightValue
      }
      performanceValue
      relevanceValue
      revisedWeightValue
      revisedScore
      relevanceWeightValue
      WeightValue
    }
    weightedPerformance
    relevance
    revisedWeightValue
    updatedBy {
      name
      jobPosition
      phone
      extension
      active
      date
    }
    createdBy {
      name
      jobPosition
      phone
      extension
      active
      date
    }
    date
    updatedDate
  }
  }
`

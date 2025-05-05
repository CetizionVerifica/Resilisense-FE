import gql from 'graphql-tag'

const updateGapAnalysisMutation = gql`
 mutation updateGapAnalysis(
   $id: ID!,
   $coreSubject: String!,
   $issueOfInterest: String!,
   $keyConsideration: String!,
   $performanceValue: Int,
   $relevanceValue: Int,
   $note: String,
   $noDocument: Boolean
   $noRelatedDocument: Boolean,
   $customField: [Float],
  ){
    updateGapAnalysis(
      id: $id
      data: {
        coreSubject: $coreSubject
        issueOfInterest: $issueOfInterest
        keyConsideration: $keyConsideration
        performanceValue: $performanceValue
        relevanceValue: $relevanceValue
        note: $note
        customField: $customField
        noDocument: $noDocument
        noRelatedDocument: $noRelatedDocument
      }
    ){
        id
        project {
         id
         status
         gapAnalysis {
          id
          coreSubjects {
            coreSubject
            totalKeyConsiderations
          }
          weightedPerformance
        }
        }
        coreSubjects {
          coreSubject
          issueOfInterests {
            issueOfInterest
            keyConsiderations {
              performanceValue
              actualPerformanceValue
              relevanceValue
              relevanceWeightValue
              WeightValue
              note
              noDocument
              noRelatedDocument
              file {
                id
              }
            }
            performanceValue
            relevanceValue
            WeightValue
          }
          performanceValue
          relevanceValue
          WeightValue
        }
        weightedPerformance
        relevance
        updatedBy {
          name
        }
        createdBy {
          name
        }
        date
        updatedDate
   }
 }
`
const updateGapAnalysisWithExtraMutation = gql`
 mutation updateGapAnalysis(
   $id: ID!,
   $coreSubject: String!,
   $issueOfInterest: String!,
   $keyConsideration: String!,
   $performanceValue: Int,
   $relevanceValue: Int,
   $note: String,
   $noDocument: Boolean
   $noRelatedDocument: Boolean,
   $extraCustomField: [Float]
  ){
    updateGapAnalysis(
      id: $id
      data: {
        coreSubject: $coreSubject
        issueOfInterest: $issueOfInterest
        keyConsideration: $keyConsideration
        performanceValue: $performanceValue
        relevanceValue: $relevanceValue
        note: $note
        extraCustomField: $extraCustomField
        noDocument: $noDocument
        noRelatedDocument: $noRelatedDocument
      }
    ){
        id
        project {
         id
         status
         gapAnalysis {
          id
          coreSubjects {
            coreSubject
            totalKeyConsiderations
          }
          weightedPerformance
        }
        }
        coreSubjects {
          coreSubject
          issueOfInterests {
            issueOfInterest
            keyConsiderations {
              performanceValue
              actualPerformanceValue
              relevanceValue
              relevanceWeightValue
              WeightValue
              note
              noDocument
              noRelatedDocument
              file {
                id
              }
            }
            performanceValue
            relevanceValue
            WeightValue
          }
          performanceValue
          relevanceValue
          WeightValue
        }
        weightedPerformance
        relevance
        updatedBy {
          name
        }
        createdBy {
          name
        }
        date
        updatedDate
   }
 }
`

const updateGapAnalysisFileMutation = gql`
 mutation updateGapAnalysisFile(
   $id: ID!,
   $coreSubject: String!,
   $issueOfInterest: String!,
   $keyConsideration: String!,
   $noDocument:  Boolean,
   $noRelatedDocument:  Boolean,
   $file: ID
  ){
    updateGapAnalysisFile(
      id: $id,
      data: {
        coreSubject: $coreSubject,
        issueOfInterest: $issueOfInterest,
        keyConsideration: $keyConsideration,
        noDocument: $noDocument,
        noRelatedDocument: $noRelatedDocument,
        file: $file
      }
    ){
        id
        project {
         id
         status
         gapAnalysis {
          id
          coreSubjects {
            coreSubject
            totalKeyConsiderations
          }
          weightedPerformance
        }
        }
        coreSubjects {
          coreSubject
          issueOfInterests {
            issueOfInterest
            keyConsiderations {
              performanceValue
              actualPerformanceValue
              relevanceValue
              relevanceWeightValue
              WeightValue
              note
              noDocument
              noRelatedDocument
              file {
                id
              }
            }
            performanceValue
            relevanceValue
            WeightValue
          }
          performanceValue
          relevanceValue
          WeightValue
        }
        weightedPerformance
        relevance
        updatedBy {
          name
        }
        createdBy {
          name
        }
        date
        updatedDate
   }
 }
`

export {
  updateGapAnalysisMutation,
  updateGapAnalysisFileMutation,
  updateGapAnalysisWithExtraMutation
}

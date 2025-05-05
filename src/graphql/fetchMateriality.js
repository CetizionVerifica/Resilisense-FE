import gql from 'graphql-tag'
export default gql`
query materiality($id: ID!){
  materiality(id: $id) {
    id
    project {
      id
      title
      year
      company {
        id
        name
        stakeholders {
          id
          name
          companyName
          isCompany
        }
      }
      gapAnalysis {
        id
        coreSubjects {
          coreSubject
          issueOfInterests {
            issueOfInterest
            keyConsiderations {
              keyConsideration
              actualPerformanceValue
              relevanceValue
              revisedScore
              issueLevel              
            }
          }
        }
      }
    }

    stakeholders {
      stakeholder{
        id
        name
      }
      groupXFactor
      credits
      weightValue
      isCompany
      coreSubjects {
        coreSubject
        rating
        relevanceValue
        relevanceWeightValue
        issueOfInterests {
          issueOfInterest
          rating
          relevanceValue
          relevanceWeightValue
        }
      }
    }
    coreSubjects {
      coreSubject
      relevanceCompanyValue
      relevanceEmployeesValue
      relevanceStakeholdersValue
      weightValue
      issueOfInterests {
        issueOfInterest
        relevanceCompanyValue
        relevanceEmployeesValue
        relevanceStakeholdersValue
        weightValue
      }
    }
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

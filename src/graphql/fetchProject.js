import gql from 'graphql-tag'
export default gql`
query project($id: ID!){
    project(id:$id) {
      id
      title
      year
      active
      arctive
      date
      numberOfEmployees
      endDate
      updatedDate
      status
      createdBy {
        _id
        name
      }
      updatedBy {
        _id
        name
      }
      company {
        id
        name
        email
        sector
        type
        lisence
        employees {
          id
          name
          jobPosition
          email
          phone
          extention
          fax
          active
        }
        stakeholders {
          id
          name
          companyName
          jobPosition
          email
          phone
          extention
          fax
          active
        }
      }
      gapAnalysis {
        id
        coreSubjects {
          coreSubject
          performanceValue
          relevanceValue
          WeightValue
          totalKeyConsiderations
          issueOfInterests {
            issueOfInterest
            keyConsiderations {
              performanceValue
              relevanceValue
              noDocument
              noRelatedDocument
              file {
                id
              }              
            }
          }
        }
        weightedPerformance
      }
      materiality {
        id
        coreSubjects {
          coreSubject
          relevanceCompanyValue
          relevanceStakeholdersValue
          weightValue
          issueOfInterests {
            relevanceCompanyValue
            relevanceStakeholdersValue
          }
        }
      }
    }
  }
`

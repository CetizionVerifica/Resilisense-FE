import gql from 'graphql-tag'
const fetchProjectSurvey = gql`
query projectSurvey(
  $id: ID
  ){
  projectSurvey(
    id: $id
  ) {
    id
    project {
      id
      title
      year
      company {
        id
        name
      }
      materiality {
        id
        stakeholders {
          stakeholder {
            id
          }
          groupXFactor
        }
      }
    }
    internal {
      recipients {
        name
        jobPosition
        email
        phone
        status
        responseDate
      }
    }    
    external {
      recipients {
        stakeholder
        name
        jobPosition
        email
        phone
        status
        responseDate
      }
    }    
    reminderSendDate
    status
    sendDate
    closeDate
  }
}
`

const fetchProjectSurveys = gql`
query projectSurveys(
  $sort: String,
  $order: String,
  $limit: Int,
  $page: Int,
  $s: String
  ){
  projectSurveys(
    sort: $sort,
    order: $order,
    limit: $limit,
    page: $page,
    s: $s
  ) {
    id
    project {
      id
      title
      year
      company {
        id
        name
      }
    }
    status
    sendDate
    reminderSendDate
    closeDate
  }
}
`

export {
  fetchProjectSurvey,
  fetchProjectSurveys,
}

import gql from 'graphql-tag'
export default gql`
query actionsAndKPIs(
  $companyId: ID!
  $sort: String,
  $order: String,
  $limit: Int,
  $page: Int,
  $search: String,
  $s: String
  ){
  actionsAndKPIs(
    companyId: $companyId,
    sort: $sort,
    order: $order,
    limit: $limit,
    page: $page,
    search: $search,
    s: $s
  ) {
    id
    company {
      id
    }
    coreSubject
    issueOfInterest
    action
    kpi
    baselinePerformance
    projectPerformance{
      project
      performance
      targetPerformance
      isBaseline
      year
    }
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

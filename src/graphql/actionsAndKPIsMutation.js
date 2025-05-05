import gql from 'graphql-tag'

const addActionsAndKPIsToCompany = gql`
 mutation AddActionsAndKPIs(
  $coreSubject: String!,
  $issueOfInterest: String!,
  $action: String,
  $kpi: String,
  $baselinePerformance: Float,
  $targetPerformance: Float,
  $companyId: ID!,
  $projectId: ID!,
  $year: Float!
  ){
    addActionsAndKPIs(
      id: $companyId,
      data:{
        coreSubject: $coreSubject,
        issueOfInterest: $issueOfInterest,
        action: $action,
        kpi: $kpi,
        targetPerformance: $targetPerformance,
        baselinePerformance: $baselinePerformance,
        projectId: $projectId,
        year: $year
      }){
     id
   }
 }`

const removeActionAndKPI = gql`
mutation removeActionAndKPI($id: ID!) {
  removeActionAndKPI(id: $id) {
    id
  }
}
`

const updateActionAndKPI = gql`
mutation updateActionAndKPI(
  $id: ID!,
  $coreSubject: String!,
  $issueOfInterest: String!,
  $action: String,
  $kpi: String,
  ) {
    updateActionAndKPI(
    id: $id,
    data:{
      coreSubject: $coreSubject,
      issueOfInterest: $issueOfInterest,
      action: $action,
      kpi: $kpi,
    }) {
      id
      coreSubject
      issueOfInterest
      action
      kpi
  }
}
`

const updateProjectActionAndKPI = gql`
mutation updateProjectActionAndKPI(
  $id: ID!,
  $projectId: ID!,
  $performance: Float!,
  $targetPerformance: Float!,
  $year: Float!
) {
    updateProjectActionsAndKPIs(
    id: $id,
    data:{
      project: $projectId,
      performance: $performance,
      targetPerformance: $targetPerformance,
      year: $year,
    }) {
      id
      coreSubject
      projectPerformance{
        project
        performance
        targetPerformance
        isBaseline
        year
      }
      issueOfInterest
      action
      kpi
      baselinePerformance
  }
}
`

export {
  addActionsAndKPIsToCompany,
  removeActionAndKPI,
  updateActionAndKPI,
  updateProjectActionAndKPI,
}

import gql from "graphql-tag";

const fetchProjects = gql`
  query projects(
    $companyId: ID
    $sort: String
    $order: String
    $limit: Int
    $page: Int
    $search: String
    $s: String
  ) {
    projects(
      companyId: $companyId
      sort: $sort
      order: $order
      limit: $limit
      page: $page
      search: $search
      s: $s
    ) {
      id
      title
      year
      active
      arctive
      status
      date
      reseller
      updatedDate
      numberOfEmployees
      createdBy {
        name
      }
      updatedBy {
        name
      }
      agency {
        id
      }
      gapAnalysis {
        id
        relevance
        weightedPerformance
      }
      materiality {
        id
      }
      company {
        id
        name
        sector
        type
      }
    }
    users {
      _id
      name
      jobPosition
      phone
      extension
      active
      date
    }
  }
`;

const fetchProjectsByStatus = gql`
  query projectsByStatus(
    $status: String
    $sort: String
    $order: String
    $limit: Int
    $page: Int
    $search: String
    $s: String
  ) {
    projectsByStatus(
      status: $status
      sort: $sort
      order: $order
      limit: $limit
      page: $page
      search: $search
      s: $s
    ) {
      id
      title
      year
      active
      arctive
      status
      date
      reseller
      updatedDate
      numberOfEmployees
      gapFiles {
        keyConsiderations
        criteria {
          name
          value
        }
      }
      createdBy {
        name
      }
      updatedBy {
        name
      }
      agency {
        id
      }
      gapAnalysis {
        id
        relevance
        weightedPerformance
      }
      company {
        id
        name
        sector
        type
      }
    }
  }
`;

const fetchProjectsByYear = gql`
  query projectsByYear($year: Int) {
    projectsByYear(year: $year) {
      id
      title
      company {
        id
      }
      agency {
        id
      }
    }
  }
`;

export { fetchProjects, fetchProjectsByStatus, fetchProjectsByYear };

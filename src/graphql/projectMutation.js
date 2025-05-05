import gql from "graphql-tag";
const addProjectToCompany = gql`
  mutation addProject(
    $title: String!
    $year: Int!
    $companyId: ID!
    $reseller: String!
    $date: Float!
    $numberOfEmployees: Int
  ) {
    addProject(
      data: {
        title: $title
        year: $year
        date: $date
        reseller: $reseller
        numberOfEmployees: $numberOfEmployees
      }
      companyId: $companyId
    ) {
      id
    }
  }
`;
const removeProject = gql`
  mutation RemoveProject($id: ID!) {
    removeProject(id: $id) {
      id
    }
  }
`;

const updateProject = gql`
  mutation UpdateProject(
    $id: ID!
    $title: String!
    $year: Int!
    $numberOfEmployees: Int
    $date: Float!
    $endDate: Float
  ) {
    updateProject(
      id: $id
      data: {
        title: $title
        year: $year
        date: $date
        endDate: $endDate
        numberOfEmployees: $numberOfEmployees
      }
    ) {
      id
      title
      year
      numberOfEmployees
      active
      arctive
      date
      endDate
      updatedDate
      createdBy {
        _id
        name
      }
      updatedBy {
        _id
        name
      }
    }
  }
`;
const updateProjectTitle = gql`
  mutation UpdateProjectTitle($id: ID!, $title: String!) {
    updateProjectTitle(id: $id, title: $title) {
      id
      title
      year
      active
      arctive
      date
      updatedDate
      createdBy {
        _id
        name
      }
      updatedBy {
        _id
        name
      }
    }
  }
`;

const activeProject = gql`
  mutation ActiveProject($id: ID!, $active: Boolean!) {
    activeProject(id: $id, active: $active) {
      id
      active
    }
  }
`;

const archiveProject = gql`
  mutation ArchiveProject($id: ID!, $archive: Boolean!) {
    archiveProject(id: $id, active: $archive) {
      id
      arctive
    }
  }
`;

const changeProjectStatus = gql`
  mutation changeProjectStatus($id: ID!, $status: String!) {
    changeProjectStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

const submitProjectAssessmentStatus = gql`
  mutation submitProjectAssessmentStatus(
    $id: ID!
    $status: String!
    $revisingScores: [RevisingScoreType]
  ) {
    submitProjectAssessmentStatus(
      id: $id
      status: $status
      revisingScores: $revisingScores
    ) {
      id
      status
    }
  }
`;

const changeSupplierFullAccess = gql`
  mutation changeSupplierFullAccess(
    $id: ID!
    $company: ID!
    $agency: ID!
    $fullAccessToResults: Boolean!
  ) {
    changeSupplierFullAccess(
      id: $id
      company: $company
      agency: $agency
      fullAccessToResults: $fullAccessToResults
    ) {
      id
      supplierProperties {
        supplier
        fullAccessToResults
      }
    }
  }
`;

const changeSupplierPhysicalAudit = gql`
  mutation changeSupplierPhysicalAudit(
    $id: ID!
    $supplier: String!
    $physicalAudit: Boolean
  ) {
    changeSupplierPhysicalAudit(
      id: $id
      supplier: $supplier
      physicalAudit: $physicalAudit
    ) {
      id
      supplierProperties {
        supplier
        physicalAudit
      }
    }
  }
`;

export {
  updateProject,
  addProjectToCompany,
  removeProject,
  updateProjectTitle,
  activeProject,
  archiveProject,
  changeProjectStatus,
  submitProjectAssessmentStatus,
  changeSupplierFullAccess,
  changeSupplierPhysicalAudit,
};

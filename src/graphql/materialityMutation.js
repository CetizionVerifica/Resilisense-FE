import gql from 'graphql-tag'

const addMaterialityToProject = gql`
mutation AddMaterialityToProject($projectId: ID!, $stakeholderId: ID!, $weight: Int!) {
  addMateriality(projectId: $projectId, stakeholderId: $stakeholderId, data: {weight: $weight}) {
    id
    materiality {
      id
      weight
      project {
        id
      }
      stakeholder {
        id
      }
    }
  }
}
`
const updateMaterialityStakeholderWeight = gql`
mutation UpdateMaterialityWeight($id: ID!, $weight: Int!) {
  updateMaterialityStakeholderWeight(id: $id, weight: $weight) {
    id
    project {
      id
      materiality {
        id
        weight
      }
    }
  }
}
`

const materialityIssueOfInterest = gql`
mutation MaterialityIssueOfInterest(
  $id: ID!,
  $coreSubject: String!,
  $isuueOfInterest: String!,
  $weight: Int,
  $note: String) {
  materialityIssueOfInterest(
    id: $id,
    data: {
      note: $note,
      weight: $weight,
      coreSubject: $coreSubject,
      isuueOfInterest: $isuueOfInterest
    }) {
    id
    weight
    isuueOfInterests {
      coreSubject
      isuueOfInterest
      weight
      note
    }
    project {
      id
    }
  }
}
`

const removeMaterialityIssueOfInterest = gql`
mutation RemoveMaterialityIssueOfInterest($id: ID!, $isuueOfInterest: String!) {
  removeMaterialityIssueOfInterest(id: $id, isuueOfInterest: $isuueOfInterest) {
    id
    isuueOfInterests {
      coreSubject
      isuueOfInterest
      weight
      note
    }
    project {
      id
    }
  }
}

`
const mUpdateCoreSubjectRating = gql`
mutation stakeholderCoreSubjectsRating($id: ID!, $stakeholderId: ID!, $data: [MCoreSubjectInputType]!) {
  stakeholderCoreSubjectsRating(id: $id, stakeholderId: $stakeholderId, data: $data) {
    id
    stakeholders {
      groupXFactor
      credits
      weightValue
      coreSubjects {
        coreSubject
        rating
        relevanceValue
        relevanceWeightValue
      }
    }
  }
}
`

const mUpdateIssueOfInterestRating = gql`
mutation stakeholderIssueOfInterestRating(
  $id: ID!,
  $stakeholderId: ID!,
  $coreSubject: String!,
  $data: [MIssueOfInterestInputType]!) {
  stakeholderIssueOfInterestRating(
    id: $id,
    stakeholderId: $stakeholderId,
    coreSubject: $coreSubject,
    data: $data){
    id
    stakeholders {
      groupXFactor
      credits
      weightValue
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
  }
}
`

const mUpdateStakeHolderGroup = gql`
mutation updateStakeholderGroup($id: ID!, $stakeholderId: ID!, $groupXFactor: Int!) {
  mUpdateStakeholderGroup(id: $id, stakeholderId: $stakeholderId, groupXFactor: $groupXFactor) {
    id
    coreSubjects {
      coreSubject
      relevanceCompanyValue
      relevanceStakeholdersValue
    }
    stakeholders {
      stakeholder {
        id
        name
      }
      groupXFactor
      credits
      weightValue
    }
  }
}
`

export {
  addMaterialityToProject,
  updateMaterialityStakeholderWeight,
  materialityIssueOfInterest,
  removeMaterialityIssueOfInterest,
  mUpdateCoreSubjectRating,
  mUpdateIssueOfInterestRating,
  mUpdateStakeHolderGroup,
}

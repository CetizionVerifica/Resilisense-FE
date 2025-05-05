import gql from 'graphql-tag'
export default gql`
query projectMateriality($id: ID!) {
  project(id: $id) {
    id
    title
    materiality {
      id
      weight
      project {
        id
      }
      stakeholder {
        id
      }
      isuueOfInterests {
        coreSubject
        isuueOfInterest
        weight
        note
      }
    }
    company {
      id
      name
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
        isCompany

      }
    }
  }
}
`

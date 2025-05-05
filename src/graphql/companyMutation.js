import gql from 'graphql-tag'


const addCompanyMutation = gql`
 mutation AddCompany(
   $name: String!,
   $email: String,
   $website: String,
   $sector: String,
   $type: String,
   $serviceProductInfo:String,
   $lisence: [String],
   $users: [String],
   $percentageServiceProduct:String,
   $country: String,
   $phone: String,
   $fax: String,
   $personName: String!,
   $jobPosition: String!,
   $personEmail: String!,
   $personPhone: String,
   $personExtetion: String,
   $personFax: String,
   $password: String!
  ){
   addCompany(
     data:{
      name: $name,
      email: $email,
      website: $website,
      sector: $sector,
      type: $type,
      serviceProductInfo: $serviceProductInfo,
      percentageServiceProduct:$percentageServiceProduct,
      country: $country,
      lisence: $lisence,
      users: $users,
      phone: $phone,
      fax: $fax,
      personName: $personName,
      jobPosition: $jobPosition,
      personEmail: $personEmail,
      personPhone: $personPhone,
      personExtetion: $personExtetion,
      personFax: $personFax,
      password: $password
     }){
     id
   }
 }
`

const updateCompanyMutation = gql`
 mutation updateCompany(
   $id: ID!,
   $name: String!,
   $email: String,
   $sector: String,
   $lisence: [String],
   $reseller: String,
   $type: String,
   $serviceProductInfo:String,
   $percentageServiceProduct:String,
   $website: String,
   $country: String,
   $phone: String,
   $fax: String,
   $personName: String!,
   $jobPosition: String!,
   $personEmail: String!,
   $personPhone: String,
   $personExtetion: String,
   $personFax: String,
   $password: String!,
  ){
    updateCompany(
    id: $id,
    data:{
      name: $name,
      email: $email,
      website: $website,
      sector: $sector,
      type: $type,
      lisence: $lisence,
      reseller: $reseller,
      serviceProductInfo: $serviceProductInfo,
      percentageServiceProduct:$percentageServiceProduct,
      country: $country,
      phone: $phone,
      fax: $fax,
      personName: $personName,
      jobPosition: $jobPosition,
      personEmail: $personEmail,
      personPhone: $personPhone,
      personExtetion: $personExtetion,
      personFax: $personFax,
      password: $password
     }){
     id
     name
      email
      website
      sector
      type
      serviceProductInfo
      percentageServiceProduct
      country
      phone
      fax
      personName
      jobPosition
      personEmail
      personPhone
      personExtetion
      personFax
      password
   }
 }
`
const updateEmailTemplatesMutation = gql`
 mutation updateEmailTemplates(
   $id: ID!,
   $internalEmailTemplate: String,
   $internalReminderEmailTemplate: String,
   $externalEmailTemplate: String,
   $externalReminderEmailTemplate: String,

  ){
    updateEmailTemplates(
    id: $id,
    data:{
      internalEmailTemplate: $internalEmailTemplate,
      internalReminderEmailTemplate: $internalReminderEmailTemplate,
      externalEmailTemplate: $externalEmailTemplate,
      externalReminderEmailTemplate: $externalReminderEmailTemplate,     
     }){
     id
     internalEmailTemplate
     internalReminderEmailTemplate
     externalEmailTemplate
     externalReminderEmailTemplate
   }
 }
`
const removeCompany = gql`
mutation RemoveCompany($id: ID!){
  removeCompany(id: $id){
      id
    }
  }
`
const updateEmailTemplates = gql`
mutation RemoveCompany($id: ID!){
  removeCompany(id: $id){
      id
    }
  }
`

const requestSupplierMutation = gql`
 mutation requestSupplier(
   $id: String,
   $agencyId: String,
   $companyId: String,
   $requestedYear: Int
  ){
    requestSupplier(
     data:{
      id: $id,
      agencyId: $agencyId,
      companyId: $companyId,
      requestedYear: $requestedYear
     }){
     id
   }
 }
 `

const rejectSupplierMutation = gql`
  mutation rejectSupplier(
    $id: ID!,
    $partnerId: ID,
    $year: Int   
    ){
    rejectSupplier(
      id: $id,
      partnerId: $partnerId,
      year: $year
  ){
      id
    }
  }
`

const acceptSupplierMutation = gql`
 mutation acceptSupplier(
   $id: ID!,
   $partnerId: ID,
   $projectId: ID,
   $companyId: ID,
   $year: Int   
   ){
    acceptSupplier(
     id: $id,
     partnerId: $partnerId,
     projectId: $projectId,
     companyId: $companyId,
     year: $year
  ){
     id
   }
 }
`

const requestPartnerMutation = gql`
 mutation requestPartner(
   $id: String,
   $agencyId: String,
   $companyId: String,
   $projectId: String
  ){
    requestPartner(
     data:{
      id: $id,
      agencyId: $agencyId,
      companyId: $companyId,
      projectId: $projectId
     }){
     id
   }
 }
 `

const rejectPartnerMutation = gql`
  mutation rejectPartner(
    $id: ID!,
    $partnerId: ID,
    $projectId: ID   
    ){
    rejectPartner(
      id: $id,
      partnerId: $partnerId,
      projectId: $projectId
  ){
      id
    }
  }
`

const acceptPartnerMutation = gql`
 mutation acceptPartner(
   $id: ID!,
   $partnerId: ID,
   $projectId: ID,
   $companyId: ID
   $partnerProjectId: ID
   $partnerAgencyId: ID
   ){
    acceptPartner(
     id: $id,
     partnerId: $partnerId,
     projectId: $projectId,
     companyId: $companyId
     partnerProjectId: $partnerProjectId
     partnerAgencyId: $partnerAgencyId
  ){
     id
   }
 }
`

const removePartnerMutation = gql`
 mutation removePartner(
   $id: ID!,
   $partnerId: ID,
   $projectId: ID,
   $companyId: ID   
   ){
    removePartner(
     id: $id,
     partnerId: $partnerId,
     projectId: $projectId,
     companyId: $companyId
  ){
     id
   }
 }
`

const removeSupplierMutation = gql`
 mutation removeSupplier(
   $id: ID!,
   $supplierId: ID,
   $projectId: ID,
   $agencyId: ID   
   ){
    removeSupplier(
     id: $id,
     supplierId: $supplierId,
     projectId: $projectId,
     agencyId: $agencyId
  ){
     id
   }
 }
`

export {
  addCompanyMutation,
  updateCompanyMutation,
  removeCompany,
  requestSupplierMutation,
  rejectSupplierMutation,
  acceptSupplierMutation,
  requestPartnerMutation,
  rejectPartnerMutation,
  acceptPartnerMutation,
  removePartnerMutation,
  removeSupplierMutation,
  updateEmailTemplatesMutation,
}

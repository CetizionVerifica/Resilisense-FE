import gql from 'graphql-tag'
export default gql`
query company($id: ID!){
  company(id:$id) {
    id
    name
    email
    website
    sector
    type
    serviceProductInfo
    percentageServiceProduct
   country
   lisence
   reseller
   phone
   fax
   personName
   jobPosition
   personEmail
   personPhone
   personExtetion
   personFax
   internalEmailTemplate
   internalReminderEmailTemplate
   externalEmailTemplate
   externalReminderEmailTemplate
   password
   createdBy {
     name
   }
   updatedBy {
     name
   }
   date
   updatedDate

   projects{
    id
    title
    company {
      id
      name
    }
  }

  }
}
`

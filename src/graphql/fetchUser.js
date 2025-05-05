import gql from 'graphql-tag'
export default gql`
{
  user {
    _id
    name
    email
    role
    jobPosition
    phone
    extension
    lang
    active
    date
    serviceProductInfo
    percentageServiceProduct
    country
    lisence
    type
    sector
    website
    termsAndConditions
    currentAgency {
      id
      name
    }
    companies {
      id
    }
    agencies {
      id
      name
      users{
        _id
        name
      }
    }
  }
}

`

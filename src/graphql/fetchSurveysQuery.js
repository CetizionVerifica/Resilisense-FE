import gql from 'graphql-tag'
const fetchSurveys = gql`
query surveys(
  $sort: String,
  $order: String,
  $limit: Int,
  $page: Int,
  $s: String
  ){
  surveys(
  sort: $sort,
  order: $order,
  limit: $limit,
  page: $page,
  s: $s
  ) {
    id
    title
    createdDate
    modifiedDate
    flag
    previewLink
    editUrl
    questions {
      id
      title
      selected
      position
    }
  }
}
`

const selectedSurveys = gql`
{
  selectedSurveys {
    id
    title
    flag
    previewLink
  }
}
`

export {
  fetchSurveys,
  selectedSurveys,
}

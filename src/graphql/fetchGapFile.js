import gql from 'graphql-tag'
export default gql`
query gapFile($id: ID!){
  gapFile(id: $id) {
    id
    name
    path
    keyConsiderations
    criteria {
      name
      value
    }
  }
}
`

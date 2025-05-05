import gql from 'graphql-tag'

const updateFileMutation = gql`
 mutation updateFile(
   $id: ID!,
   $name: String!,
   $value:  Int
  ){
    updateFile(
      id: $id,
      data: {
        name: $name,
        value: $value,        
      }
    ){
      id
      name
      criteria {
        name
        value
      }
   }
 }
`

export {
  updateFileMutation,
}

import gql from "graphql-tag"
const FETCH_POSTS_QUERY = gql`
{
getPosts{
 id
 body
 username
 likeCount
 likes{
username
 }
 comments{
  id
  username
  createdAt
  body
 }
 commentCount
}
}
`
export default FETCH_POSTS_QUERY
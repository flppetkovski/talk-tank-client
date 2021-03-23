import React, {useContext, useState, useRef} from 'react'
import gql from "graphql-tag"
import {useQuery, useMutation} from "@apollo/react-hooks"
import moment  from 'moment'
import LikeButton from '../components/LikeButton'
import {AuthContext} from "../context/auth"
import {Grid, Image, Icon, Card, Button, Label, Form, Popup} from "semantic-ui-react"
import DeleteButton from '../components/DeleteButton'

const SinglePost = (props) => {
 const commentInputRef = useRef(null)
 const [comment, setComment] = useState("")
 const {user} = useContext(AuthContext)
 const postId = props.match.params.postId
const {data: {getPost} = {}} = useQuery(FETCH_POST_QUERY,{
 variables: {
  postId
 }
})

const [submitComment] = useMutation(CREATE_SUBMIT_COMMENT_MUTATION,{
 update(){
setComment("")
commentInputRef.current.blur()
 },
 variables: {
  postId,
  body: comment
 }
})


function deletePostCallback() {
 props.history.push("/")
}
let postMarkup;

if (!getPost) {
 postMarkup = <p>Post loading...</p>
} else {
 const {id, body, createdAt, username, comments, likes, likeCount, commentCount} = getPost
postMarkup = ( 
 <Grid>
 <Grid.Row>
 <Grid.Column width={2}>
<Image src='https://react.semantic-ui.com/images/avatar/large/molly.png' size="small" float="right"/>
</Grid.Column>
<Grid.Column width={10}>
<Card fluid >
<Card.Header>{username}</Card.Header>
<Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>

<Card.Description>{body}</Card.Description>
<hr/>
<Card.Content extra >
<LikeButton user={user} post={{id, likeCount, likes}} />
<Popup
inverted
content="Comment on post"
trigger= {<Button 
as="div"
labelPosition="right"
onClick = {()=> console.log("comment on post") }
> 
<Button basic color="blue"> <Icon name="comments" /> 
 </Button>
<Label basic color ="blue" poining="left">
{commentCount}
</Label>
</Button>}
/>
{user && user.username === username && <DeleteButton postId={id} callback={deletePostCallback} />}
</Card.Content>
</Card>
{user && (
 <Card fluid>
 <Card.Content>
<p>Post a Comment</p>
<Form>
<div className="ui action input fluid">
<input
type="text"
placeholder="Comment.."
name="comment"
value={comment}
  ref={commentInputRef}
onChange={event => setComment(event.target.value)}
/>
<button type="submit"
 color="teal"
  onClick={submitComment}
  disabled={comment.trim()===""}

  >Submit</button>
</div>
</Form>
</Card.Content>
 </Card>
)}
{comments.map(comment => (
 <Card fluid key={comment.id}>
 <Card.Content>
 {user && user.username === comment.username && (
  <DeleteButton  postId={id} commentId={comment.id} />
 )}
 <Card.Header>
 {comment.username}
 </Card.Header>
 <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
<Card.Description>{comment.body}</Card.Description>
 </Card.Content>
 </Card>
))}
</Grid.Column>
 </Grid.Row>
</Grid>)

}
return postMarkup
}

const FETCH_POST_QUERY = gql `
query($postId: ID!){
 getPost(postId: $postId) {
  id body createdAt username likeCount
  likes {
   username
  }
  commentCount
  comments {
   id username createdAt body
  }
 }
}
`
const CREATE_SUBMIT_COMMENT_MUTATION = gql`
mutation ($postId: ID! $body: String!){
 createComment(postId: $postId, body: $body){
  id 
  comments {
   id body username createdAt
  }
  commentCount
 }
}
`

export default SinglePost

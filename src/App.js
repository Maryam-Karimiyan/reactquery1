import "./styles.css";
//*** */2 main things can be done in reactquery:1)react_query which is just getting data from some where(exp:get a list of posts)
                         //2) mutation which is changing some type of data(exp:create a brand new post).

//*** we use useQueryClient to get our QueryClient
import {useQuery,useMutation,useQueryClient} from "@tanstack/react-query"
//
const posts=[
  {id:"1",title:"Post 1"},
  {id:"2", title:"Post 2"}
]
const wait=(duration)=>{
 return new Promise(resolve=>setTimeout(resolve,duration))
}
///
// /posts=>key:["posts"]
// /posts/1=>key:["posts",post.id]
// /posts?authorid=2=>key:["posts",{author.id:"2"}]
// /posts/1/comments=>key:["posts",post.id,"comments"]

///
export default function App() {
 const queryClient=useQueryClient()
  
  //query
 const postQuery= useQuery({
    //a key that uniqely identifies this query
    queryKey:["postsKey"],

    //the thing that is going to run to actually query our data and always accepts a promise
    queryFn:()=>wait(1000).then(()=>[...posts])
  })
  //mutateion
  const newPostMutation=useMutation({
    //matation function returns a promise
    mutationFn:(title)=>
    wait(1000).then(()=>posts.push(
      {id:crypto.randomUUID,title:title})),
     //do what with successful data
     onSuccess:()=>{
       //invalid old posts
        queryClient.invalidateQueries(["postsKey"])
     } 
    })
  if(postQuery.isLoading){
    return <h1>Loading...</h1>
  }
  if(postQuery.isError){
    return <pre>{JSON.stringify(postQuery.error)}</pre>
  }
  return (
    <div className="App">
      {postQuery.data.map(item=>{
        return <p key={item.id}>{item.title}</p>
      })}
      <button
       disabled={newPostMutation.isLoading}
       onClick={()=>newPostMutation.mutate("Hello")}>
         Add new
      </button>
    </div>
  );
}

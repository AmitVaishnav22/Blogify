import React, { useEffect, useState } from "react";
import authService from "../appwrite/auth";
import service from "../appwrite/database";
import { useSelector } from "react-redux";
import { Container,PostCard} from "../components";
import { Query } from "appwrite";

function Drafts(){
    const [posts,setPosts]=useState([])
    const userData = useSelector((state) => state.auth.userData);
    useEffect(()=>{
        const userId = userData?.$id; 
        if(userId){
            service.getInactivePosts([
                Query.equal("userId",userId),
                Query.equal("status","inactive") 
            ]).then((post)=>{
                if (post){
                    //console.log("POST RECIVED")
                    setPosts(post.documents)
                }
            }).catch((error)=>{
                console.log(error)
            })
        }
    },[userData])
    return(
        <>
        <div className='w-full py-8'>
            <Container>
                {posts.length>0 ?(
                <div className='flex flex-wrap'>
                    {posts.map((post)=>(
                        <div key={post.$id} className="p-2 w-1/4">
                            <PostCard {...post}/>
                        </div>
                    ))}
                </div>
                ):(
                    <div className="text-center h-[170px] text-gray-500 py-4">
                        No posts yet
                    </div>
                )}
            </Container>

        </div>
        
        </>
    )
}

export default Drafts;
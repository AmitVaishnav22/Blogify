import React, { useEffect, useState } from "react";
import { PostCard,Container} from "../components";
import service from "../appwrite/database";
import authService from "../appwrite/auth";
import { Query } from "appwrite";

function YourPosts(){  
    const [posts,setPosts]=useState([])
    const [userId,setUserId]=useState(null)
    useEffect(() => {
        authService.getCurrUser().then((currUser) => {
            //console.log("Current User:", currUser);
            if (currUser) {
                setUserId(currUser.$id);
            }
        }).catch((error) => {
            console.error("Error fetching current user:", error);
        });
    }, []);
    useEffect(()=>{
        if (userId){
            //console.log("Fetching posts for userId:", userId);
            service.getPosts([Query.equal("userId",userId)])
            .then((posts)=>{
                if(posts){
                    setPosts(posts.documents)
                }
            })
            .catch((error)=>{
                console.error("Error fetching posts:", error);
            });
        }
    },[userId])
    return (
        <>
            <div className='w-full py-8'>
                <Container>
                    {posts.length > 0 ? (
                        <div className='flex flex-wrap'>
                            {posts.map((post) => (
                                <div key={post.$id} className="p-2 w-1/4">
                                    <PostCard {...post} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center h-[170px] text-gray-500 py-4">
                            No posts yet
                        </div>
                    )}
                </Container>
            </div>
        </>
    );
}    

export default YourPosts;
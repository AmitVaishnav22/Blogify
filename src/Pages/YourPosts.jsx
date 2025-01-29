import React, { useEffect, useState } from "react";
import { PostCard,Container} from "../components";
import service from "../appwrite/database";
import { useSelector } from "react-redux";
import authService from "../appwrite/auth";
import { Query } from "appwrite";

function YourPosts(){  
    const [posts,setPosts]=useState([])
    const userData = useSelector((state) => state.auth.userData);
    useEffect(()=>{
        const userId = userData?.$id;
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
    },[userData])
    return (
        <>
            <div className='w-full py-8'>
                <Container>
                    <h1 className="text-2xl font-bold mb-6 text-purple-400 text-center">
                        Your Posts
                    </h1>
                    <p className="text-lg text-center mb-4 text-gray-400">
                        TotalPosts: <span className="font-semibold text-white">{posts.length}</span>
                    </p>
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
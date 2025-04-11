import React, { useEffect, useState } from "react";
import { Container,PostCard} from "../components";
import service from "../appwrite/database";
import SearchBar from "../components/Search.jsx"
import {  setPosts} from "../../src/store/postSlice.js"
import { useDispatch } from "react-redux";

function AllPosts(){
    const [posts,setPostss]=useState([])
    const dispatch=useDispatch()
    useEffect(()=>{
        service.getPosts().then((posts) => {
            if (posts) {
                //console.log("posts",posts)
                setPostss(posts.documents)
                dispatch(setPosts(posts.documents));
            }
        }).catch((error) => {
            console.error("Error fetching posts:", error);
        });
    },[])
    return (
        <>
        <h1 className="text-xl font-bold mb-6 text-red-800 text-center">
            This is the feed section, containing all the posts that where uploaded by different users across this platform
        </h1>
        <SearchBar/>
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post)=>(
                        <div key={post.$id} className="p-2 w-1/4">
                            <PostCard {...post}/>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    </>
    )
}

export default AllPosts;

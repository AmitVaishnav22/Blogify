import React, { useEffect, useState } from "react";
import { Container,PostCard } from "../components";
import service from "../appwrite/database";

function AllPosts(){
    const [posts,setPosts]=useState([])
    const userId = useSelector((state) => state.auth.userData?.$id)

    useEffect(() => {
        // Ensure `getPosts` is called only when `userId` is defined
        if (userId !== undefined) {
            service.getPosts(userId).then((response) => {
                if (response && response.documents) {
                    setPosts(response.documents);
                }
            }).catch((error) => {
                console.error("Failed to fetch posts:", error);
            });
        }
    }, [userId]);

    return (
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
        
    )
}

export default AllPosts;
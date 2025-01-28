import React, { useEffect, useState } from "react";
import service from "../appwrite/database";
import { useSelector } from "react-redux";
import { Container, PostCard } from "../components";

function LikedPost() {
    const [posts, setPosts] = useState([]);
    const userData = useSelector((state) => state.auth.userData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = userData?.$id; 
        if (userId) {
            setLoading(true);
            service
                .getUserLikedPosts(userId)
                .then((response) => {
                    //console.log("Liked posts:", response[0].title);
                    setPosts(response);
                })
                .catch((error) => {
                    console.error("Error fetching liked posts:", error);
                }) 
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [userData]);
    
    return (
        <div className="w-full py-8">
            <Container>
                {loading ? (
                    <div className="text-center text-gray-500 py-4">Loading liked posts...</div>
                ) : posts.length > 0 ? (
                    <div className="flex flex-wrap">
                        {posts.map((post) => (
                            <div key={post.$id} className="p-2 w-1/4">
                                <PostCard {...post} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center h-[170px] text-gray-500 py-4">
                        No liked posts yet. Explore posts.
                    </div>
                )}
            </Container>
        </div>
    );
}

export default LikedPost;

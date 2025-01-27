import React, { useEffect, useState } from "react";
import service from "../appwrite/database";
import { useSelector } from "react-redux";
import { Container, PostCard } from "../components";

function Bookmarks() {
    const [posts, setPosts] = useState([]);
    const userData = useSelector((state) => state.auth.userData);
    const [userId, setUserId] = useState(userData?.$id);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        if (userId) {
            service
                .getBookmarks(userId)
                .then((bookmarks) => {
                    if (bookmarks.documents.length > 0) {
                        return service.fetchPostsForBookmarks(bookmarks.documents);
                    } else {
                        return [];
                    }
                })
                .then((posts) => {
                    setPosts(posts);
                    //console.log("Posts fetched:", posts);
                })
                .catch((error) => {
                    console.error("Error fetching bookmarks/posts:", error);
                })
                .finally(() => {
                    setLoading(false); 
                });
        }
    }, [userId]);

    return (
        <div className="w-full py-8">
            <Container>
                {loading ? (
                    <div className="text-center text-gray-500 py-4">Loading bookmarks...</div>
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
                        No Bookmarks Yet. Explore Posts.
                    </div>
                )}
            </Container>
        </div>
    );
}

export default Bookmarks;

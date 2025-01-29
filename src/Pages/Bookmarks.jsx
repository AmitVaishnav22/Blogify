import React, { useEffect, useState } from "react";
import service from "../appwrite/database";
import { useSelector } from "react-redux";
import { Container, PostCard } from "../components";

function Bookmarks() {
    const [posts, setPosts] = useState([]);
    const userData = useSelector((state) => state.auth.userData);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const userId = userData?.$id; 
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
    }, [userData]);

    return (
        <div className="w-full py-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-400 text-center">
                Your Bookmarks
            </h1>
            <p className="text-lg text-center mb-4 text-gray-400">
                Total Bookmarks: <span className="font-semibold text-white">{posts.length}</span>
            </p>
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

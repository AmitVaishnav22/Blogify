import React, { useEffect, useState } from "react";
import { Container, PostCard} from "../components";
import service from "../appwrite/database";

function Home() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        service.getPosts()
            .then((posts) => {
                if (posts) {
                    setPosts(posts.documents);  
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);
    return (
        <div className="w-full py-8">
            <Container>
                {
                 posts.length > 0 ? (
                    <div className="flex flex-wrap">
                        {posts.map((post) => (
                            <div key={post.$id} className="p-2 w-1/4 sm:w-1/2 md:w-1/3 lg:w-1/4">
                                <PostCard {...post} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[170px] text-center text-gray-500 py-4 text-xl">
                        Please Login To Read Posts
                    </div>
                )}
            </Container>
        </div>
    );
}

export default Home;

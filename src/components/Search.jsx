import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const [query, setQuery] = useState(""); 
    const postsData = useSelector((state) => state.posts) 
    const navigate = useNavigate();

    const posts = postsData.documents || [];

    //console.log(posts)

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(query.toLowerCase())
    );

    const handleTitleClick = (id) => {
        navigate(`/post/${id}`); 
    };

    return (
        <div className="p-4 l-0 w-full max-w-md mx-auto">
            {/* Search Input */}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full text-white p-2 mb-4 rounded-md bg-black text-purple-400 placeholder-purple-500 border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Real-Time Search Results */}
            {query && (
                <div className="bg-black rounded-md shadow-lg">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <div
                                key={post.id}
                                className="p-2 border-b border-purple-700 text-purple-400 hover:bg-purple-800 hover:text-white cursor-pointer"
                                onClick={() => handleTitleClick(post.$id)} // Navigate on click
                            >
                                {post.title}
                            </div>
                        ))
                    ) : (
                        <p className="p-2 text-purple-500">No posts found</p>
                    )}
                </div>
            )}
        </div>

    );
};

export default SearchBar;


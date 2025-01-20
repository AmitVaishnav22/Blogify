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
        <div>
            {/* Search Input */}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Search posts..."
                style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
            />

            {/* Real-Time Search Results */}
            {query && (
                <div>
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <div
                                key={post.id}
                                style={{
                                    padding: "8px",
                                    borderBottom: "1px solid #ddd",
                                    cursor: "pointer",
                                    
                                }}
                                className="text-white"
                                onClick={() => handleTitleClick(post.$id)} // Navigate on click
                            >
                                {post.title}
                            </div>
                        ))
                    ) : (
                        <p className="text-white ">No posts found</p>
                    )}
                </div>
            )}

        </div>
    );
};

export default SearchBar;


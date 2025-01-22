import React, { useEffect, useState } from "react";
import service from "../appwrite/database";
import { Link,useNavigate,useParams } from "react-router-dom";
import { Button,Container } from "../components";
import parse from "html-react-parser"
import { useSelector } from "react-redux";
import Alert from "../components/Alert";
import { useDispatch } from "react-redux";
import { removePost } from "../store/postSlice.js";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaCommentDots } from "react-icons/fa";


export default function Post() {
    const [post, setPost] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);
    //console.log(userData.name);
    //console.log(userName);
    const [isAuthor,setIsAuthor]=useState(false)
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");


    useEffect(() => {
        if (slug) {
            service.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    useEffect(() => {
        if (post && userData) {
            setIsAuthor(post.userId === userData.$id);
        } else {
            setIsAuthor(false); 
        }
    }, [post, userData]);

    const handleDeleteClick = () => {
        setShowAlert(true);
    };

    const confirmDelete = async () => {
        setShowAlert(false);
        try {
            const status = await service.deletePost(post.$id);
            if (status) {
                await service.deleteFile(post.featuredImg);
                dispatch(removePost(post.$id));
                navigate("/");
            }
        } catch (error) {
            console.error("Error during delete operation:", error);
        }
    };

    const cancelDelete = () => {
        setShowAlert(false);
    };


    const handleToggleLike=async()=>{
        try {
            setLoading(true)
            const updatedPost= await service.toggleLike(post.$id,userData.$id)
            setPost(updatedPost)

        } catch (error) {
            console.log("In like toggle",error)
        }
        finally{
            setLoading(false)
        }
    }
    const handleAddComment=async()=>{
        try {
            setLoading(true)
            const updatedPost= await service.createComment(post.$id,userData.$id,newComment,userData.name)
            setPost(updatedPost)
            setNewComment("")
        } catch (error) {
            console.log("In add comment",error)
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        if (post && Array.isArray(post.comments)) {
            setComments(post.comments); 
        } else {
            setComments([]); // Fallback to an empty array if comments are undefined
        }
    }, [post]);

    const handleDeleteComment = async (postId, commentId) => {
        try {

            await service.deleteComment(postId, userData.$id, commentId);
    
            setComments((prevComments) => {
                const updatedComments = prevComments.filter((commentString) => {
                    const parsedComment = JSON.parse(commentString);
                    return parsedComment.$id !== commentId;
                });
    
                setPost((prevPost) => ({
                    ...prevPost,
                    comments: updatedComments,
                }));
    
                return updatedComments; 
            });
    
            alert("Comment deleted successfully!");
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("Failed to delete comment.");
        }
    };
    

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                
                    <img
                        src={service.getFilePreview(post.featuredImg)}
                        alt={post.title}
                        className="rounded-xl"
                    />
                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="mr-3">Edit</Button>
                            </Link>
                            <Button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={handleDeleteClick}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl text-white font-bold">{post.title}</h1>
                </div>
                <div className="browser-css text-white">
                    {parse(post.content)}
                    <br/>
                    <span className="font-semibold text-gray-400 inline-block w-full text-right">
                        last updated on : {new Date(post.$updatedAt).toLocaleString()}
                    </span>
                    <br/>
                    <span className="font-semibold text-gray-400 inline-block w-full text-right">
                        uploaded on : {new Date(post.$createdAt).toLocaleString()}
                    </span>
                </div>
            {/* Like and Comments Section */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleToggleLike}
                        className="flex items-center text-purple-400 hover:text-purple-600"
                        disabled={loading}
                    >
                            <AiOutlineLike size={24} />
                        <span className="ml-2">{post.likes || 0} Likes</span>
                    </button>

                    <div className="flex items-center text-gray-400">
                        <FaCommentDots size={24} />
                        <span className="ml-2">{post.comments?.length || 0} Comments</span>
                    </div>
                </div>
            </div>
            <div className="mt-6">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full p-2 rounded bg-gray-800 text-gray-300"
                    />
                    <button
                        onClick={handleAddComment}
                        className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
                        disabled={loading}
                    >
                        Add Comment
                    </button> 
                </div>
            {/* Comments List */}
            <div className="space-y-4 mt-6">
                {comments.length > 0 ? (
                    comments.map((commentString, index) => {
                        const parsedComment = JSON.parse(commentString); 

                        return (
                            <div key={index} className="p-2 rounded bg-gray-800 relative">
                                <p className="text-gray-300">{parsedComment.content}</p>
                                <small className="text-gray-500">By {parsedComment.userName}</small>

                                {/* Delete Button for the Comment Owner */}
                                {parsedComment.userId === userData.$id && (
                                    <button
                                        onClick={() => handleDeleteComment(post.$id, parsedComment.id)}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        title="Delete Comment"
                                    >
                                        ✖
                                    </button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500">No comments yet.</p>
                )}
            </div>


            
            

            </Container>
            {showAlert && (
                <Alert
                    message={`Do you really want to delete this post?`}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    ) : null;
}



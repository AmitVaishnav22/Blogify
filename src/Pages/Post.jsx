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
    //console.log(userData);
    //console.log(userName);
    const [isAuthor,setIsAuthor]=useState(false)
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isBookmarked, setIsBookmarked] = useState(false);


    useEffect(() => {
        if (slug) {
            service.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    // console.log(service.getCurrUser())

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
                navigate("/all-posts");
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
                    return parsedComment.id !== commentId;
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

    // console.log(post)
    // console.log(post?.userId)

    const handleToggleBookmark = async (userId,postId) => {
        setLoading(true);
        try {
            // console.log(userId,postId)
            const action = await service.toggleBookmark(userId, postId);
            setIsBookmarked(action === 'added');
            alert(`Bookmark ${action === 'added' ? 'added!' : 'removed!'}`); // Alert the user after each toggle
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick =()=>{
        navigate(`/user-info/${post?.userId}`)
    } 

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [words, setWords] = useState([]);
    const [isInAudio, setIsInAudio] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [speechRate, setSpeechRate] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);



    const stripHtmlTags = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    const speakContent = () => {
        const plainText = stripHtmlTags(post?.content || '');
        const wordArray = plainText.split(/\s+/);
        setWords(wordArray);
        setCurrentWordIndex(0);
        speakContentFromIndex(0, speechRate, wordArray);
    };

    const speakContentFromIndex = (startIndex, rate, wordArray) => {
        const synth = window.speechSynthesis;
        synth.cancel();  
      
        const textToSpeak = wordArray.slice(startIndex).join(' ');
        if (!textToSpeak) return;
      
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-US';
        utterance.pitch = 1;
        utterance.rate = rate;
      
        utterance.onboundary = (event) => {
          const spokenUntil = textToSpeak.slice(0, event.charIndex);
          const spokenWords = spokenUntil.trim().split(/\s+/);
          const index = startIndex + (spokenWords.length - 1);
          setCurrentWordIndex(index);
        };
      
        utterance.onend = () => {
          setIsSpeaking(false);
          setIsPaused(false);
          setIsInAudio(false);
          setWords([])
          setCurrentWordIndex(null);
        };
      
        synth.speak(utterance);
        setIsSpeaking(true);
        setIsInAudio(true);
      };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setCurrentWordIndex(null);
        setWords([]);
        setCurrentWordIndex(null);
        setIsInAudio(false);
        setIsPaused(false);
        
    };
    const handlePauseResume = () => {
        const synth = window.speechSynthesis;
        if (isPaused) {
            synth.resume();
            setIsPaused(false);
        } else {
            synth.pause();
            setIsPaused(true);
        }
    };
    const handleSpeedChange = (rate) => {
        const synth = window.speechSynthesis;
        synth.cancel();
        setIsSpeaking(false);
        setIsPaused(false);

        setSpeechRate(rate);
        if (words.length > 0 && currentWordIndex !== null) {
            speakContentFromIndex(currentWordIndex, rate, words);
          }
        };

    const handleUserInfo = (userId) => {
        if (userId){
            navigate(`/user-info/${userId}`);
        }
    }
    
    
    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                <div className="absolute left-6 top-6">
                    <button
                        onClick={() => handleToggleBookmark(userData.$id,post.$id)}
                        className="bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 focus:outline-none"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-6 h-6"
                        >
                            <path d="M5 3v18l7-5 7 5V3z" />
                        </svg>
                    </button>
                </div>
                
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
                <div className="flex justify-end mb-4">
                    <button
                        onClick={isSpeaking ? stopSpeaking : speakContent}
                        className={`px-4 py-1 ${
                        isSpeaking ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-700 hover:bg-purple-800'
                        } text-white rounded-l shadow transition`}
                    >
                        {isSpeaking ? '🛑 Stop' : '🎧 Listen to Content'}
                    </button>
                    {isSpeaking && (
                    <>
                        <button
                        onClick={handlePauseResume}
                        className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white  shadow transition"
                        >
                        {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                        </button>

                        {/* Speed Control Dropdown */}
                        <div className="relative w-25">
                        <button
                            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                            className="px-3 py-1  h-9 bg-gray-300 hover:bg-gray-400 text-black rounded-r shadow transition text-sm"
                        >
                            ⚙️ {speechRate}x
                        </button>

                        {showSpeedMenu && (
                            <div className="absolute right-0 mt-1 bg-white border rounded shadow z-10">
                            {[0.5, 1, 1.5, 2].map((rate) => (
                                <button
                                key={rate}
                                onClick={() => {
                                    handleSpeedChange(rate);
                                    setShowSpeedMenu(false);
                                }}
                                className={`block w-full px-4 py-2 text-left text-sm ${
                                    speechRate === rate
                                    ? 'bg-purple-800 text-white'
                                    : 'text-gray-800 hover:bg-gray-100'
                                }`}
                                >
                                {rate}x
                                </button>
                            ))}
                            </div>
                        )}
                        </div>
                    </>
                    )}
                
                </div>
                <div className="browser-css text-white leading-relaxed tracking-wide text-lg">
                    {words.map((word, index) => (
                        <span
                        key={index}
                        className={`transition-all duration-150 ${
                            index === currentWordIndex
                            ? 'bg-yellow-500 text-black rounded px-1'
                            : ''
                        }`}
                        onClick={() => {
                            if (isSpeaking || isPaused) {
                              window.speechSynthesis.cancel();
                              setIsSpeaking(false);
                              setIsPaused(false);
                            }
                            speakContentFromIndex(index, speechRate, words);
                          }}
                        >
                        {word}{' '}
                        </span>
                    ))}
                    </div>
                <div className="browser-css text-white">
                    {!isInAudio ? parse(post.content) : "" }
                    <span className="font-semibold text-gray-400 inline-block w-full text-right">
                        uploaded on : {new Date(post.$createdAt).toLocaleString()}
                    </span>
                    <span
                        className="font-semibold text-purple-400 inline-block w-full text-right cursor-pointer hover:underline"
                        onClick={handleUserClick}
                    >
                        uploaded By : {post.userName}
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
                        //console.log(parsedComment)
                        return (
                            <div key={index} className="p-2 rounded bg-gray-800 relative">
                                <p className="text-gray-300">{parsedComment.content}</p>
                                <small className="text-sm font-semibold text-purple-300 cursor-pointer hover:underline hover:text-purple-400 transition duration-200" onClick={()=>{handleUserInfo(parsedComment.userId)}}>By {parsedComment.userName}</small>
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



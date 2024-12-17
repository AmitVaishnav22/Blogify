import React, { useEffect, useState } from "react";
import service from "../appwrite/database";
import { Link,useNavigate,useParams } from "react-router-dom";
import { Button,Container } from "../components";
import parse from "html-react-parser"
import { useSelector } from "react-redux";
import Alert from "../components/Alert";

// export default function Post() {
//     const [post, setPost] = useState(null);
//     const [showAlert,setShowAlert]=useState(false)
//     const { slug } = useParams();
//     const navigate = useNavigate();
//     const userData = useSelector((state) => state.auth.userData);

//     const isAuthor = post && userData ? post.userId === userData.$id : false;

//     useEffect(() => {
//         if (slug) {
//             service.getPost(slug).then((post) => {
//                 if (post) setPost(post);
//                 else navigate("/");
//             });
//         } else navigate("/");
//     }, [slug, navigate]);


//     const handleDeleteClick = () => {
//         setShowAlert(true);  
//     };
//     const confirmDelete = () => {
//         setShowAlert(false);
//         const status=await service.deletePost(post.$id)
//             if (status) {
//                 service.deleteFile(post.featuredImg);
//                 navigate("/");
//             }
//         };
//     };
//     const cancelDelete = () => {
//         setShowAlert(false);  
//     };


//     return post ? (
//         <div className="py-8">
//             <Container>
//                 <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
//                     <img
//                         src={service.getFilePreview(post.featuredImg)}
//                         alt={post.title}
//                         className="rounded-xl"
//                     />

//                     {isAuthor && (
//                         <div className="absolute right-6 top-6">
//                             <Link to={`/edit-post/${post.$id}`}>
//                                 <Button bgColor="bg-green-500" className="mr-3">
//                                     Edit
//                                 </Button>
//                             </Link>
//                             <Button  className="bg-red-500 text-white px-4 py-2 rounded-lg"   onClick={handleDeleteClick}>
//                                 Delete
//                             </Button>
//                         </div>
//                     )}
                    
//                 </div>
//                 <div className="w-full mb-6">
//                     <h1 className="text-2xl text-white font-bold">{post.title}</h1>
//                 </div>
//                 <div className="browser-css text-white">
//                     {parse(post.content)}
//                 </div>
//             </Container>
//             {showAlert && (
//                 <Alert
//                     message={`Do you really want to delete this post?`}
//                     onConfirm={confirmDelete}
//                     onCancel={cancelDelete}
//                 />
//             )}
//         </div>
//     ) : null;

export default function Post() {
    const [post, setPost] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [isAuthor,setIsAuthor]=useState(false)

   // const isAuthor = post && userData ? post.userId === userData.$id : false;

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
                navigate("/");
            }
        } catch (error) {
            console.error("Error during delete operation:", error);
        }
    };

    const cancelDelete = () => {
        setShowAlert(false);
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
                        LastUpdated: {new Date(post.$updatedAt).toLocaleString()}
                    </span>
                    <br/>
                    <span className="font-semibold text-gray-400 inline-block w-full text-right">
                        Created At: {new Date(post.$createdAt).toLocaleString()}
                    </span>
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


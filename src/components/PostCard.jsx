import React, { useEffect, useState } from "react";
import service from "../appwrite/database";
import { Link } from "react-router-dom";
import authService from "../appwrite/auth";
import { FaCommentDots } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";

function PostCard({ $id, title, featuredImg ,userId,likes,comments}) {
  const [user,setUser]=useState(null)
  
  useEffect(()=>{
    authService.getCurrUser().then((user)=>{
      if(user){
        setUser(user.$id)
      }
    })
    .catch((error)=>{
      console.log(error)
    })
  })

  // useEffect(()=>{
  //   service.getUserDocs(userId).then((user)=>{
  //     if(user){
  //       setauthor(user.name)
  //     }
  //   })
  // },[userId])
  const isUserPost=userId===user
  return (
    <>
    <Link to={`/post/${$id}`}>
      <div className={`${isUserPost ? 'w-full max-w-[300px] h-[250px] bg-black rounded-xl p-4 flex flex-col justify-between border-2 border-transparent hover:border-blue-500 hover:outline hover:outline-2 hover:outline-purple-500 transition-all duration-300'
      :'w-full max-w-[300px] h-[250px] bg-black rounded-xl p-4 flex flex-col justify-between border-2 border-transparent hover:border-purple-500 hover:outline hover:outline-2 hover:outline-purple-500 transition-all duration-300'}`}>
        <div className='w-full h-[200px] flex justify-center items-center mb-4'>
          <img
            src={service.getFilePreview(featuredImg)}
            alt={title}
            className='w-full h-full object-cover  rounded-xl'
          />
        </div>
      </div>
    </Link>
    <h2 className='text-xl font-bold text-white text-center line-clamp-2'>{title}</h2>
    <div className="flex items-center justify-center space-x-4">
      <h2 className="text-l font-bold text-purple-800 flex items-center">
          {likes} <AiFillLike size={14} className="ml-1" />
      </h2>
      <h2 className="text-l font-bold text-purple-800 flex items-center">
        {comments.length} <FaCommentDots size={14} className="ml-1" />
      </h2>
    </div>

    </>
  );
}

export default PostCard;




{/* {isUpdated?(
        <>
        <span className="font-semibold">updated :</span>
        <span  className="font-semibold">{formatDistanceToNow(updatedDate,{addSuffix:true})}</span>
        </>

      ):(
        <>
        <span className="font-semibold">uploaded on :</span>
        <span  className="font-semibold">{formatDistanceToNow(createdDate,{addSuffix:true})}</span>
        </>
      )} */}


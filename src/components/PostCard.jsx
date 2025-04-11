import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import service from "../appwrite/database";
import { Link } from "react-router-dom";
import authService from "../appwrite/auth";
import { FaCommentDots } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";

function PostCard({ $id, title, featuredImg ,userId,likes,comments,userName}) {
  const [user,setUser]=useState(null)
  const navigate = useNavigate();
  
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
  const handleUserClick=()=>{
    navigate(`/user-info/${userId}`)
  }
  const isUserPost=userId===user
  return (
    <>
    <Link to={`/post/${$id}`} className="w-full max-w-[300px]">
        <div
          className={`h-[250px] bg-black rounded-xl p-4 flex flex-col justify-between border-2 border-transparent transition-all duration-300 
            ${isUserPost 
              ? 'hover:border-blue-500 hover:outline hover:outline-2 hover:outline-purple-500' 
              : 'hover:border-purple-500 hover:outline hover:outline-2 hover:outline-purple-500'}`}
        >
          <div className="w-full h-[200px] flex justify-center items-center mb-4">
            <img
              src={service.getFilePreview(featuredImg)}
              alt={title}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </Link>

      {/* Post Title */}
      <h2 className="text-lg sm:text-xl font-bold text-white text-center mt-2 line-clamp-2">
        {title}
      </h2>

      {/* Likes & Comments */}
      <div className="flex items-center justify-center gap-6 mt-2">
        <h2 className="text-sm font-bold text-purple-500 flex items-center">
          {likes} <AiFillLike size={16} className="ml-1" />
        </h2>
        <h2 className="text-sm font-bold text-purple-500 flex items-center">
          {comments.length} <FaCommentDots size={16} className="ml-1" />
        </h2>
      </div>
      <div className="flex justify-between l-9 items-center px-2">
        <p
          className="text-sm font-semibold text-purple-300 cursor-pointer hover:underline hover:text-purple-400 transition duration-200"
          onClick={handleUserClick}
        >
          author: {userName}
        </p>

        <div className="relative group">
          <button className="text-purple-300 text-xs font-bold border border-purple-300 rounded-full w-5 h-5 flex items-center justify-center hover:bg-purple-400 hover:text-black transition duration-200">
            i
          </button>

          {/* Tooltip */}
          <div className="absolute bottom-full right-4 mb-2 w-[220px] text-right bg-black text-white text-[10px] sm:text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition duration-200 z-10">
            SOME USER DOES NOT EXIST. PLEASE VALIDATE
          </div>
        </div>
      </div>
    </>
  );
}

export default PostCard;


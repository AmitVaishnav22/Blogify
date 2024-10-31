import React from "react";
import service from "../appwrite/database";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImg }) {
  return (
    <>
    <Link to={`/post/${$id}`}>
      <div className='w-full max-w-[300px] h-[250px] bg-black rounded-xl p-4 flex flex-col justify-between border-2 border-transparent hover:border-purple-500 hover:outline hover:outline-2 hover:outline-purple-500 transition-all duration-300'>
        <div className='w-full h-[200px] flex justify-center items-center mb-4'>
          <img
            src={service.getFilePreview(featuredImg)}
            alt={title}
            className='w-full h-full object-cover  rounded-xl'
          />
        </div>
        {/* <h2 className='text-xl font-bold text-white text-center line-clamp-2'>{title}</h2> */}
      </div>
    </Link>
    <h2 className='text-xl font-bold text-white text-center line-clamp-2'>{title}</h2>
    </>
  );
}

export default PostCard;

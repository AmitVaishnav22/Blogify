import React, { useEffect, useState } from "react";
import { Container,PostForm } from "../components";
import service from "../appwrite/database";
import { useNavigate,useParams } from "react-router-dom";

function EditPost(){
    const [posts,setPosts]=useState(null)
    const {slug}=useParams()
    const navigate=useNavigate()
    //console.log("edit")
    useEffect(()=>{
        if(slug){
            service.getPost(slug).then((post)=>{
                if(post){
                    setPosts(post)
                }
            })
        }else{   
            navigate("/") 
        }
    },[slug,navigate])
    return posts?(
        <div className="py-8">
            <Container>
                <PostForm post={posts}/>
            </Container>
        </div>
    ):null
}
export default EditPost;
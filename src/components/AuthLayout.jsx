import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";

function Protected({children,authentication=true}){
    const navigate=useNavigate()
    const [loader,setLoader]=useState(true)
    const authStatus=useSelector(state=>state.auth?.status || false)

    useEffect(()=>{
        if (authentication && authStatus!==authentication){
            navigate("/login")
        } else if(!authentication && authStatus!==authentication){
            navigate("/")
        }
        setLoader(false)
    },[authentication,authStatus,navigate])
    return loader?<h1>Loading...</h1>:<>{children}</>
}
export default Protected;
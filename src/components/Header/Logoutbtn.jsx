import React from "react";
import {useDispatch} from "react-redux"
import authService from "../../appwrite/auth"
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import {setPosts} from "../../store/postSlice.js"
function Logoutbtn(){
    const dispatch=useDispatch();
    const navigate=useNavigate(); 
    const logoutHandler=()=>{
        authService.logout().then(()=>{
            dispatch(logout())
            dispatch(setPosts([]));
            localStorage.clear()
            navigate("/login")
        })
    }
    return(
        //className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
        <button className="relative inline-block px-6 py-2 text-white bg-black border-2 border-transparent rounded-full hover:text-black hover:bg-gradient-to-r hover:from-purple-500 hover:to-red-500 transition-all duration-300" onClick={logoutHandler}>
            Logout
            <span className="absolute inset-0 rounded-full border-2 border-red-500 group-hover:border-pink-500 transition-all duration-300"></span>    
        </button>
        
    )
}

export default Logoutbtn;
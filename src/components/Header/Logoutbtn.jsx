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
        <button  onClick={logoutHandler}>
            Logout   
        </button>
        
    )
}

export default Logoutbtn;
import React, { useState } from "react";
import {Link,useNavigate} from "react-router-dom"
import {login as authLogin} from "../store/authSlice"
import {Button,Input,Logo} from "./index"
import { useDispatch} from "react-redux"
import authService from "../appwrite/auth"
import {useForm} from "react-hook-form"

function Login(){
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const {register,handleSubmit}=useForm()
    const [error,setError]=useState("")

    const login = async(data) => {
        setError("")
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrUser()
                if(userData){
                    dispatch(authLogin({userData}));
                    
                } 
                navigate("/")
                
            }
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <div className='flex items-center justify-center h-screen w-full bg-black'>
            <div className="mx-auto w-full max-w-lg bg-black/80 rounded-xl p-8 shadow-lg border border-gray-700">
            <div className="mb-4 flex justify-center">
                        <span className="inline-block w-full max-w-[100px]">
                            <Logo width="100%" />
                        </span>
            </div>
            <h2 className="text-center text-2xl font-bold leading-tight text-white">Sign in to your account</h2>
            <p className="mt-2 text-center text-base text-gray-300">
                        Don&apos;t have any account?&nbsp;
                        <Link
                            to="/signup"
                            className="font-medium text-purple-500 transition-all duration-200 hover:underline"
                        >
                            Sign Up
                        </Link>
            </p>
            {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit(login)} className='mt-8'>
                <div className='space-y-5'>
                    <Input
                    label="Email: "
                    placeholder="Enter your email"
                    type="email"
                    {...register("email", {
                        required: true,
                        validate: {
                            matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                            "Email address must be a valid address",
                        }
                    })}
                    />
                    <Input
                    label="Password: "
                    type="password"
                    placeholder="Enter your password"
                    {...register("password", {
                        required: true,
                    })}
                    />
                    <Button
                    type="submit"
                    className="relative inline-block w-full px-6 py-2 text-white bg-purple-500 border-2 border-transparent rounded-full hover:text-black hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                    >Sign in</Button>
                </div>
            </form>
            </div>
        </div>
      )
    }
    
    export default Login
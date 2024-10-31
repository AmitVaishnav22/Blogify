import React, { useState } from "react";
import authService from "../appwrite/auth";
import { Link,useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login} from "../store/authSlice";
import {Button,Logo,Input} from "./index.js"
import { useDispatch } from "react-redux";

function Signup(){
    const navigate=useNavigate();
    const [error,setError]=useState("");
    const dispatch=useDispatch();
    const {register,handleSubmit}=useForm();

    const create=async(data)=>{
        setError("")
        try {
            const userData=await authService.createAccount(data)
            if (userData){
                const userData=await authService.getCurrUser()
                if (userData){
                    dispatch(authLogin({userData}))
                }
                navigate("/")
            }
        } catch (e) {
            setError(e.message)
        }
    }
    return (
        <>
            <div className="flex items-center justify-center h-screen w-full bg-black">
                <div className="mx-auto w-full max-w-lg bg-black/80 rounded-xl p-8 shadow-lg border border-gray-700">
                    <div className="mb-4 flex justify-center">
                        <span className="inline-block w-full max-w-[100px]">
                            <Logo width="100%" />
                        </span>
                    </div>
    
                    <h2 className="text-center text-2xl font-bold leading-tight text-white">Sign up to create account</h2>
                    <p className="mt-2 text-center text-base text-gray-300">
                        Already have an account?
                        <Link
                                to="/login"
                                className="font-medium text-purple-500 transition-all duration-200 hover:underline"
                            >
                                Sign In
                            </Link>
                    </p>
    
                    {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
    
                    <form onSubmit={handleSubmit(create)} className="mt-6">
                        <div className="space-y-5">
                            <Input
                                label="Full name: "
                                placeholder="Enter Your Full Name"
                                {...register("name", {
                                    required: true,
                                })}
                            />
                            <Input
                                label="Email Address: "
                                placeholder="Enter Your Email Address"
                                type="email"
                                {...register("email", {
                                    required: true,
                                    validate: {
                                        matchPattern: (value) =>
                                            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                            "Please Enter A Valid Email Address",
                                    },
                                })}
                            />
                            <Input
                                label="Password: "
                                placeholder="Enter Your Password"
                                type="password"
                                {...register("password", {
                                    required: true,
                                })}
                            />
                            <Button type="submit" className="relative inline-block w-full px-6 py-2 text-white bg-purple-500 border-2 border-transparent rounded-full hover:text-black hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300">
                                Create Account
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );    
}

export default Signup;
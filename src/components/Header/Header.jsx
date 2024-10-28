import React from "react";
import {Container,Logo,Logoutbtn} from "../index";
import { Link} from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


function Header(){
    const authStatus=useSelector((state)=>state.auth?.status || false)
    const navigate=useNavigate()
    const navItem=[
        {
            name: 'Home',
            slug: "/",
            active: true
        }, 
        {
            name: "Login",
            slug: "/login",
            active: !authStatus,
        },
        {
            name: "Signup",
            slug: "/signup",
            active: !authStatus,
        },
        {
            name: "All Posts",
            slug: "/all-posts",
            active: authStatus,
        },
        {
            name: "Add Post",
            slug: "/add-post",
            active: authStatus,
        },
    ]
    return(
        <header className="top-0 z-50">
            <Container>
                <nav className='flex'>
                <div className='mr-4'>
                    <Link to='/'>
                    <Logo width='70px'   />
                    </Link>
                </div>

                <ul className='flex ml-auto'>
                    {navItem.map((item) =>item.active ? (
                        <li key={item.name}>
                            <button onClick={()=>navigate(item.slug)}  
                                className="relative inline-block px-6 py-2 text-white bg-black border-2 border-transparent rounded-full hover:text-black hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300">
                                {item.name}
                                <span className="absolute inset-0 rounded-full border-2 border-purple-500 group-hover:border-pink-500 transition-all duration-300"></span>
                            </button>
                        </li>
                    ) : null
                )}
                {authStatus && (
                    <li>
                        <Logoutbtn />
                    </li>
                )}
            </ul>
            </nav>
            </Container>
        </header>
    )
}

export default Header;
import { useState,useEffect } from 'react'
import {useDispatch} from 'react-redux'
import './App.css'
import authService from './appwrite/auth'
import { login, logout } from './store/authSlice'
import {Outlet} from 'react-router-dom'
import { Footer, Header } from './components'
function App() {
  //console.log(import.meta.env.VITE_APPWRITE_URL)
  const [loading,setLoading]=useState(true)
  const dispatch=useDispatch()

  useEffect(()=>{
    authService.getCurrUser()
    .then((userData)=>{
      if (userData){
        dispatch(login({userData}))
      }
      else{
        dispatch(logout())
      }
    })
    .finally(()=>setLoading(false))
  },[])
  

  return !loading ? (
    <div className='min-h-screen flex flex-col content-between bg-black'>
      <div className='w-full'>
        <Header />
        <main className='text-center flex-grow'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : null
}

export default App




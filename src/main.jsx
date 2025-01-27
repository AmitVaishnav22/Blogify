import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider} from 'react-redux'
import store from './store/store.js'
import { Login,Protected, YourPosts } from './components/index.js'
import AddPost from "./Pages/AddPost.jsx"
import SignUp from "./Pages/SignUp.jsx"
import Post from './Pages/Post.jsx'
import Home from './Pages/Home.jsx'
import AllPosts from './Pages/AllPosts.jsx'
import EditPost from './Pages/EditPost.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Drafts from './Pages/Drafts.jsx'
import ChatComponent from './components/BlogAI/BlogAI.jsx'
import Bookmarks from './Pages/Bookmarks.jsx'

const router=createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/login",
        element:(
          <Protected authentication={false}>
            <Login/>
          </Protected>
        ),
      },
      {
        path:"/signup",
        element:(
          <Protected authentication={false}>
            <SignUp/>
          </Protected>
        ),
      },
      {
        path:"/all-posts",
        element:(
          <Protected authentication={true}>
            {" "}
            <AllPosts/>
          </Protected>
        ),
      },
      {
        path:"/your-posts",
        element:(
          <Protected authentication={true}>
            {" "}
            <YourPosts/>
          </Protected>
        ),
      },
      {
        path:"drafts",
        element:(
          <Protected authentication={true}>
            {""}
            <Drafts/>
          </Protected>
        ),
      },
      {
        path:"/add-post",
        element:(
          <Protected authentication={true}>
            {" "}
            <AddPost/>
          </Protected>
        ),
      },
      {
        path:"/edit-post/:slug",
        element:(
          <Protected authentication={true}>
            {" "}
            <EditPost/>
          </Protected>
        ),
      },
      {
        path:"/post/:slug",
        element:<Post/>
      },
      {
        path:'/blogAI',
        element:<ChatComponent/>
      },
      {
        path:'/bookmarks',
        element:<Bookmarks/>
      }
    ]

  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)

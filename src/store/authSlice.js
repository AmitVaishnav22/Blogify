// import { createSlice ,createAsyncThunk} from "@reduxjs/toolkit";
// import authService from "../appwrite/auth";

// const initialState={
//     status:false,
//     userData:null,
// }

// const authSlice=createSlice({
//     name:"auth",
//     initialState,
//     reducers:{
//         login:(state,action)=>{
//             state.status=true
//             state.userData=action.payload.userData
//         },
//         updateProfile: (state, action) => {
//             if (state.userData) {
//                 state.userData.bio = action.payload.bio || state.userData.bio;
//                 state.userData.profilePic = action.payload.profilePic || state.userData.profilePic;
//             }
//         },

//         logout:(state)=>{
//             state.status=false
//             state.userData=null
//         },
    
//     },
// })
// export const {login,logout,updateProfile}=authSlice.actions;

// export default authSlice.reducer;   


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: !!JSON.parse(localStorage.getItem("userData")),
    userData: JSON.parse(localStorage.getItem("userData")) || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = {
                ...action.payload.userData,
                bio: action.payload.userData.bio || "",
                userprofile: action.payload.userData.userprofile || ""
            };
            localStorage.setItem("userData", JSON.stringify(state.userData)); 
        },
        updateProfile: (state, action) => {
            if (state.userData) {
                state.userData = { ...state.userData, ...action.payload.userData };
                localStorage.setItem("userData", JSON.stringify(state.userData)); 
            }
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            localStorage.removeItem("userData"); 
        }
    }
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;


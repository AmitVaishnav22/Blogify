import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../Loader";
import service from "../../appwrite/database.js"
import Logoutbtn from "./Logoutbtn";
export default function MoreOptions() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { userData, loading } = useSelector((state) => state.auth);
  const menuRef = useRef(null);

  const options = [
    { name: "Your Posts", slug: "/your-posts" },
    { name: "Drafts", slug: "/drafts" },
    { name: "Bookmarks", slug: "/bookmarks" },
    { name: "Liked Posts", slug: "/liked-posts" },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleProfileClick = () => {
    if (userData?.$id) {
      navigate(`/users-info/${userData.$id}`);
    }
  };

  return (
    <div className="relative z-10" ref={menuRef}>
      <button onClick={() => setShowMenu(!showMenu)}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/10070/10070891.png"
          alt="More Options"
          className="h-10 cursor-pointer"
        />
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-[40vw] h-[80vh] bg-black text-white shadow-lg rounded-lg border border-purple-500 shadow-purple-500/50 p-4 overflow-y-auto">
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="text-center mb-4 border-b border-gray-600 pb-4">
                  <div className="w-24 h-24 mx-auto mb-2">
                      <img 
                          src={userData?.userprofile ? service.getFilePreview(userData.userprofile) : "default-profile.png"} 
                          alt={userData?.name} 
                          className="w-full h-full rounded-full object-cover border-4 border-purple-600" 
                      />
                  </div>
                  <h1 className="text-xl font-semibold text-purple-400">
                      Hi, {userData?.name || "User"}
                  </h1>
              </div>
              {/* View Full Profile Button */}
              <button
                onClick={handleProfileClick}
                className="w-full h-50 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition duration-300 mb-4"
              >
                View Full Profile
              </button>

              <h2 className="text-lg font-semibold mb-2 text-purple-300">
                Your Activities
              </h2>
              <ul className="space-y-2">
                {options.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="block w-full text-left px-6 py-3 text-lg font-medium hover:bg-purple-600 rounded-lg transition duration-300"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
              <button className="w-full text-center px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg transition duration-300">
                <Logoutbtn />
              </button>        
            </>
          )}
        </div>
      )}
    </div>
  );
}

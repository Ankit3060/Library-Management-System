import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import SideBar from "../layout/SideBar.jsx";
import UserDashboard from "../components/UserDashboard.jsx";
import AdminDashboard from "../components/AdminDashboard.jsx"
import BookManagement from "../components/BookManagement.jsx"
import Catalog from "../components/Catalog.jsx"
import MyBorrowedBooks from "../components/MyBorrowedBooks.jsx"
import Users from "../components/Users.jsx"

const Home = () => {
  const [isSideideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("");

  const {user, isAuthenticated} = useSelector(state=>state.auth);
    if(!isAuthenticated){
      return <Navigate to={"/login"} />
    }
  return (
    <>
      <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
        <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 
                        flex justify-center items-center bg-black rounded-md 
                        h-9 w-9 text-white">
          <GiHamburgerMenu 
            className="text-2xl" 
            onClick={()=>setIsSideBarOpen(!isSideideBarOpen)}
          /> 
        </div>
        <SideBar 
          isSideBarOpen={isSideideBarOpen} 
          setIsSideBarOpen={setIsSideBarOpen} 
          setSelectedComponent={setSelectedComponent}/
        > 

        {/* IIFE */}
        {
          (
            ()=>{
              switch (selectedComponent) {
                case "Dashboard":
                  return user?.role=="User" ? <UserDashboard /> : <AdminDashboard />
                  break;
                
                case "Book":
                  return <BookManagement />
                  break;

                case "Catalog":
                  if(user.role==="Admin"){
                    return <Catalog />
                  }
                  break;

                case "Users":
                  if(user.role==="Admin"){
                    return <Users />
                  }
                  break;

                case "My Borrowed Books":
                  return <MyBorrowedBooks />
                  break;

                default:
                  return user?.role=="User" ? <UserDashboard /> : <AdminDashboard />
                  break;
              }
            }
          )()
        }
      </div>
    </>
  );
};

export default Home;

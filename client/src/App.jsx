import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import OTP from "./pages/OTP";
import ResetPassword from "./pages/ResetPassword";
import {ToastContainer} from "react-toastify";

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/password/forgot' element={<ForgotPassword />} />
        <Route path='/otp-verification/:email' element={<OTP />} />
        <Route path='/password/reset/:token' element={<ResetPassword />} /> 
      </Routes>
      <ToastContainer theme='dark'/>
    </Router>
  )
}

export default App

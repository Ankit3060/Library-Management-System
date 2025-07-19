import React, { useState } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { useSelector } from "react-redux";

const Header = () => {
  const {user} = useSelector((state)=>state.auth);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = ()=>{
      const now = new Date();
      const hours = now.getHours()%12 || 12;
      const minute = now.getMinutes().toString().padStart(2, "0");
      // padstart mean it show the time in this manner eg. 7:03:02 rather then 7:03:2
      const ampm = now.getHours()>=12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minute}:${ampm}`);

      const options = {month:"short", date:"numeric", year:"numeric"};
      setCurrentDate(now.toLocaleDateString("en-IN",options));
    };

    updateDateTime();
  }, []);
  
  
  return <>

  </>;
};

export default Header;

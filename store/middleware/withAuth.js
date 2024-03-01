import { useRouter } from "next/router";
import { useSelector } from 'react-redux';
import { APPCONST } from "../constant/globalVar";
import { useEffect, useState } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
   
    const [windowStatus, setWindowStatus] = useState(false);

  
    useEffect(() => { 

      if(typeof window !== "undefined"){
        setWindowStatus(true)
      }     
    }, []);

    if (windowStatus) {
      if(!windowStatus) return;
      const accessToken = localStorage.getItem(APPCONST.AccessToken);

      if (!accessToken) {
        router.replace(APPCONST.LOGINURL);
        return null;
      }
      

      // If this is an accessToken we just render the component that was passed with all its props
      return <WrappedComponent {...props} />;
    }

    // If we are on server, return null
    return null;
  };
};

export default withAuth;

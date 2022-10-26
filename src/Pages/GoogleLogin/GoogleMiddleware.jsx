import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import jwt_decode from "jwt-decode";

function GoogleMiddleware() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { setAuthTokens, setTokenInfo, setInfoFromToken, setGoogleCompleteProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    const {REACT_APP_BASE_BACKEND_URL} = process.env;
    let code = searchParams.get("code")

    const getTokens = async (auth_code) => {
        try{
            let response = await fetch(`${REACT_APP_BASE_BACKEND_URL}/api/google/callback/`, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({"auth_code": auth_code})
            })
            let data = await response.json()
    
            if(response.status === 200){
                setAuthTokens(data)
                setTokenInfo(jwt_decode(data.access))
                localStorage.setItem('authTokens', JSON.stringify(data))
                setInfoFromToken(data.access)
                toast.success('Logged in successfully!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                navigate("/dashboard")
            }
            else if (response.status === 201) {
                setAuthTokens(data)
                setTokenInfo(jwt_decode(data.access))
                localStorage.setItem('authTokens', JSON.stringify(data))
                setGoogleCompleteProfile(true)
                navigate("/complet-profile")
            }
            else {
                toast.error('Something Went Wrong! Please Try again', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
            }
        }
        catch(error){
            toast.error('Server Error! Try again later.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
        }
    }

    useEffect(() => {
      getTokens(code);
    }, [])
  return (
    <div>Loading....</div>
  )
}

export default GoogleMiddleware
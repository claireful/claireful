import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom'
import { notification } from 'antd';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [basketItemsCount, setBasketItemsCount] = useState(0);

    const navigate = useNavigate();

    let loginUser = async (e) => {
        let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(e)
        });
        let data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
            navigate('/cookies');
        } else {
            notification.error({ "placement": "top", "message": "Erreur d'authentification" })
        }
    }


    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        sessionStorage.clear();
        setBasketItemsCount(0);
        navigate('/login');
    }


    let updateToken = async () => {
        let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'refresh': authTokens?.refresh })
        });

        let data = await response.json();

        if (response.status === 200) {
            const newAuthTokens = { access: data.access, refresh: authTokens?.refresh };
            setAuthTokens(newAuthTokens);
            setUser(jwt_decode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(newAuthTokens));
        } else {
            logoutUser();
        }
    }

    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
        basketItemsCount: basketItemsCount,
        setBasketItemsCount: setBasketItemsCount,
    };


    useEffect(() => {
        let fourMinutes = 1000 * 60 * 4;

        if (authTokens) {
            updateToken();
        }

        const interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, fourMinutes)

        return () => clearInterval(interval);

    }, []);

    return (
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
    )
}


import React, {createContext, useContext, useEffect, useState} from 'react';
import { useAuth } from './AuthContext';
import {getProfile} from "../services/auth.service";
import {getLikedProducts} from "../services/user.service"; // Import the AuthContext

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const { authState } = useAuth();
    const [user, setUser] = useState(null);
    const [likedProducts, setLikedProducts] = useState([]);

    useEffect(() => {
        console.log("set user after token change");
        if (authState.token) {
            getProfile()
                .then(response => {
                    console.log(response);
                    setUser(response); // Assuming getProfile returns the user data
                })
                .catch(error => {
                    console.log('Error fetching user profile:', error);
                });
            getLikedProducts()
                .then(response => {
                    setLikedProducts(response);
                })
                .catch(error => {
                    console.log('Error fetching liked products:', error);
                });
        } else {
            setUser(null);
            setLikedProducts([null])
        }
    }, [authState.token]);

    return (
        <UserContext.Provider value={{
            user,
            likedProducts,
            setLikedProducts
        }}>
            {children}
        </UserContext.Provider>
    );
};

const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export { UserProvider, useUser };
import React, {createContext, useContext, useEffect, useState} from 'react';
import { useAuth } from './AuthContext';
import {getProfile} from "../services/auth.service";
import {getLikedProducts} from "../services/user.service";
import {useLoading} from "./LoadingContext"; // Import the AuthContext

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const { loadingDispatch } = useLoading();
    const { authState } = useAuth();
    const [ user, setUser ] = useState(null);
    const [ likedProducts, setLikedProducts ] = useState([]);
    const [ likedProductIds, setLikedProductIds ] = useState([]);

    useEffect(() => {
        console.log("set user after token change");
        if (authState.token) {
            getUserFromToken();
            fetchLikedProducts();
        } else {
            setUser(null);
            setLikedProducts([]);
            setLikedProductIds([]);
        }
    }, [authState.token]);

    const getUserFromToken = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await getProfile();
            console.log("User: ", response);
            setUser(response);
        } catch (error) {
            console.log('Error fetching user profile:', error);
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }


    const fetchLikedProducts = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await getLikedProducts();
            // Add the "buy_quantity" property to each product
            const productsWithBuyQuantity = response.map(product => ({
                ...product,
                buy_quantity: 1,
            }));
            setLikedProducts(productsWithBuyQuantity);

            // Extract product IDs and set the likedProductIds state
            const productIds = response.map(product => product.id);
            setLikedProductIds(productIds);
        } catch (error) {
            setLikedProducts([]);
            setLikedProductIds([]);
            console.log('Error fetching liked products:', error);
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    return (
        <UserContext.Provider value={{
            user,
            likedProducts, setLikedProducts,
            likedProductIds, setLikedProductIds,
            fetchLikedProducts,
            getUserFromToken
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
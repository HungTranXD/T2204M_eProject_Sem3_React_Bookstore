import React, { createContext, useContext, useEffect, useState } from 'react';
import {getCategories} from "../services/category.service";
import {useLoading} from "./LoadingContext";

const CategoryContext = createContext();

export function useCategories() {
    return useContext(CategoryContext);
}

export function CategoryProvider({ children }) {
    const [categories, setCategories] = useState([]);
    const { loadingDispatch } = useLoading();

    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch categories when the component mounts
    const fetchCategories = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    };

    return (
        <CategoryContext.Provider value={categories}>
            {children}
        </CategoryContext.Provider>
    );
}

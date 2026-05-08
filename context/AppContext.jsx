'use client'
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    const { data: session } = useSession();
    const user = session?.user;

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [cartProducts, setCartProducts] = useState([])

    const [pagination, setPagination] = useState({
        totalProducts: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 12
    })

    const fetchProductData = async (page = 1, limit = 12) => {
        try {
            const { data } = await axios.get(`/api/product/list?page=${page}&limit=${limit}`)
            if (data.success) {
                setProducts(data.products)
                setPagination({
                    totalProducts: data.totalProducts,
                    totalPages: data.totalPages,
                    currentPage: data.currentPage,
                    limit: limit
                })
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

const fetchUserData = async () => {
    try {
        if (user?.role === 'admin') {
            setIsSeller(true);
        }

        const { data } = await axios.get('/api/user/data');

        if (data?.success) {
            // Fix: Read from data.data, not data.user
            const userData = data?.data || {};
            setUserData(userData);
            
            // Safely set cartItems with fallback to empty object
            setCartItems(userData?.cartItems || {});
        } else {
            toast.error(data?.message || "Failed to load user data");
        }

    } catch (error) {
        const errorMsg = error?.response?.data?.message || error?.message || "Something went wrong";
        toast.error(errorMsg);
    }
};

    const addToCart = async (itemId) => {

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        
        if(user){
            try {
                await axios.post('/api/cart/update', { cartData })
                toast.success("item added to cart")
            } catch (error) {
                toast.error(error.message)
            }
        }

    }

    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)
        if(user){
            try {
                await axios.post('/api/cart/update', { cartData })
                toast.success("cart updated")
            } catch (error) {
                toast.error(error.message)
            }
        }

    }

    const fetchCartProducts = async () => {
        const itemIds = Object.keys(cartItems).filter(id => cartItems[id] > 0);
        if (itemIds.length === 0) {
            setCartProducts([]);
            return;
        }
        try {
            const { data } = await axios.post('/api/product/cart-info', { itemIds });
            if (data.success) {
                setCartProducts(data.products);
            }
        } catch (error) {
            console.error("Error fetching cart products:", error);
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = cartProducts.find((product) => product._id === items) || products.find((product) => product._id === items);
            if (itemInfo && cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        if (Object.keys(cartItems).length > 0) {
            fetchCartProducts();
        }
    }, [cartItems]);

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        if(user){
            fetchUserData()
        }
        
    }, [user])

    const getToken = () => {
        // Return user object or null - NextAuth handles session via cookies
        // No need for Bearer token since APIs use session-based auth
        return user?.email || null;
    };

    const value = {
        user,
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        pagination, setPagination,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount,
        getToken
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
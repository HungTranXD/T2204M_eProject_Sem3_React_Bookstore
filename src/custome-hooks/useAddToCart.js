import {toast} from "react-toastify";
import {useCart} from "../contexts/CartContext";
import {useLoading} from "../contexts/LoadingContext";

const useAddToCart = () => {
    const { cartDispatch } = useCart();
    const { loadingDispatch } = useLoading();

    const handleAddToCart = (product, buy_quantity) => {
        if (buy_quantity <= 0 || buy_quantity > product.quantity) {
            toast.error('Out of Stock!');
            return;
        }

        loadingDispatch({ type: 'START_LOADING' });
        // Create a new product object with the selected product and buy_quantity
        const productToAdd = {
            ...product,
            buy_quantity: buy_quantity,
        };
        // Dispatch the ADD_TO_CART action with the product
        cartDispatch({ type: 'ADD_TO_CART', payload: { product: productToAdd } });
        toast.success('Add to Cart!');
        loadingDispatch({ type: 'STOP_LOADING' });
    };

    return { handleAddToCart };
};

export default useAddToCart;
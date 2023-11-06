import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

//Components
import PageTitle from './../layouts/PageTitle';
import {useUser} from "../contexts/UserContext";
import {useLoading} from "../contexts/LoadingContext";
import {getCategories} from "../services/category.service";
import {getLikedProducts, likeOrUnlikeProduct} from "../services/user.service";
import {addAutoWidthTransformation} from "../utils/cloudinaryUtils";
import {formatCurrency} from "../utils/currencyFormatter";
import {useCart} from "../contexts/CartContext";
import {toast} from "react-toastify";
import useAddToCart from "../custome-hooks/useAddToCart";
import {calculateMinAndMaxPrice} from "../utils/productVariantUtils";
import SelectVariantModal from "../components/Home/SelectVariantModal";



function Wishlist(){
    const { loadingDispatch } = useLoading();
    const { user, likedProducts, setLikedProducts, fetchLikedProducts } = useUser();
    const { handleAddToCart } = useAddToCart();

    useEffect(() => {
        fetchLikedProducts();
    }, [])

    const decreaseQuantity = (product) => {
        if (product.buy_quantity > 1) {
            setLikedProducts((prevLikedProducts) =>
                prevLikedProducts.map((item) =>
                    item.id === product.id ? { ...item, buy_quantity: item.buy_quantity - 1 } : item
                )
            );
        }
    };

    const increaseQuantity = (product) => {
        if (product.buy_quantity < product.quantity) {
            setLikedProducts((prevLikedProducts) =>
                prevLikedProducts.map((item) =>
                    item.id === product.id ? { ...item, buy_quantity: item.buy_quantity + 1 } : item
                )
            );
        }
    };

    const handleRemoveClick = async (id) => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            await likeOrUnlikeProduct(id);
            await fetchLikedProducts();
            toast.success("Remove from wishlist")
        } catch (error) {
            toast.error("Can not remove product")
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    const [selectVariantModalShow, setSelectVariantModalShow] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    return(
        <>
            <SelectVariantModal product={selectedProduct} show={selectVariantModalShow} onHide={() => setSelectVariantModalShow(false)} />
            <div className="page-content">
                <PageTitle  parentPage="Shop" childPage="Wishlist" />
                <section className="content-inner-1">
                    {/* <!-- Product --> */}
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="table-responsive">
                                    <table className="table check-tbl">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Product name</th>
                                                <th>Unit Price</th>
                                                <th>Quantity</th>
                                                <th>Add to cart</th>
                                                <th>Close</th>
                                            </tr>
                                        </thead>
                                        {user && likedProducts.length > 0 &&
                                            <tbody>
                                            {likedProducts.map((product)=>(
                                                <tr key={product.id}>
                                                    <td className="product-item-img"><img src={addAutoWidthTransformation(product.thumbnail)} alt="" /></td>
                                                    <td className="product-item-name">{product.name}</td>
                                                    {product.hasVariants ? (
                                                        <td className="product-item-price">
                                                            {formatCurrency(calculateMinAndMaxPrice(product).minPrice)} - {formatCurrency(calculateMinAndMaxPrice(product).maxPrice)}
                                                        </td>
                                                    ) : (
                                                        product.discountAmount ?
                                                            <td className="product-item-price">
                                                                {formatCurrency(product.price - product.discountAmount)}
                                                                <del className="text-primary m-l10">{formatCurrency(product.price)}</del>
                                                            </td>
                                                            :
                                                            <td className="product-item-price">
                                                                {formatCurrency(product.price)}
                                                            </td>
                                                    )}

                                                    <td className="product-item-quantity">
                                                        {product.hasVariants ? (
                                                            <Link
                                                                to={`/shop-detail/${product.slug}`}
                                                                className="btn btn-outline-primary btnhover"
                                                            >
                                                                See Detail
                                                            </Link>
                                                        ) : (
                                                            product.quantity > 0 ?
                                                                <div className="quantity btn-quantity style-1 me-3">
                                                                    <button
                                                                        className="btn btn-plus"
                                                                        type="button"
                                                                        onClick={() => increaseQuantity(product)}
                                                                    >
                                                                        <i className="ti-plus"></i>
                                                                    </button>
                                                                    <input type="text" className="quantity-input" value={product.buy_quantity} />
                                                                    <button
                                                                        className="btn btn-minus "
                                                                        type="button"
                                                                        onClick={() => decreaseQuantity(product)}
                                                                    >
                                                                        <i className="ti-minus"></i>
                                                                    </button>
                                                                </div>
                                                                :
                                                                <div>Out of stock</div>
                                                        )}

                                                    </td>
                                                    <td className="product-item-totle">
                                                        {product.hasVariants ? (
                                                            <button
                                                                className="btn btn-primary btnhover"
                                                                onClick={async () => {
                                                                    await setSelectedProduct(product);
                                                                    setSelectVariantModalShow(true);
                                                                }}
                                                            >
                                                                Add To Cart
                                                            </button>
                                                        ) : (
                                                            product.quantity > 0 ?
                                                                <Link
                                                                    className="btn btn-primary btnhover"
                                                                    onClick={() => handleAddToCart(product, 1)}
                                                                >
                                                                    Add To Cart
                                                                </Link>
                                                                :
                                                                <div>Out of Stocl</div>
                                                        )}

                                                    </td>
                                                    <td className="product-item-close">
                                                        <Link
                                                            className="ti-close"
                                                            onClick={() => handleRemoveClick(product.id)}
                                                        ></Link>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        }

                                        {user && likedProducts.length === 0 &&
                                            <tbody>
                                            <tr>
                                                <td colSpan="6" className="text-center">(Wishlist is empty)</td>
                                            </tr>
                                            </tbody>
                                        }

                                        {user == null &&
                                            <tbody>
                                            <tr>
                                                <td colSpan="6" className="text-center">
                                                    Have a account?
                                                    <Link to={"/shop-login"}> Login </Link>
                                                    or
                                                    <Link to={"/shop-registration"}> Register </Link>
                                                </td>
                                            </tr>
                                            </tbody>
                                        }

                                    </table>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    {/* <!-- Product END --> */}
                </section>
            
            </div>
        </>
    )
}
export default Wishlist;
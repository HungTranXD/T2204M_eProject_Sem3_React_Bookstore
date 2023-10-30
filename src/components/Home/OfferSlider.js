import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
//import "swiper/css";
import { Navigation, Pagination } from "swiper";

//Images

import blog3 from './../../assets/images/blog/blog5.jpg';
import blog5 from './../../assets/images/blog/blog6.jpg';
import blog7 from './../../assets/images/blog/blog7.jpg';
import {useLoading} from "../../contexts/LoadingContext";
import {useCart} from "../../contexts/CartContext";
import {getProducts} from "../../services/product.service";
import {toast} from "react-toastify";
import {addAutoWidthTransformation} from "../../utils/cloudinaryUtils";
import {formatCurrency} from "../../utils/currencyFormatter";



// import Swiper core and required modules

const dataBlog = [
	{ image: blog3, title:'SECONDS [Part I]'},
	{ image: blog5, title:'TERRRIBLE MADNESS'},
	{ image: blog7, title:'REWORK'},
	{ image: blog3, title:'SECONDS [Part I]'},
	{ image: blog5, title:'TERRRIBLE MADNESS'},
	{ image: blog7, title:'REWORK'},
]; 

function OfferSlider() {
	const navigationPrevRef = React.useRef(null)
	const navigationNextRef = React.useRef(null)
   // const paginationRef = React.useRef(null)

    const {loadingDispatch} = useLoading();
    const { cartDispatch } = useCart();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch6HighestDiscountProducts();
    }, [])

    const fetch6HighestDiscountProducts = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await getProducts({
                page: 1,
                pageSize: 6,
                categoryIds: [],
                authorIds: [],
                publisherIds: [],
                publishYears: [],
                sortBy: "highestdiscount",
                status: 1
            });
            setProducts(response.products);
        } catch (error) {
            console.log(error);
            setProducts([]);
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    const handleAddToCart = (product) => {
        if (product.quantity === 0) {
            toast.error('Out of Stock!');
            return;
        }

        loadingDispatch({type: 'START_LOADING'});
        // Create a new product object with the selectedGift and buy_quantity
        const productToAdd = {
            ...product,
            buy_quantity: 1,
        };
        // Dispatch the ADD_TO_CART action with the product
        cartDispatch({ type: 'ADD_TO_CART', payload: { product: productToAdd } });
        toast.success('Add to Cart!');
        loadingDispatch({type: 'STOP_LOADING'});
    };


    return (
		<>
					
            <div className="section-head book-align">
                <h2 className="title mb-0">Special Offers</h2>
                <div className="pagination-align style-1">
                    <div className="book-button-prev swiper-button-prev" ref={navigationPrevRef}><i className="fa-solid fa-angle-left"></i></div>
                    <div className="book-button-next swiper-button-next" ref={navigationNextRef}><i className="fa-solid fa-angle-right"></i></div>
                </div>
            </div>	
            <Swiper className="swiper-container  book-swiper"						
               // speed= {1500}
                //parallax= {true}
                slidesPerView={3}
                spaceBetween= {30}
                //loop={true}
                // pagination= {{
                //     el: ".swiper-pagination-two",
                //     clickable: true,
                // }}
                autoplay= {{
                    delay: 4000,
                }}								
                    onSwiper={(swiper) => {
                    setTimeout(() => {
                        swiper.params.navigation.prevEl = navigationPrevRef.current
                        swiper.params.navigation.nextEl = navigationNextRef.current
                        swiper.navigation.destroy()
                        swiper.navigation.init()
                        swiper.navigation.update()
                    })
                    }}
                modules={[Navigation, Pagination]}
                breakpoints = {{
                    360: {
                        slidesPerView: 1,
                    },
                    600: {
                        slidesPerView: 1,
                    },
                    767: {
                        slidesPerView: 2,
                    },
                    991: {
                        slidesPerView: 2,
                    },
                    1200: {
                        slidesPerView: 3,
                    },
                    1680: {
                        slidesPerView: 3,
                    }
                }}						
            >	
            
                {products.map((product)=>(
                    <SwiperSlide key={product.id}>
                        <div className="dz-card style-2">
                            <div className="dz-media">
                                <Link to={`/shop-detail/${product.slug}`}>
                                    <img src={addAutoWidthTransformation(product.thumbnail)} alt="/" style={{height: "222px", objectFit: "cover"}}/>
                                </Link>
                            </div>
                            <div className="dz-info">
                                <h4 className="dz-title">
                                    <Link to={`/shop-detail/${product.slug}`}>{product.name}</Link>
                                </h4>
                                <div className="dz-meta">
                                    <ul className="dz-tags">
                                        {product.categories.map((category, index) =>
                                            <li key={category.id}>
                                                <Link className="me-1 text-uppercase">{category.name}</Link>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <p className="truncate-3-lines">
                                    {product.description}
                                </p>
                                <div className="bookcard-footer">
                                    <Link
                                        className="btn btn-primary m-t15 btnhover btnhover2"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        <i className="flaticon-shopping-cart-1 m-r10"></i> Add to cart
                                    </Link>
                                    <div className="price-details">
                                        {product.discountAmount ?
                                            <>
                                                {formatCurrency(product.price - product.discountAmount)} <del>{formatCurrency(product.price)}</del>
                                            </>
                                            :
                                            <>
                                                {formatCurrency(product.price - product.discountAmount)}
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}										
            </Swiper>			
		</>
	)
}
export default OfferSlider;
import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { Navigation, Pagination } from "swiper";

//Images

import book1 from './../../assets/images/books/large/bigbook1.jpg';
import book2 from './../../assets/images/books/large/bigbook2.jpg';
import {useLoading} from "../../contexts/LoadingContext";
import {useCart} from "../../contexts/CartContext";
import {getProducts} from "../../services/product.service";
import {toast} from "react-toastify";
import {addAutoWidthTransformation} from "../../utils/cloudinaryUtils";
import {formatCurrency} from "../../utils/currencyFormatter";





// import Swiper core and required modules

const dataBlog = [
	{ image: book1, title:'A Heavy LIft'},
	{ image: book2, title:'Pushing Clouds'},
	{ image: book1, title:'A Heavy LIft'},
	{ image: book2, title:'Pushing Clouds'},
	{ image: book1, title:'A Heavy LIft'},
	{ image: book2, title:'Pushing Clouds'},
]; 

function FeaturedSlider() {
	const navigationPrevRef = React.useRef(null)
	const navigationNextRef = React.useRef(null)
    const paginationRef = React.useRef(null)

    const {loadingDispatch} = useLoading();
    const { cartDispatch } = useCart();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch6BestSellerProducts();
    }, [])

    const fetch6BestSellerProducts = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await getProducts({
                page: 1,
                pageSize: 6,
                categoryIds: [],
                authorIds: [],
                publisherIds: [],
                publishYears: [],
                sortBy: "bestseller",
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
            <Swiper className="swiper-container books-wrapper-2 swiper-three"						
                
                //parallax= {true}
                centeredSlides={true}
                slidesPerView={"auto"}
                spaceBetween= {90}
                loop={true}
				speed={1000}
                pagination= {{
                    el: ".swiper-pagination-three",
                    clickable: true,
                }}
                //autoplay= {{
                //    delay: 4500,
                //}}								
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
                    320: {
                        slidesPerView: 1,
                    },
                    1200: {
                        slidesPerView: 1,
                    },
                    1680: {
                        slidesPerView: 1,
                    },
                }}						
            >	
            
                {products.map((product)=>(
                    <SwiperSlide key={product.id}>
                        <div className="books-card style-2">
                            <div className="dz-media">
                                <img src={addAutoWidthTransformation(product.thumbnail)} alt="book" />
                            </div>
                            <div className="dz-content">
                                <h6 className="sub-title">BEST SELLER</h6>
                                <h2 className="title">
                                    <Link to={`/shop-detail/${product.slug}`}>{product.name}</Link>
                                </h2>
                                <ul className="dz-tags">
                                    <li>{product.author.name}</li>
                                    <li>{product.categories[0].name}</li>
                                </ul>
                                <p className="text">{product.description}</p>
                                <div className="price">
                                    {product.discountAmount ?
                                        <div className="price">
                                            <span className="price-num">{formatCurrency(product.price - product.discountAmount)}</span>
                                            <del>{formatCurrency(product.price)}</del>
                                            <span className="badge">{(product.discountAmount * 100/product.price).toFixed(2) }% OFF</span>
                                        </div>
                                        :
                                        <div className="price">
                                            <span className="price-num">{formatCurrency(product.price)}</span>
                                        </div>
                                    }
                                </div>
                                <div className="bookcard-footer">
                                    <Link
                                        className="btn btn-primary btnhover m-t15 m-r10"
                                        onClick={() => handleAddToCart(product)}
                                    >Add to Cart</Link>
                                    <Link to={`/shop-detail/${product.slug}`} className="btn btn-outline-secondary btnhover m-t15">See Details</Link>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    
                ))}	
                <div className="pagination-align style-2">
                    <div className="swiper-button-prev" ref={navigationPrevRef}><i className="fa-solid fa-angle-left"></i></div>
                    <div className="swiper-pagination-three" ref={paginationRef}></div>
                    <div className="swiper-button-next"  ref={navigationNextRef}><i className="fa-solid fa-angle-right"></i></div>
                </div>									
            </Swiper>			
		</>
	)
}
export default FeaturedSlider;
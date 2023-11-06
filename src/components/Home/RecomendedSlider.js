import React from "react";
import {Link} from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

//Images
import book1 from './../../assets/images/books/grid/book1.jpg';
import book2 from './../../assets/images/books/grid/book2.jpg';
import book5 from './../../assets/images/books/grid/book5.jpg';
import book6 from './../../assets/images/books/grid/book6.jpg';
import book14 from './../../assets/images/books/grid/book14.jpg';
import book15 from './../../assets/images/books/grid/book15.jpg';
import book16 from './../../assets/images/books/grid/book16.jpg';



// import Swiper core and required modules
import { Autoplay } from "swiper";
import {useLoading} from "../../contexts/LoadingContext";
import {useEffect, useState} from 'react';
import {getProducts} from "../../services/product.service";
import {addAutoWidthTransformation} from "../../utils/cloudinaryUtils";
import {formatCurrency} from "../../utils/currencyFormatter";
import {toast} from "react-toastify";
import {useCart} from "../../contexts/CartContext";
import useAddToCart from "../../custome-hooks/useAddToCart";
import {calculateMinAndMaxPrice} from "../../utils/productVariantUtils";

//SwiperCore.use([EffectCoverflow,Pagination]);

const dataBlog = [
	{image: book6  , title:'Adventure', price:'$18.78'},
	{image: book5  , title:'Take Tango', price:'$20.50'},
	{image: book2  , title:'Homie', price:'$25.50'},
	{image: book16 , title:'Thunder Stunt', price:'$16.70'},
	{image: book14 , title:'Heavy Lift', price:'$19.25'},
	{image: book1  , title:'Real Life', price:'$27.30'},
	{image: book15 , title:'Terrible', price:'$24.89'},
];

export default function RecomendedSlider({ setSelectedProduct, setSelectVariantModalShow }) {
	const {loadingDispatch} = useLoading();
	const { handleAddToCart } = useAddToCart();
	const [products, setProducts] = useState([]);

	useEffect(() => {
		fetch7NewestProducts();
	}, [])

	const fetch7NewestProducts = async () => {
		try {
			loadingDispatch({type: 'START_LOADING'});
			const response = await getProducts({
				page: 1,
				pageSize: 7,
				categoryIds: [],
				authorIds: [],
				publisherIds: [],
				publishYears: [],
				sortBy: "newest",
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

	return (
		<>
			<Swiper className="swiper-container  swiper-two"						
				speed= {1500}
				//parallax= {true}
				slidesPerView= {5}
				spaceBetween= {30}
				loop={true}
				autoplay= {{
				   delay: 2500,
				}}
				modules={[ Autoplay ]}
				breakpoints = {{
					1200: {
                        slidesPerView: 5,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                    991: {
                        slidesPerView: 3,
                    },
                    767: {
                        slidesPerView: 3,
                        centeredSlides: true,
                    },
                    320: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                        centeredSlides: true,
                    },
				}}
			>	
				{products.map((product)=>(
					<SwiperSlide key={product.id}>
                        <div className="books-card style-1 wow fadeInUp" data-wow-delay="0.1s">
                            <div className="dz-media">
                                <img src={addAutoWidthTransformation(product.thumbnail)} alt="book" />
                            </div>
                            <div className="dz-content">
                                <h4 className="title">
									<Link to={`/shop-detail/${product.slug}`} style={{overflowX: "hidden", whiteSpace: "nowrap", display: "block" }}>
										{product.name}
									</Link>
								</h4>
								{product.hasVariants ? (
									<span className="price">
									{formatCurrency(calculateMinAndMaxPrice(product).minPrice)} - {formatCurrency(calculateMinAndMaxPrice(product).maxPrice)}
								</span>
								) : (
									<span className="price">
									{formatCurrency(product.price - (product.discountAmount ? product.discountAmount : 0))}
								</span>
								)}

								{product.hasVariants ? (
									<Link
										className="btn btn-secondary btnhover btnhover2"
										onClick={async () => {
											await setSelectedProduct(product);
											setSelectVariantModalShow(true);
										}}
									>
										<i className="flaticon-shopping-cart-1 m-r10"></i> Add to cart
									</Link>
								) : (
									<Link
										className="btn btn-secondary btnhover btnhover2"
										onClick={() => handleAddToCart(product, 1)}
									>
										<i className="flaticon-shopping-cart-1 m-r10"></i> Add to cart
									</Link>
								)}

                            </div>
                        </div>						
					</SwiperSlide>
				))}				
			</Swiper>
		</>
	)
}
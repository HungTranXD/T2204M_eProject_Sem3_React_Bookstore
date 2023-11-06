import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

//Images
import bgwave from './../../assets/images/background/waveelement.png';
//import bg10 from './../../assets/images/background/bg10.jpg';
//import bg11 from './../../assets/images/background/bg11.jpg';
//import bg12 from './../../assets/images/background/bg12.jpg';
import partner1 from './../../assets/images/partner/partner-1.png';
import partner2 from './../../assets/images/partner/partner-2.png';
import partner3 from './../../assets/images/partner/partner-3.png';
import group from './../../assets/images/Group.png';
import media1 from './../../assets/images/banner/banner-media.png';
import media2 from './../../assets/images/banner/banner-media2.png';
import book16 from './../../assets/images/books/book16.png';
import book9 from './../../assets/images/books/grid/book9.jpg';



//import { EffectFade, Autoplay , Parallax, Pagination} from "swiper";


import SwiperCore, {EffectFade, Autoplay, FreeMode, Parallax,Thumbs, Pagination} from 'swiper';
import {useLoading} from "../../contexts/LoadingContext";
import {useCart} from "../../contexts/CartContext";
import {getProducts} from "../../services/product.service";
import {toast} from "react-toastify";
import {formatCurrency} from "../../utils/currencyFormatter";
import {addAutoWidthTransformation} from "../../utils/cloudinaryUtils";
import {calculateMinAndMaxDiscount, calculateMinAndMaxPrice} from "../../utils/productVariantUtils";
import {calculateStarRating} from "../../utils/renderStarRatingUtils";
import SelectVariantModal from "./SelectVariantModal";
import useAddToCart from "../../custome-hooks/useAddToCart";
SwiperCore.use([Parallax,Thumbs, FreeMode,Autoplay, Pagination, EffectFade ]);


const homeData1 = [
	{image: media1, title: 'Pushing Clouds',  datatitle: 'BEST SELLER',  price:'9.5',mainprice:'12.0', offer:'25%'},
	{image: media2, title: 'Think and Grow Rich',  datatitle: 'BEST MANAGEMENT',	price:'10.4',mainprice:'15.25', offer:'33%'},
	
];

const homeData2 = [
	{image: book16, title: 'Pushing Clouds', price:'9.5',},
	{image: book9, title: 'Think and Grow Rich', price:'10.4'},
	{image: book16, title: 'Pushing Clouds', price:'9.5'},
	{image: book9, title: 'Think and Grow Rich', price:'10.4' },
];

export default function HomeMainSlider({setSelectedProduct, setSelectVariantModalShow}) {
	const [thumbsSwiper, setThumbsSwiper] = useState(null);	
	const paginationRef = React.useRef(null)

	const {loadingDispatch} = useLoading();
	const { handleAddToCart } = useAddToCart();
	const [products, setProducts] = useState([]);
	const [fourProducts, setFourProducts] = useState([]);




	useEffect(() => {
		fetch2BestSellerProducts();
		fetch4BestSellerProducts();
	}, [])

	const fetch2BestSellerProducts = async () => {
		try {
			loadingDispatch({type: 'START_LOADING'});
			const response = await getProducts({
				page: 1,
				pageSize: 2,
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

	const fetch4BestSellerProducts = async () => {
		try {
			loadingDispatch({type: 'START_LOADING'});
			const response = await getProducts({
				page: 1,
				pageSize: 4,
				categoryIds: [],
				authorIds: [],
				publisherIds: [],
				publishYears: [],
				sortBy: "bestseller",
				status: 1
			});
			console.log("fourProducts", response);
			setFourProducts(response.products);
		} catch (error) {
			console.log(error);
			setFourProducts([]);
		} finally {
			loadingDispatch({type: 'STOP_LOADING'});
		}
	}


	return (
		<>

			{products &&
				<Swiper className="swiper-container main-swiper "
						speed= {1500}
						parallax= {true}
					//spaceBetween= {10}
					//freeMode={true}
						effect={"fade"}
						slidesPerView= {"auto"}
						loop={false}
					//watchSlidesProgress= {true}
						pagination= {{
							el: ".swiper-pagination-five",
							clickable: true,
						}}
						autoplay= {{
							delay: 1500,
						}}
						thumbs={{ swiper: thumbsSwiper }}
						modules={[ Autoplay, Pagination, Parallax ]}

				>
					{products.map((product, index)=>(
						<SwiperSlide className="bg-blue" key={product.id} style={{backgroundImage: 'url('+ bgwave +')'}}>
							<div className="container">
								<div className="banner-content">
									<div className="row">
										<div className="col-md-6">
											<div className="swiper-content">
												<div className="content-info">
													<h6 className="sub-title" data-swiper-parallax="-10">BEST SELLER</h6>
													<h1 className="title mb-0" data-swiper-parallax="-20">{product.name}</h1>
													<ul className="dz-tags" data-swiper-parallax="-30">
														<li><Link to={"#"}>{product.author.name}</Link></li>
														<li><Link to={"#"}>{product.categories[0].name}</Link></li>
													</ul>
													<p className="text mb-0 truncate-3-lines" data-swiper-parallax="-40">{product.description}</p>
													<div className="price" data-swiper-parallax="-50">
														{product.hasVariants ? (
															<>
																<span className="price-num">{formatCurrency(calculateMinAndMaxPrice(product).minPrice)} - {formatCurrency(calculateMinAndMaxPrice(product).maxPrice)}</span>
																<del>{formatCurrency(calculateMinAndMaxPrice(product).minOriginalPrice)} - {formatCurrency(calculateMinAndMaxPrice(product).maxOriginalPrice)}</del>
																<span className="badge badge-danger">{formatCurrency(calculateMinAndMaxDiscount(product).minDiscountPercentage)} - {formatCurrency(calculateMinAndMaxDiscount(product).maxDiscountPercentage)} OFF</span>
															</>
														) : (
															product.discountAmount ?
																<>
																	<span className="price-num">{formatCurrency(product.price - product.discountAmount)}</span>
																	<del>{formatCurrency(product.price)}</del>
																	<span className="badge badge-danger">{(product.discountAmount * 100 / product.price).toFixed(2)} OFF</span>
																</>
																:
																<span className="price-num">{formatCurrency(product.price)}</span>

														)}
													</div>
													<div className="content-btn" data-swiper-parallax="-60">
														{!product.hasVariants &&
															<Link
																className="btn btn-primary btnhover me-4"
																onClick={() => handleAddToCart(product, 1)}
															>Add to Cart</Link>
														}
														<Link className="btn border btnhover  text-white" to={`/shop-detail/${product.slug}`}>See Details</Link>
													</div>
												</div>
												<div className="partner">
													<p>Our partner</p>
													<div className="brand-logo">
														<img src={partner1} alt="client" />
														<img  className="mid-logo" src={partner2} alt="client" />
														<img src={partner3} alt="client" />
													</div>
												</div>
											</div>
										</div>
										<div className="col-md-6">
											<div className="banner-media" data-swiper-parallax="-100">
												<img src={homeData1[index].image} alt="banner-media" />
											</div>
											<img className="pattern" src={group} data-swiper-parallax="-100" alt="dots" />
										</div>
									</div>
								</div>
							</div>
						</SwiperSlide>
					))}
					<div className="container swiper-pagination-wrapper">
						<div className="swiper-pagination-five" ref={paginationRef}></div>
					</div>
				</Swiper>
			}

			
			<div ref={paginationRef} className="swiper-pagination-about about-pagination swiper-pagination-clickable swiper-pagination-bullets" ></div>

			{fourProducts.length > 0 &&
				<Swiper className="swiper-container main-swiper-thumb"
						onSwiper={setThumbsSwiper}
						spaceBetween= {10}
						slidesPerView= {"auto"}
					//slidesPerView= {"auto"}
					//slidesPerView= {1}
						loop={true}
						speed={1500}
					//freeMode={true}
					//effect={"fade"}
						watchSlidesProgress= {true}
						autoplay={{
							delay: 2800,
						}}
						modules={[ EffectFade, Autoplay,Pagination]}
				>
					{fourProducts.map((product, index)=>(
						<SwiperSlide key={product.id}>
							<div className="books-card">
								<div className="dz-media">
									<img src={addAutoWidthTransformation(product.thumbnail)} alt="book" style={{width: "398px"}} />
								</div>
								<div className="dz-content">
									<h5 className="title mb-0"><Link to={`/shop-detail/${product.slug}`}>{product.name}</Link></h5>
									<div className="dz-meta">
										<ul>
											<li>by {product.author.name}</li>
										</ul>
									</div>
									<div className="book-footer">
										<div className="price">
											{product.hasVariants ? (
												<span className="price-num m-r10">{formatCurrency(calculateMinAndMaxPrice(product).minPrice)}-{formatCurrency(calculateMinAndMaxPrice(product).maxPrice)}</span>
											) : (
												<span className="price-num m-r10">{formatCurrency(product.price - (product.discountAmount ? product.discountAmount : 0))}</span>
											)}

										</div>
										<div className="rate d-flex">
											{calculateStarRating(parseFloat(product.rating.toFixed(1)))}
										</div>
									</div>
								</div>
							</div>
						</SwiperSlide>
					))}

				</Swiper>
			}
		</>
	)
}
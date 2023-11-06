import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
//import "swiper/css";
import { Navigation, Pagination } from "swiper";

//Images

import book3 from './../../assets/images/books/grid/book3.jpg';
import book5 from './../../assets/images/books/grid/book5.jpg';
import book7 from './../../assets/images/books/grid/book7.jpg';
import book11 from './../../assets/images/books/grid/book11.jpg';
import book12 from './../../assets/images/books/grid/book12.jpg';
import book15 from './../../assets/images/books/grid/book15.jpg';
import {useLoading} from "../../contexts/LoadingContext";
import {getProducts} from "../../services/product.service";
import {addAutoWidthTransformation} from "../../utils/cloudinaryUtils";
import {formatCurrency} from "../../utils/currencyFormatter";




// import Swiper core and required modules

const dataBlog = [
	{ image: book5, title:'Take Out Tango'},
	{ image: book11, title:'The Missadventure'},
	{ image: book7, title:'Seconds [PART 1]'},
	{ image: book12, title:'The Missadventure'},
	{ image: book15, title:'Terrible Madness'},
	{ image: book3, title:'Battle Drive'},
]; 

function BookSaleSlider() {
	const navigationPrevRef = React.useRef(null)
	const navigationNextRef = React.useRef(null)
    const paginationRef = React.useRef(null)

    const {loadingDispatch} = useLoading();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch6HighestRatingProducts();
    }, [])

    const fetch6HighestRatingProducts = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await getProducts({
                page: 1,
                pageSize: 6,
                categoryIds: [],
                authorIds: [],
                publisherIds: [],
                publishYears: [],
                sortBy: "highestrating",
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
            <div className="section-head book-align">
                <h2 className="title mb-0">Highest Rating</h2>
                <div className="pagination-align style-1">
                    <div className="swiper-button-prev" ref={navigationPrevRef}><i className="fa-solid fa-angle-left"></i></div>
                     <div className="swiper-pagination-two" ref={paginationRef}></div> 
                    <div className="swiper-button-next" ref={navigationNextRef}><i className="fa-solid fa-angle-right"></i></div>
                </div>
            </div>				
            <Swiper className="swiper-container books-wrapper-3 swiper-four"						
                speed= {1500}
                parallax= {true}
                slidesPerView={5}
                spaceBetween= {30}
                loop={true}
                pagination= {{
                    el: ".swiper-pagination-two",
                    clickable: true,
                }}
                autoplay= {{
                    delay: 3000,
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
                    1200: {
                        slidesPerView: 5,
                    },
                    1191: {
                        slidesPerView: 4,
                    },
                    767: {
                        slidesPerView: 3,
                    },
                    591: {
                        slidesPerView: 2,
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
                        <div className="books-card style-3 wow fadeInUp" data-wow-delay="0.1s">
                            <div className="dz-media">
                                <img src={addAutoWidthTransformation(product.thumbnail)} alt="book" style={{height: "300px", objectFit: "cover"}}/>
                            </div>
                            <div className="dz-content">
                                <h5 className="title">
                                    <Link to={`/shop-detail/${product.slug}`} style={{overflowX: "hidden", whiteSpace: "nowrap", display: "block" }}>
                                        {product.name}
                                    </Link>
                                </h5>
                                <ul className="dz-tags text-uppercase" style={{overflowX: "hidden", whiteSpace: "nowrap", display: "block" }}>
                                    {product.categories.map((category, index) =>
                                        <li
                                            key={category.id}
                                            className="d-inline-block"
                                        >
                                            <Link>{category.name}{index < product.categories.length - 1 && ","}</Link>
                                        </li>
                                    )}
                                </ul>
                                <div className="book-footer">
                                    <div className="rate">
                                        <i className="flaticon-star"></i> {product.rating.toFixed(1)}
                                    </div>
                                    {product.hasVariants ? (
                                        <div className="price">
                                            <span className="price-num">{formatCurrency(calculateMinAndMaxPrice(product).minPrice)} - {formatCurrency(calculateMinAndMaxPrice(product).maxPrice)}</span>
                                        </div>
                                    ) : (
                                        product.discountAmount ?
                                            <div className="price">
                                                <span className="price-num">{formatCurrency(product.price - product.discountAmount)}</span>
                                                <del>{formatCurrency(product.price)}</del>
                                            </div>
                                            :
                                            <div className="price">
                                                <span className="price-num">{formatCurrency(product.price)}</span>
                                            </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}										
            </Swiper>			
		</>
	)
}
export default BookSaleSlider;
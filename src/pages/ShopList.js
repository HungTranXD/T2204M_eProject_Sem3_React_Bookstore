import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Collapse, Dropdown} from 'react-bootstrap';

//Component
import ClientsSlider from '../components/Home/ClientsSlider';
import CounterSection from '../elements/CounterSection';
import NewsLetter from '../components/NewsLetter';

//Images
import book16 from './../assets/images/books/grid/book16.jpg';
import book12 from './../assets/images/books/grid/book12.jpg';
import book14 from './../assets/images/books/grid/book14.jpg';
import book15 from './../assets/images/books/grid/book15.jpg';
import book10 from './../assets/images/books/grid/book10.jpg';
import book11 from './../assets/images/books/grid/book11.jpg';
import {getProducts, searchProducts} from "../services/product.service";
import {useLoading} from "../contexts/LoadingContext";
import {useCart} from "../contexts/CartContext";
import {addAutoWidthTransformation} from "../utils/cloudinaryUtils";
import {formatCurrency} from "../utils/currencyFormatter";
import {useUser} from "../contexts/UserContext";
import {likeOrUnlikeProduct} from "../services/user.service";
import {toast} from "react-toastify";
import Pagination from "../components/Home/Pagination";

const lableBlogData = [
    {name:'Architecture'},
    {name:'Art'},
    {name:'Action'},
    {name:'Biography & Autobiography'},
    {name:'Body, Mind & Spirit'},
    {name:'Business & Economics'},    
    {name:'Children Fiction'},
    {name:'Children Non-Fiction'},
    {name:'Comics & Graphic Novels'},
    {name:'Cooking'},
    {name:'Crafts & Hobbies'},
    {name:'Design'},
    {name:'Drama'},
    {name:'Education'},
    {name:'Family & Relationships'},
    {name:'Fiction'},
    {name:'Foreign Language Study'},
    {name:'Games'},
    {name:'Gardening'},
    {name:'Health & Fitness'},
    {name:'History'},
    {name:'House & Home'},
    {name:'Humor'},
    {name:'Literary Collections'},
    {name:'Mathematics'}
];

const cardDetials = [
   {image:book12, title:'The Missadventure', subtitle1:'DRAMA',subtitle2:'HORROR', price1:'23.00', price2:'52.00' },
   {image:book16, title:'Thunder Stunt', subtitle1:'ADVANTURE',subtitle2:'SCIENCE', price1:'54.78', price2:'70.00' },
   {image:book14, title:'A Heavy Lift', subtitle1:'RACING',subtitle2:'DRAMA', price1:'25.18', price2:'68.00' },
   {image:book15, title:'Terrible Madness', subtitle1:'SPORTS',subtitle2:'GAME', price1:'25.30', price2:'38.00' },
   {image:book11, title:'ALL GOOD NEWS', subtitle1:'DRAMA',subtitle2:'COMEDY', price1:'40.78', price2:'68.00' },
   {image:book10, title:'Emily The Back', subtitle1:'DRAMA',subtitle2:'SIRIAL', price1:'54.78', price2:'63.00' }, 
];

function ShopList(){
    const { categoryId, searchString } = useParams();

    const {loadingDispatch} = useLoading();
    const { cartDispatch } = useCart();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const { likedProductIds, fetchLikedProducts  } = useUser();

    useEffect(() => {
        fetchSearchedProducts();
    }, [categoryId, searchString, currentPage]);

    useEffect(() => {
        fetchLikedProducts();
    }, [])

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const fetchSearchedProducts = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await searchProducts(categoryId, searchString, currentPage, 6);
            console.log(response);
            setProducts(response.products);
            setTotalPages(response.totalPages);
            setTotalItems(response.totalItems);
        } catch (error) {
            console.log(error);
            setProducts([]);
            setCurrentPage(1);
            setTotalItems(0);
            setTotalPages(1);
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    const handleLikeButton = async (id) => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            await likeOrUnlikeProduct(id);
            await fetchLikedProducts();
            toast.success("Like/Unlike successfully")
        } catch (error) {
            toast.error("You need to login")
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    function calculateStarRating(rating) {
        const roundedRating = Math.round(rating * 2) / 2; // Round to the nearest 0.5
        const starRating = [];

        for (let i = 1; i <= 5; i++) {
            if (roundedRating >= i) {
                starRating.push(<li key={i}><i className="fas fa-star text-yellow"></i></li>);
            } else if (roundedRating === i - 0.5) {
                starRating.push(<li key={i}><i className="fas fa-star-half-alt text-yellow"></i></li>);
            } else {
                starRating.push(<li key={i}><i className="far fa-star text-yellow"></i></li>);
            }
        }

        return starRating;
    }

    const [accordBtn, setAccordBtn] = useState();
    const [selectBtn, setSelectBtn] = useState('Newest');
    return(
        <>
            <div className="page-content bg-grey">
                <section className="content-inner-1 border-bottom">
                    <div className="container">
                        <div className="filter-area m-b30">
                            <div className="grid-area">
                                <h6 className="mb-0 m-l20">Search result for "{searchString}"</h6>
                            </div>
                            <div className="category align-items-center">
                                <p className="page-text my-3 m-r20">Showing 12 from 50 data</p>
                            </div>
                        </div>	

                        <div className="row ">
                            {products.length > 0 && products.map((product)=>(
                                <div className="col-md-12 col-sm-12">
                                    <div className="dz-shop-card style-2">
                                        <div className="dz-media">
                                            <img src={addAutoWidthTransformation(product.thumbnail)} alt="book" />
                                        </div>
                                        <div className="dz-content">
                                            <div className="dz-header">
                                                <div>
                                                    <ul className="dz-tags">
                                                        {product.categories.map((category, index) =>
                                                            <li key={category.id}>
                                                                <Link>{category.name}{index < product.categories.length - 1 && ","}</Link>
                                                            </li>
                                                        )}
                                                    </ul>
                                                    <h4 className="title mb-0"><Link to={"books-list-view-sidebar"}>{product.name}</Link></h4>
                                                </div>
                                                {product.discountAmount ?
                                                    <div className="price">
                                                        <span className="price-num text-primary">{formatCurrency(product.price - product.discountAmount)}</span>
                                                        <del>{formatCurrency(product.price)}</del>
                                                    </div>
                                                    :
                                                    <div className="price">
                                                        <span className="price-num text-primary">{formatCurrency(product.price)}</span>
                                                    </div>
                                                }
                                            </div>

                                            <div className="dz-body">
                                                <div className="dz-rating-box">
                                                    <div>
                                                        <p className="dz-para">{product.description}</p>
                                                        <div>
                                                            {product.tags.map(tag =>
                                                                <Link className="badge me-1" key={tag.id}>
                                                                    {tag.name}
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="review-num">
                                                        <h4>{product.rating.toFixed(1)}</h4>
                                                        <ul className="dz-rating">
                                                            {calculateStarRating(parseFloat(product.rating.toFixed(1)))}
                                                        </ul>
                                                        <span><Link to={"#"}> {product.reviews.length} Reviews</Link></span>
                                                    </div>
                                                </div>
                                                <div className="rate">
                                                    <ul className="book-info">
                                                        <li><span>Writen by</span>{product.author.name}</li>
                                                        <li><span>Publisher</span>{product.publisher.name}</li>
                                                        <li><span>Year</span>{product.publishYear}</li>
                                                    </ul>
                                                    <div className="d-flex">
                                                        <Link
                                                            className="btn btn-secondary btnhover btnhover2"
                                                            onClick={() => handleAddToCart(product)}
                                                        >
                                                            <i className="flaticon-shopping-cart-1 m-r10"></i>
                                                            Add to cart
                                                        </Link>
                                                        <div className="bookmark-btn style-1">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`flexCheckDefault${product.id}`}
                                                                checked={likedProductIds.includes(product.id)}
                                                                onClick={() => handleLikeButton(product.id)}
                                                            />
                                                            <label className="form-check-label" htmlFor={`flexCheckDefault${product.id}`}>
                                                                <i className="flaticon-heart"></i>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                             
                        </div>
                        <div className="row page mt-0">
                            <div className="col-12">
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                            </div>
                        </div>    
                    </div>
                </section>
                <div className="bg-white py-5">
			        <div className="container">              
                        <ClientsSlider />            
                    </div>    
                </div>                
                <section className="content-inner">
                    <div className="container">
                        <div className="row sp15">
                            <CounterSection />      
                        </div>   
                    </div>
                </section>  
                <NewsLetter />      
            </div>
        </>
    )
}
export default ShopList;
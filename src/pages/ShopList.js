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
import {useCategories} from "../contexts/CategoryContext";
import useAddToCart from "../custome-hooks/useAddToCart";
import {calculateStarRating} from "../utils/renderStarRatingUtils";
import {calculateMinAndMaxPrice} from "../utils/productVariantUtils";
import SelectVariantModal from "../components/Home/SelectVariantModal";


function ShopList(){
    const { categoryId, searchString } = useParams();

    const categories = useCategories();

    const {loadingDispatch} = useLoading();
    const { handleAddToCart } = useAddToCart();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const { likedProductIds, fetchLikedProducts  } = useUser();

    const [selectVariantModalShow, setSelectVariantModalShow] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchSearchedProducts();
    }, [categoryId, searchString, currentPage]);

    useEffect(() => {
        console.log("search string", searchString);
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

    const getCategoryName = (categoryId, categories) => {
        if (categoryId === '0') {
            return 'All Categories';
        }

        const findCategoryName = (categoryId, categories) => {
            for (const category of categories) {
                if (category.id === parseInt(categoryId)) {
                    return category.name;
                }
                if (category.subCategories.length > 0) {
                    const subCategoryName = findCategoryName(categoryId, category.subCategories);
                    if (subCategoryName) {
                        return subCategoryName;
                    }
                }
            }
            return null;
        };

        const categoryName = findCategoryName(categoryId, categories);
        return categoryName || 'Category Not Found';
    };

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

    function highlightSearchString(text, searchString) {
        if (!searchString) {
            return text; // Return the original text if searchString is empty.
        }

        // Split the text by the search string.
        const parts = text.split(new RegExp(`(${searchString})`, 'gi'));

        return parts.map((part, index) =>
            part.toLowerCase() === searchString.toLowerCase() ? (
                <span key={index} className="bg-info text-white">
                {part}
            </span>
            ) : (
                part
            )
        );
    }

    const [accordBtn, setAccordBtn] = useState();
    const [selectBtn, setSelectBtn] = useState('Newest');
    return(
        <>
            <SelectVariantModal product={selectedProduct} show={selectVariantModalShow} onHide={() => setSelectVariantModalShow(false)} />
            <div className="page-content bg-grey">
                <section className="content-inner-1 border-bottom">
                    <div className="container">
                        <div className="filter-area m-b30">
                            <div className="grid-area">
                                <h6 className="mb-0 m-l20">{searchString && `Search result for "${searchString}" from`} {getCategoryName(categoryId, categories)}</h6>
                            </div>
                            <div className="category align-items-center">
                                <p className="page-text my-3 m-r20">Showing {products.length} from {totalItems} products</p>
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
                                                    <h4 className="title mb-0"><Link to={"books-list-view-sidebar"}>{highlightSearchString(product.name, searchString)}</Link></h4>
                                                </div>
                                                {product.hasVariants ? (
                                                    <div className="price">
                                                        <span className="price-num text-primary">
                                                            {formatCurrency(calculateMinAndMaxPrice(product).minPrice)}
                                                            {` - `}
                                                            {formatCurrency(calculateMinAndMaxPrice(product).maxPrice)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    product.discountAmount ?
                                                        <div className="price">
                                                            <span className="price-num text-primary">{formatCurrency(product.price - product.discountAmount)}</span>
                                                            <del>{formatCurrency(product.price)}</del>
                                                        </div>
                                                        :
                                                        <div className="price">
                                                            <span className="price-num text-primary">{formatCurrency(product.price)}</span>
                                                        </div>
                                                )}
                                            </div>

                                            <div className="dz-body">
                                                <div className="dz-rating-box">
                                                    <div>
                                                        <p className="dz-para">{highlightSearchString(product.description, searchString)}</p>
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
                                                        {product.hasVariants ? (
                                                            <button
                                                                className="btn btn-secondary box-btn btnhover btnhover2"
                                                                onClick={async () => {
                                                                    await setSelectedProduct(product);
                                                                    setSelectVariantModalShow(true);
                                                                }}
                                                            >
                                                                <i className="flaticon-shopping-cart-1 m-r10"></i> Add to cart
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-secondary box-btn btnhover btnhover2"
                                                                onClick={() => handleAddToCart(product, 1)}
                                                            >
                                                                <i className="flaticon-shopping-cart-1 m-r10"></i> Add to cart
                                                            </button>
                                                        )}
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
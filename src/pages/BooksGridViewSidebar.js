import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Collapse, Dropdown} from 'react-bootstrap';

//Component
import ClientsSlider from '../components/Home/ClientsSlider';
import NewsLetter from '../components/NewsLetter';

//element
import CounterSection from '../elements/CounterSection';
import ShopSidebar from '../elements/ShopSidebar';

//Images
import book16 from './../assets/images/books/grid/book16.jpg';
import book8 from './../assets/images/books/grid/book8.jpg';
import book14 from './../assets/images/books/grid/book14.jpg';
import book15 from './../assets/images/books/grid/book15.jpg';
import book4 from './../assets/images/books/grid/book4.jpg';
import book9 from './../assets/images/books/grid/book9.jpg';
import book2 from './../assets/images/books/grid/book2.jpg';
import book7 from './../assets/images/books/grid/book7.jpg';
import book13 from './../assets/images/books/grid/book13.jpg';
import book10 from './../assets/images/books/grid/book10.jpg';
import book11 from './../assets/images/books/grid/book11.jpg';
import Pagination from "../components/Home/Pagination";
import {useLoading} from "../contexts/LoadingContext";
import {getProducts} from "../services/product.service";
import {addAutoWidthTransformation} from "../utils/cloudinaryUtils";
import {formatCurrency} from "../utils/currencyFormatter";
import {toast} from "react-toastify";
import {useCart} from "../contexts/CartContext";
import {useUser} from "../contexts/UserContext";
import {getLikedProducts, likeOrUnlikeProduct} from "../services/user.service";
import SelectVariantModal from "../components/Home/SelectVariantModal";
import useAddToCart from "../custome-hooks/useAddToCart";
import {calculateMinAndMaxPrice} from "../utils/productVariantUtils";
import {calculateStarRating} from "../utils/renderStarRatingUtils";


function BooksGridViewSidebar(){
    const [showSidebar, setShowSidebar] = useState(true);
    const [gridLayout, setGridLayout] = useState(true);

    const [selectVariantModalShow, setSelectVariantModalShow] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const {loadingDispatch} = useLoading();
    const { handleAddToCart } = useAddToCart();

    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [filterCriteria, setFilterCriteria] = useState({
        page: 1,
        pageSize: 12,
        minPrice: null,
        maxPrice: null,
        categoryIds: [],
        authorIds: [],
        publisherIds: [],
        publishYears: [],
        sortBy: "newest",
        searchQuery: null,
        status: 1
    });

    const { likedProductIds, fetchLikedProducts  } = useUser();

    useEffect(() => {
        fetchProducts();
    }, [filterCriteria])

    useEffect(() => {
        fetchLikedProducts();
    }, [])

    const fetchProducts = async () => {
        try {
            console.log(filterCriteria);
            loadingDispatch({type: 'START_LOADING'});
            const response = await getProducts(filterCriteria);
            setProducts(response.products);
            setTotalPages(response.totalPages);
            setTotalItems(response.totalItems);
        } catch (error) {
            console.log(error);
            setProducts([]);
            setTotalItems(0);
            setTotalPages(1);
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    const handlePageChange = (pageNumber) => {
        setFilterCriteria({...filterCriteria, page: pageNumber});
    };

    const handleSortChange = (selectedSortOption) => {
        setFilterCriteria({
            ...filterCriteria,
            sortBy: selectedSortOption,
        });
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

    return(
        <>
            <SelectVariantModal product={selectedProduct} show={selectVariantModalShow} onHide={() => setSelectVariantModalShow(false)} />
            <div className="page-content bg-grey">
                <div className="content-inner-1 border-bottom">
                    <div className="container">
                        <div className="row">
                            <div className={showSidebar ? "col-xl-3" : "d-none"}>
                                <ShopSidebar
                                    filterCriteria={filterCriteria}
                                    setFilterCriteria={setFilterCriteria}
                                    setShowSidebar={setShowSidebar}
                                />
                            </div>
                            <div className={showSidebar ? "col-xl-9" : "col-12"}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4 className="title">Products</h4>
                                    <Link
                                        className="btn btn-primary panel-btn"
                                        onClick={() => setShowSidebar(!showSidebar)}
                                    >Filter</Link>
                                </div>
                                <div className="filter-area m-b30">
                                    <div className="grid-area">
                                        <div className="shop-tab">
                                            <ul className="nav text-center product-filter justify-content-end" role="tablist">
                                                <li className="nav-item">
                                                    <Link
                                                        className={!gridLayout ? "nav-link shadow" : "nav-link"}
                                                        onClick={() => setGridLayout(false)}

                                                    >
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M3 5H21C21.2652 5 21.5196 4.89464 21.7071 4.7071C21.8946 4.51957 22 4.26521 22 4C22 3.73478 21.8946 3.48043 21.7071 3.29289C21.5196 3.10536 21.2652 3 21 3H3C2.73478 3 2.48043 3.10536 2.29289 3.29289C2.10536 3.48043 2 3.73478 2 4C2 4.26521 2.10536 4.51957 2.29289 4.7071C2.48043 4.89464 2.73478 5 3 5Z" fill="#AAAAAA"></path>
                                                        <path d="M3 13H21C21.2652 13 21.5196 12.8947 21.7071 12.7071C21.8946 12.5196 22 12.2652 22 12C22 11.7348 21.8946 11.4804 21.7071 11.2929C21.5196 11.1054 21.2652 11 21 11H3C2.73478 11 2.48043 11.1054 2.29289 11.2929C2.10536 11.4804 2 11.7348 2 12C2 12.2652 2.10536 12.5196 2.29289 12.7071C2.48043 12.8947 2.73478 13 3 13Z" fill="#AAAAAA"></path>
                                                        <path d="M3 21H21C21.2652 21 21.5196 20.8947 21.7071 20.7071C21.8946 20.5196 22 20.2652 22 20C22 19.7348 21.8946 19.4804 21.7071 19.2929C21.5196 19.1054 21.2652 19 21 19H3C2.73478 19 2.48043 19.1054 2.29289 19.2929C2.10536 19.4804 2 19.7348 2 20C2 20.2652 2.10536 20.5196 2.29289 20.7071C2.48043 20.8947 2.73478 21 3 21Z" fill="#AAAAAA"></path>
                                                        </svg>
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link
                                                        className={gridLayout ? "nav-link shadow" : "nav-link"}
                                                        onClick={() => setGridLayout(true)}
                                                    >
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M3 11H10C10.2652 11 10.5196 10.8946 10.7071 10.7071C10.8946 10.5196 11 10.2652 11 10V3C11 2.73478 10.8946 2.48043 10.7071 2.29289C10.5196 2.10536 10.2652 2 10 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V10C2 10.2652 2.10536 10.5196 2.29289 10.7071C2.48043 10.8946 2.73478 11 3 11ZM4 4H9V9H4V4Z" fill="#AAAAAA"></path>
                                                        <path d="M14 11H21C21.2652 11 21.5196 10.8946 21.7071 10.7071C21.8946 10.5196 22 10.2652 22 10V3C22 2.73478 21.8946 2.48043 21.7071 2.29289C21.5196 2.10536 21.2652 2 21 2H14C13.7348 2 13.4804 2.10536 13.2929 2.29289C13.1054 2.48043 13 2.73478 13 3V10C13 10.2652 13.1054 10.5196 13.2929 10.7071C13.4804 10.8946 13.7348 11 14 11ZM15 4H20V9H15V4Z" fill="#AAAAAA"></path>
                                                        <path d="M3 22H10C10.2652 22 10.5196 21.8946 10.7071 21.7071C10.8946 21.5196 11 21.2652 11 21V14C11 13.7348 10.8946 13.4804 10.7071 13.2929C10.5196 13.1054 10.2652 13 10 13H3C2.73478 13 2.48043 13.1054 2.29289 13.2929C2.10536 13.4804 2 13.7348 2 14V21C2 21.2652 2.10536 21.5196 2.29289 21.7071C2.48043 21.8946 2.73478 22 3 22ZM4 15H9V20H4V15Z" fill="#AAAAAA"></path>
                                                        <path d="M14 22H21C21.2652 22 21.5196 21.8946 21.7071 21.7071C21.8946 21.5196 22 21.2652 22 21V14C22 13.7348 21.8946 13.4804 21.7071 13.2929C21.5196 13.1054 21.2652 13 21 13H14C13.7348 13 13.4804 13.1054 13.2929 13.2929C13.1054 13.4804 13 13.7348 13 14V21C13 21.2652 13.1054 21.5196 13.2929 21.7071C13.4804 21.8946 13.7348 22 14 22ZM15 15H20V20H15V15Z" fill="#AAAAAA"></path>
                                                        </svg>
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link
                                                        className="nav-link"
                                                        onClick={() => setShowSidebar(!showSidebar)}
                                                    >
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M3 22H21C21.2652 22 21.5196 21.8946 21.7071 21.7071C21.8946 21.5196 22 21.2652 22 21V3C22 2.73478 21.8946 2.48043 21.7071 2.29289C21.5196 2.10536 21.2652 2 21 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V21C2 21.2652 2.10536 21.5196 2.29289 21.7071C2.48043 21.8946 2.73478 22 3 22ZM13 4H20V11H13V4ZM13 13H20V20H13V13ZM4 4H11V20H4V4Z" fill="#AAAAAA"></path>
                                                        </svg>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="category">
                                        {/*<div className="filter-category">*/}
                                        {/*    <Link to={"#"} data-bs-toggle="collapse"  */}
                                        {/*        onClick={() => setAccordBtn(!accordBtn)}*/}
                                        {/*    >*/}
                                        {/*        <i className="fas fa-list me-2"></i>*/}
                                        {/*        Categories*/}
                                        {/*    </Link>*/}
                                        {/*</div>*/}
                                        <div className="form-group">
                                            <i className="fas fa-sort-amount-down me-2 text-secondary"></i>
                                            <Dropdown>
                                                <Dropdown.Toggle className="i-false">
                                                    {filterCriteria.sortBy} <i className="ms-4 font-14 fa-solid fa-caret-down" />
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handleSortChange('newest')}>Newest</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleSortChange('oldest')}>Oldest</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleSortChange('highestdiscount')}>Highest Discount</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleSortChange('highestrating')}>Highest Rating</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleSortChange('bestseller')}>Best Seller</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                                {/*<Collapse in={accordBtn} className="acod-content">*/}
                                {/*    <div>*/}
                                {/*        <div className="widget widget_services style-2">*/}
                                {/*            {lableBlogData.map((item, ind)=>(*/}
                                {/*                <div className="form-check search-content" key={ind}>*/}
                                {/*                    <input className="form-check-input" type="checkbox" value="" id={`productCheckBox${ind+1}`} /> */}
                                {/*                    <label className="form-check-label" htmlFor={`productCheckBox${ind+1}`}>*/}
                                {/*                        {item.name}*/}
                                {/*                    </label>*/}
                                {/*                </div>*/}
                                {/*            ))}*/}
                                {/*        </div>   */}
                                {/*    </div>*/}
                                {/*</Collapse>*/}
                                {gridLayout ?
                                <div className="row book-grid-row">
                                    {products.map((product)=>(
                                        <div
                                            className={showSidebar ? "col-book style-2" : "col-book style-1"}
                                            key={product.id}
                                        >
                                            <div className="dz-shop-card style-1">
                                                <div className="dz-media">
                                                    <img src={addAutoWidthTransformation(product.thumbnail)} alt="book" style={{width: "250px", height: "357px", objectFit: "cover"}}/>
                                                </div>
                                                <div className="bookmark-btn style-2">
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
                                                <div className="dz-content">
                                                    <h5 className="title"><Link to={`/shop-detail/${product.slug}`}>{product.name}</Link></h5>
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
                                                    <ul className="dz-rating">
                                                        {calculateStarRating(parseFloat(product.rating.toFixed(1)))}
                                                    </ul>
                                                    <div className="book-footer">
                                                        {product.hasVariants ? (
                                                            <div className="price">
                                                                <span className="price-num">
                                                                    {formatCurrency(calculateMinAndMaxPrice(product).minPrice)}
                                                                    {` - `}
                                                                    {formatCurrency(calculateMinAndMaxPrice(product).maxPrice)}
                                                                </span>
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

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                :
                                <>
                                {products.map((product)=>(
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
                                                    <h4 className="title mb-0"><Link to={`/shop-detail/${product.slug}`}>{product.name}</Link></h4>
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
                                ))}
                                </>
                                }

                                <div className="row page mt-0">
                                    <div className="col-md-6">
                                        <p className="page-text">Showing {products.length} from {totalItems} data</p>
                                    </div>
                                    <div className="col-md-6">
                                        <Pagination currentPage={filterCriteria.page} totalPages={totalPages} onPageChange={handlePageChange} />
                                    </div>
                                </div>
					        </div>
                        </div>
                    </div>    
                </div>            
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
export default BooksGridViewSidebar;
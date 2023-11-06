import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import { Nav, Tab } from 'react-bootstrap';
//import {Collapse, Dropdown} from 'react-bootstrap';

//Component
import ClientsSlider from '../components/Home/ClientsSlider';
import CounterSection from '../elements/CounterSection';
import NewsLetter from '../components/NewsLetter';

//Images
import book16 from './../assets/images/books/book16.png';
import profile2 from './../assets/images/profile2.jpg';
import profile4 from './../assets/images/profile4.jpg';
import profile3 from './../assets/images/profile3.jpg';
import profile1 from './../assets/images/profile1.jpg';
import book15 from './../assets/images/books/grid/book15.jpg';
import book3 from './../assets/images/books/grid/book3.jpg';
import book5 from './../assets/images/books/grid/book5.jpg';
import avatar from "./../assets/images/avatar.png";

import {useLoading} from "../contexts/LoadingContext";
import {getProductDetail, getRelatedProducts} from "../services/product.service";
import {addAutoWidthTransformation} from "../utils/cloudinaryUtils";
import {formatCurrency} from "../utils/currencyFormatter";
import {useCart} from "../contexts/CartContext";
import {toast} from "react-toastify";
import {useUser} from "../contexts/UserContext";
import {getLikedProducts, likeOrUnlikeProduct} from "../services/user.service";
import formatDate from "../utils/datetimeFormatter";
import useAddToCart from "../custome-hooks/useAddToCart";
import useVariantSelection from "../custome-hooks/useVariantSelection";



function ShopDetail(){
    const [buy_quantity, setBuy_quantity] = useState(1);
    const { handleAddToCart } = useAddToCart();

    const { loadingDispatch } = useLoading();
    const { slug } = useParams();
    const [ product, setProduct ] = useState(null);
    const [ relatedProducts, setRelatedProducts ] = useState([]);
    const { likedProductIds, fetchLikedProducts  } = useUser();


    useEffect(() => {
        fetchProductBySlug();
    }, [slug]);

    useEffect(() => {
        fetch3RelatedProducts();
    }, [product]);

    useEffect(() => {
        fetchLikedProducts();
    }, [])

    const fetchProductBySlug = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await getProductDetail(slug);
            setProduct(response);
        } catch (error) {
            console.log(error);
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    const fetch3RelatedProducts = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await getRelatedProducts(product.id, 3);
            setRelatedProducts(response);
            console.log(response);
        } catch (error) {
            console.log(error);
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

    // -------------------------- Handle variants selection --------------------------
    const { selectedAttributes, selectedVariant, handleAttributeChange } = useVariantSelection(product);


    return(
        <>
            <div className="page-content bg-grey">
                <section className="content-inner-1">
                    <div className="container">
                        <div className="row book-grid-row style-4 m-b60">
                            <div className="col">
                                {product &&
                                <div className="dz-box">
                                    <div className="dz-media">
                                        <img src={addAutoWidthTransformation(product.thumbnail)} alt="book" />
                                    </div>
                                    <div className="dz-content">
                                        <div className="dz-header">
                                            <h3 className="title mb-0">{product.name}</h3>
                                            <ul className="dz-tags text-uppercase mb-1" style={{overflowX: "hidden", whiteSpace: "nowrap", display: "block" }}>
                                                {product.categories.map((category, index) =>
                                                    <li
                                                        key={category.id}
                                                        className="d-inline-block m-r5"
                                                    >
                                                        <Link>{category.name}{index < product.categories.length - 1 && ","}</Link>
                                                    </li>
                                                )}
                                            </ul>
                                            <div className="shop-item-rating">
                                                <div
                                                    className="d-lg-flex d-sm-inline-flex d-flex align-items-center">
                                                    <ul className="dz-rating">
                                                        {calculateStarRating(parseFloat(product.rating.toFixed(1)))}
                                                    </ul>
                                                    <h6 className="m-b0">{product.rating.toFixed(1)}</h6>
                                                </div>
                                                <div className="social-area">
                                                    <ul className="dz-social-icon style-3">
                                                        <li className="me-2"><a
                                                            href="https://www.facebook.com/dexignzone"
                                                            target="_blank" rel="noreferrer"><i
                                                            className="fa-brands fa-facebook-f"></i></a></li>
                                                        <li className="me-2"><a
                                                            href="https://twitter.com/dexignzones" target="_blank"
                                                            rel="noreferrer"><i
                                                            className="fa-brands fa-twitter"></i></a></li>
                                                        <li className="me-2"><a href="https://www.whatsapp.com/"
                                                                                target="_blank" rel="noreferrer"><i
                                                            className="fa-brands fa-whatsapp"></i></a></li>
                                                        <li><a href="https://www.google.com/intl/en-GB/gmail/about/"
                                                               target="_blank" rel="noreferrer"><i
                                                            className="fa-solid fa-envelope"></i></a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dz-body">
                                            <div className="book-detail">
                                                <ul className="book-info">
                                                    <li>
                                                        <div className="writer-info">
                                                            <img src={addAutoWidthTransformation(product.author.avatar)} alt="book" />
                                                            <div>
                                                                <span>Writen by</span>{product.author.name}
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li><span>Publisher</span>{product.publisher.name}</li>
                                                    <li><span>Year</span>{product.publishYear}</li>
                                                </ul>
                                            </div>
                                            <p className="text-1">{product.description}</p>
                                            {/*<p className="text-2"></p>*/}

                                            {/* --- Display variant if product has variants ---- */}
                                            {product.hasVariants && product.productAttributes.map((attribute) => (
                                                <div key={attribute.id} className="mb-3">
                                                    <p className="mb-1 fw-bold">{attribute.name}</p>
                                                    {attribute.attributeValues.map((value) => (
                                                        <label key={value.id} htmlFor={value.value} className="product-variant-label m-r15">
                                                            <input
                                                                type="radio"
                                                                className="product-variant-radio form-check-input mt-0 m-r10"
                                                                id={value.value}
                                                                name={attribute.name}
                                                                value={value.id}
                                                                checked={selectedAttributes[attribute.id] === value.id}
                                                                onChange={() => handleAttributeChange(attribute.id, value.id)}
                                                            />
                                                            {value.value}
                                                        </label>
                                                    ))}
                                                </div>
                                            ))}

                                            <div className="book-footer">
                                                {product.hasVariants && selectedVariant ? (
                                                    selectedVariant.discountAmount ?
                                                        <div className="price">
                                                            <h5>{formatCurrency(selectedVariant.price - selectedVariant.discountAmount)}</h5>
                                                            <p className="p-lr10">{formatCurrency(selectedVariant.price)}</p>
                                                        </div>
                                                        :
                                                        <div className="price">
                                                            <h5>{formatCurrency(selectedVariant.price)}</h5>
                                                        </div>
                                                ) : (
                                                    product.discountAmount ?
                                                        <div className="price">
                                                            <h5>{formatCurrency(product.price - product.discountAmount)}</h5>
                                                            <p className="p-lr10">{formatCurrency(product.price)}</p>
                                                        </div>
                                                        :
                                                        <div className="price">
                                                            <h5>{formatCurrency(product.price)}</h5>
                                                        </div>
                                                )}

                                                <div className="product-num">
                                                    {!product.hasVariants && product.quantity > 0 &&
                                                        <>
                                                        <div className="quantity btn-quantity style-1 me-3">
                                                            <button
                                                                className="btn btn-plus"
                                                                type="button"
                                                                onClick={() => {
                                                                    if (buy_quantity < product.quantity) {
                                                                        setBuy_quantity(buy_quantity + 1);
                                                                    }
                                                                }}
                                                            >
                                                                <i className="ti-plus"></i>
                                                            </button>
                                                            <input
                                                                className="quantity-input"
                                                                type="text"
                                                                value={buy_quantity}
                                                                name="demo_vertical2"
                                                            />
                                                            <button
                                                                className="btn btn-minus"
                                                                type="button"
                                                                onClick={() => {
                                                                    if (buy_quantity > 1) {
                                                                        setBuy_quantity(buy_quantity - 1);
                                                                    }
                                                                }}
                                                            >
                                                                <i className="ti-minus"></i>
                                                            </button>
                                                        </div>
                                                        <Link onClick={() => handleAddToCart(product, buy_quantity)}
                                                        className="btn btn-primary btnhover btnhover2"><i
                                                        className="flaticon-shopping-cart-1"></i>
                                                        <span>Add to cart</span>
                                                        </Link>
                                                        </>
                                                    }
                                                    {product.hasVariants && selectedVariant && selectedVariant.quantity > 0 &&
                                                        <>
                                                            <div className="quantity btn-quantity style-1 me-3">
                                                                <button
                                                                    className="btn btn-plus"
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (buy_quantity < product.quantity) {
                                                                            setBuy_quantity(buy_quantity + 1);
                                                                        }
                                                                    }}
                                                                >
                                                                    <i className="ti-plus"></i>
                                                                </button>
                                                                <input
                                                                    className="quantity-input"
                                                                    type="text"
                                                                    value={buy_quantity}
                                                                    name="demo_vertical2"
                                                                />
                                                                <button
                                                                    className="btn btn-minus"
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (buy_quantity > 1) {
                                                                            setBuy_quantity(buy_quantity - 1);
                                                                        }
                                                                    }}
                                                                >
                                                                    <i className="ti-minus"></i>
                                                                </button>
                                                            </div>
                                                            <Link onClick={() => handleAddToCart(selectedVariant, buy_quantity)}
                                                                  className="btn btn-primary btnhover btnhover2"><i
                                                                className="flaticon-shopping-cart-1"></i>
                                                                <span>Add to cart</span>
                                                            </Link>
                                                        </>
                                                    }
                                                    <div className="bookmark-btn style-1 d-none d-sm-block">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="flexCheckDefault1"
                                                            checked={likedProductIds.includes(product.id)}
                                                            onClick={() => handleLikeButton(product.id)}
                                                        />
                                                        <label className="form-check-label"
                                                               htmlFor="flexCheckDefault1">
                                                            <i className="flaticon-heart"></i>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <table className="table table-borderless mt-5" style={{fontSize: "0.9rem"}}>
                                                <tbody>
                                                <tr className="tags border-0" >
                                                    <th className="px-0 py-1 fw-normal">VAT: </th>
                                                    <td className="px-0 py-1">
                                                        {product.hasVariants ? (
                                                            selectedVariant ? selectedVariant.vatRate + "% (Not include in price)" : "N/A"
                                                        ) : (
                                                            product.vatRate + "% (Not include in price)"
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr className="tags border-0" >
                                                    <th className="px-0 py-1 fw-normal">Stock: </th>
                                                    <td className="px-0 py-1">
                                                        {product.hasVariants ? (
                                                            selectedVariant && selectedVariant.quantity > 0 ? selectedVariant.quantity + " product(s) in stock" : "(Out of stock)"
                                                        ) : (
                                                            product.quantity > 0 ? product.quantity + " product(s) in stock" : "(Out of stock)"
                                                        )}
                                                    </td>
                                                </tr>

                                                <tr className="tags border-0" >
                                                    <th className="px-0 py-1 fw-normal">Tags: </th>
                                                    <td className="px-0 py-1">
                                                        {product.tags.map(tag =>
                                                            <Link to={"#"} className="badge me-1">{tag.name}</Link>
                                                        )}
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-8">
                                <Tab.Container defaultActiveKey="details">
                                    <div className="product-description tabs-site-button">
                                        <Nav as="ul" className="nav nav-tabs">
                                            <Nav.Item as="li"><Nav.Link  eventKey="details">Details Product</Nav.Link></Nav.Item>
                                            <Nav.Item as="li"><Nav.Link  eventKey="review">Customer Reviews</Nav.Link></Nav.Item>
                                        </Nav>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="details">
                                                {product &&
                                                    <div dangerouslySetInnerHTML={{ __html: product.detail }} />
                                                }
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="review">
                                                <div className="clear" id="comment-list">
                                                    <div className="post-comments comments-area style-1 clearfix">
                                                        <h4 className="comments-title">{product && product.reviews.length} REVIEWS</h4>
                                                        <div id="comment">
                                                            <ol className="comment-list">
                                                                {product && product.reviews.map(review =>
                                                                    <li className="comment odd alt thread-even depth-1 comment">
                                                                        <div className="comment-body">
                                                                            <ul className="dz-rating mb-1">
                                                                                {calculateStarRating(parseFloat(review.rating.toFixed(1)))}
                                                                            </ul>
                                                                            <div className="comment-author vcard">
                                                                                <img src={review.avatar ? addAutoWidthTransformation(review.avatar) : avatar} alt="" className="avatar border"/>
                                                                                <cite className="fn mb-1">
                                                                                    {review.fname} {review.lname}
                                                                                    <span className="font-12 text-primary fw-normal m-l10">at {formatDate(review.createdAt).formattedDate}</span>
                                                                                </cite>
                                                                            </div>
                                                                            <div className="comment-content dlab-page-text">
                                                                                <p>{review.comment}</p>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                )}

                                                            </ol>
                                                        </div>
                                                        {/*<div className="default-form comment-respond style-1" id="respond">*/}
                                                        {/*    <h4 className="comment-reply-title" id="reply-title">LEAVE A REPLY */}
                                                        {/*        <small> */}
                                                        {/*            <Link to={"#"} rel="nofollow" id="cancel-comment-reply-link" style={{display:"none"}}>Cancel reply</Link> */}
                                                        {/*        </small>*/}
                                                        {/*    </h4>*/}
                                                        {/*    <div className="clearfix">*/}
                                                        {/*        <form method="post" id="comments_form" className="comment-form" novalidate>*/}
                                                        {/*            <p className="comment-form-author"><input id="name" placeholder="Author" name="author" type="text" value="" /></p>*/}
                                                        {/*            <p className="comment-form-email">*/}
                                                        {/*                <input id="email" required="required" placeholder="Email" name="email" type="email" value="" />*/}
                                                        {/*            </p>*/}
                                                        {/*            <p className="comment-form-comment">*/}
                                                        {/*                <textarea id="comments" placeholder="Type Comment Here" className="form-control4" name="comment" cols="45" rows="3" required="required"></textarea>*/}
                                                        {/*            </p>*/}
                                                        {/*            <p className="col-md-12 col-sm-12 col-xs-12 form-submit">*/}
                                                        {/*                <button id="submit" type="submit" className="submit btn btn-primary filled">*/}
                                                        {/*                Submit Now <i className="fa fa-angle-right m-l10"></i>*/}
                                                        {/*                </button>*/}
                                                        {/*            </p>*/}
                                                        {/*        </form>*/}
                                                        {/*    </div>*/}
                                                        {/*</div>*/}
                                                    </div>
                                                </div>
                                                
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </div>
                                </Tab.Container>   
                            </div>
                            <div className="col-xl-4 mt-5 mt-xl-0">
                                <div className="widget">
                                    <h4 className="widget-title">Related Products</h4>
                                    <div className="row">
                                        {relatedProducts.length > 0 && relatedProducts.map((product)=>(
                                            <div className="col-xl-12 col-lg-6" key={product.id}>
                                                <div className="dz-shop-card style-5">
                                                    <div className="dz-media">
                                                        <img src={addAutoWidthTransformation(product.thumbnail)} alt="" />
                                                    </div>
                                                    <div className="dz-content">
                                                        <h5 className="subtitle">{product.name}</h5>
                                                        <ul className="dz-tags text-uppercase" style={{overflow: "hidden", whiteSpace: "nowrap", display: "block", maxWidth: "200px"}}>
                                                            {product.categories.map((category, index) =>
                                                                <li
                                                                    key={category.id} className="d-inline-block">
                                                                    {category.name}{index < product.categories.length - 1 && ","}
                                                                </li>
                                                            )}
                                                        </ul>
                                                        {product.discountAmount ?
                                                            <div className="price">
                                                                <span className="price-num">{formatCurrency(product.price - product.discountAmount)}</span>
                                                                <del>{formatCurrency(product.price)}</del>
                                                            </div>
                                                            :
                                                            <div className="price">
                                                                <span className="price-num">{formatCurrency(product.price)}</span>
                                                            </div>
                                                        }
                                                        <Link
                                                            className="btn btn-outline-primary btn-sm btnhover btnhover2"
                                                            onClick={() => handleAddToCart(product, 1)}
                                                        >
                                                            <i className="flaticon-shopping-cart-1 me-2"></i> Add to cart
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>   
                                        ))}

                                        
                                    </div>
                                </div>
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
export default ShopDetail;
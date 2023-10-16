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
import {useLoading} from "../contexts/LoadingContext";
import {getProductDetail} from "../services/product.service";
import {addAutoWidthTransformation} from "../utils/cloudinaryUtils";
import {formatCurrency} from "../utils/currencyFormatter";
import {useCart} from "../contexts/CartContext";
import {toast} from "react-toastify";

const tableDetail = [
    {tablehead:'Book Title', tabledata:'Think and Grow Rich'},
    {tablehead:'Author', tabledata:'Napoleon Rich'},
    {tablehead:'ISBN', tabledata:'121341381648 (ISBN13: 121341381648)'},
    {tablehead:'Ediiton Language', tabledata:'English'},
    {tablehead:'Book Format', tabledata:'Paperback, 450 Pages'},
    {tablehead:'Date Published', tabledata:'August 10th 2019'},
    {tablehead:'Publisher', tabledata:'Wepress Inc.'},
    {tablehead:'Pages', tabledata:'520'},
    {tablehead:'Lesson', tabledata:'7'},
    {tablehead:'Topic', tabledata:'360'},
];

const relatedBook = [
    {image:book15, title:'Terrible Madness' },
    {image:book3,  title:'Battle Drive' },
    {image:book5,  title:'Terrible Madness' },
];

function CommentBlog({title, image}){
    return(
        <>
            <div className="comment-body" id="div-comment-3">
                <div className="comment-author vcard">
                    <img src={image} alt="" className="avatar"/>
                    <cite className="fn">{title}</cite> <span className="says">says:</span>
                    <div className="comment-meta">
                        <Link to={"#"}>December 28, 2022 at 6:14 am</Link>
                    </div>
                </div>
                <div className="comment-content dlab-page-text">
                    <p>Donec suscipit porta lorem eget condimentum. Morbi vitae mauris in leo venenatis varius. Aliquam nunc enim, egestas ac dui in, aliquam vulputate erat.</p>
                </div>
                <div className="reply">
                    <Link to={"#"} className="comment-reply-link"><i className="fa fa-reply"></i> Reply</Link>
                </div>
            </div>
        </>
    )
}

function ShopDetail(){
    const [buy_quantity, setBuy_quantity] = useState(1);
    const { cartDispatch } = useCart();

    const { loadingDispatch } = useLoading();
    const { slug } = useParams();
    const [ product, setProduct ] = useState(null);


    useEffect(() => {
        fetchProductBySlug();
    }, [slug]);

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
    const handleAddToCart = () => {
        if (buy_quantity <= 0 || buy_quantity > product.quantity) {
            toast.error('Not enough quantity!');
            return;
        }

        loadingDispatch({type: 'START_LOADING'});
        // Create a new product object with the selectedGift and buy_quantity
        const productToAdd = {
            ...product,
            buy_quantity: buy_quantity,
        };
        // Dispatch the ADD_TO_CART action with the product
        cartDispatch({ type: 'ADD_TO_CART', payload: { product: productToAdd } });
        toast.success('Add to Cart!');
        loadingDispatch({type: 'STOP_LOADING'});
    };

    
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
                                            <h3 className="title">{product.name}</h3>
                                            <div className="shop-item-rating">
                                                <div
                                                    className="d-lg-flex d-sm-inline-flex d-flex align-items-center">
                                                    <ul className="dz-rating">
                                                        <li><i className="flaticon-star text-yellow"></i></li>
                                                        <li><i className="flaticon-star text-yellow"></i></li>
                                                        <li><i className="flaticon-star text-yellow"></i></li>
                                                        <li><i className="flaticon-star text-yellow"></i></li>
                                                        <li><i className="flaticon-star text-muted"></i></li>
                                                    </ul>
                                                    <h6 className="m-b0">4.0</h6>
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

                                            <div className="book-footer">
                                                {product.discountAmount ?
                                                    <div className="price">
                                                        <h5>{formatCurrency(product.price - product.discountAmount)}</h5>
                                                        <p className="p-lr10">{formatCurrency(product.price)}</p>
                                                    </div>
                                                :
                                                    <div className="price">
                                                        <h5>{formatCurrency(product.price)}</h5>
                                                    </div>
                                                }
                                                <div className="product-num">
                                                    {product.quantity > 0 &&
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
                                                        <Link onClick={handleAddToCart}
                                                        className="btn btn-primary btnhover btnhover2"><i
                                                        className="flaticon-shopping-cart-1"></i>
                                                        <span>Add to cart</span>
                                                        </Link>
                                                        </>
                                                    }
                                                    <div className="bookmark-btn style-1 d-none d-sm-block">
                                                        <input className="form-check-input" type="checkbox"
                                                               id="flexCheckDefault1"/>
                                                        <label className="form-check-label"
                                                               htmlFor="flexCheckDefault1">
                                                            <i className="flaticon-heart"></i>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <table className="table table-borderless mt-4" style={{fontSize: "0.9rem"}}>
                                                <tbody>
                                                <tr className="tags border-0" >
                                                    <th className="p-0 fw-normal">Categories: </th>
                                                    <td className="p-0">
                                                        {product.categories.map((c, index) =>
                                                            <Link key={c.id} to={"#"} className="me-1 text-uppercase">{c.name}{index < product.categories.length-1 ? ", " : " "}</Link>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr className="tags border-0" >
                                                    <th className="p-0 fw-normal">Quantity: </th>
                                                    <td className="p-0">
                                                        {product.quantity} product(s)
                                                    </td>
                                                </tr>
                                                <tr className="tags border-0" >
                                                    <th className="p-0 fw-normal">SKU: </th>
                                                    <td className="p-0">
                                                        N/A
                                                    </td>
                                                </tr>
                                                <tr className="tags border-0" >
                                                    <th className="p-0 fw-normal">Tags: </th>
                                                    <td className="p-0">
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
                                                        <h4 className="comments-title">4 COMMENTS</h4>
                                                        <div id="comment">
                                                            <ol className="comment-list">
                                                                <li className="comment even thread-even depth-1 comment" id="comment-2">
                                                                    <CommentBlog  title="Michel Poe"  image={profile4} /> 
                                                                    <ol className="children">
                                                                        <li className="comment byuser comment-author-w3itexpertsuser bypostauthor odd alt depth-2 comment" id="comment-3">
                                                                            <CommentBlog  title="Celesto Anderson"  image={profile3} /> 
                                                                        </li>
                                                                    </ol>
                                                                </li>
                                                                <li className="comment even thread-odd thread-alt depth-1 comment" id="comment-4">
                                                                    <CommentBlog  title="Ryan"  image={profile2} />
                                                                </li>
                                                                <li className="comment odd alt thread-even depth-1 comment" id="comment-5">
                                                                    <CommentBlog  title="Stuart"  image={profile1} />
                                                                </li>
                                                            </ol>
                                                        </div>
                                                        <div className="default-form comment-respond style-1" id="respond">
                                                            <h4 className="comment-reply-title" id="reply-title">LEAVE A REPLY 
                                                                <small> 
                                                                    <Link to={"#"} rel="nofollow" id="cancel-comment-reply-link" style={{display:"none"}}>Cancel reply</Link> 
                                                                </small>
                                                            </h4>
                                                            <div className="clearfix">
                                                                <form method="post" id="comments_form" className="comment-form" novalidate>
                                                                    <p className="comment-form-author"><input id="name" placeholder="Author" name="author" type="text" value="" /></p>
                                                                    <p className="comment-form-email">
                                                                        <input id="email" required="required" placeholder="Email" name="email" type="email" value="" />
                                                                    </p>
                                                                    <p className="comment-form-comment">
                                                                        <textarea id="comments" placeholder="Type Comment Here" className="form-control4" name="comment" cols="45" rows="3" required="required"></textarea>
                                                                    </p>
                                                                    <p className="col-md-12 col-sm-12 col-xs-12 form-submit">
                                                                        <button id="submit" type="submit" className="submit btn btn-primary filled">
                                                                        Submit Now <i className="fa fa-angle-right m-l10"></i>
                                                                        </button>
                                                                    </p>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </div>
                                </Tab.Container>   
                            </div>
                            <div className="col-xl-4 mt-5 mt-xl-0">
                                <div className="widget">
                                    <h4 className="widget-title">Related Books</h4>
                                    <div className="row">
                                        {relatedBook.map((data, index)=>(
                                            <div className="col-xl-12 col-lg-6" key={index}>
                                                <div className="dz-shop-card style-5">
                                                    <div className="dz-media">
                                                        <img src={data.image} alt="" /> 
                                                    </div>
                                                    <div className="dz-content">
                                                        <h5 className="subtitle">{data.title}</h5>
                                                        <ul className="dz-tags">
                                                            <li>THRILLE,</li>
                                                            <li>DRAMA,</li>
                                                            <li>HORROR</li>
                                                        </ul>
                                                        <div className="price">
                                                            <span className="price-num">$45.4</span>
                                                            <del>$98.4</del>
                                                        </div>
                                                        <Link to={"shop-cart"} className="btn btn-outline-primary btn-sm btnhover btnhover2"><i className="flaticon-shopping-cart-1 me-2"></i> Add to cart</Link>
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
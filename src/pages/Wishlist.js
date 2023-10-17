import React,{useState} from 'react';
import {Link} from 'react-router-dom';

//images
import book3 from './../assets/images/books/grid/book3.jpg';
import book2 from './../assets/images/books/grid/book2.jpg';
import book4 from './../assets/images/books/grid/book4.jpg';
import book1 from './../assets/images/books/grid/book1.jpg';
import book6 from './../assets/images/books/grid/book6.jpg';
import book5 from './../assets/images/books/grid/book5.jpg';
//Components 
import PageTitle from './../layouts/PageTitle';
import {useUser} from "../contexts/UserContext";
import {useLoading} from "../contexts/LoadingContext";
import {getCategories} from "../services/category.service";
import {getLikedProducts} from "../services/user.service";
import {addAutoWidthTransformation} from "../utils/cloudinaryUtils";
import {formatCurrency} from "../utils/currencyFormatter";

const wishListData = [
    {id:'1', image: book1, title: 'Prduct Item 1', price:'28.00', number: 1},
    {id:'2', image: book2, title: 'Prduct Item 2', price:'28.00', number: 1},
    {id:'3', image: book3, title: 'Prduct Item 3', price:'28.00', number: 1},
    {id:'4', image: book4, title: 'Prduct Item 4', price:'28.00', number: 1},
    {id:'5', image: book5, title: 'Prduct Item 5', price:'28.00', number: 1},
    {id:'6', image: book6, title: 'Prduct Item 6', price:'28.00', number: 1},
];

function Wishlist(){
    const [wishData, setWishData] = useState(wishListData);
    const handleDeleteClick = (shopId) => {
        const newItem = [...wishData];    
        const index = wishData.findIndex((data)=> data.id === shopId);
        newItem.splice(index, 1);
        setWishData(newItem);
    }
	
	const handleNumPlus = (e) =>{
		let temp = wishData.map((data) => {
            if (e === data.id) {
                return { ...data, number: data.number + 1 };
            }
            return data;
        });
        setWishData(temp);
	}
	const handleNumMinus = (e) =>{

		let temp = wishData.map((data) => {
            if (e === data.id) {
                return { ...data, number: data.number > 0 ? data.number - 1 : data.number };
            }
            return data;
        });
        setWishData(temp);
	}


    //My own code:
    const { loadingDispatch } = useLoading();
    const { user, likedProducts, setLikedProducts } = useUser();

    const fetchLikedProducts = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await getLikedProducts();
            setLikedProducts(response);
        } catch (error) {
            setLikedProducts([]);
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }


    return(
        <>
            <div className="page-content">
                <PageTitle  parentPage="Shop" childPage="Wishlist" />
                <section className="content-inner-1">
                    {/* <!-- Product --> */}
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="table-responsive">
                                    <table className="table check-tbl">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Product name</th>
                                                <th>Unit Price</th>
                                                <th>Quantity</th>
                                                <th>Add to cart</th>
                                                <th>Close</th>
                                            </tr>
                                        </thead>
                                        {user && likedProducts.length > 0 &&
                                            <tbody>
                                            {likedProducts.map((item)=>(
                                                <tr key={item.id}>
                                                    <td className="product-item-img"><img src={addAutoWidthTransformation(item.thumbnail)} alt="" /></td>
                                                    <td className="product-item-name">{item.name}</td>
                                                    {item.discountAmount ?
                                                        <td className="product-item-price">
                                                            {formatCurrency(item.price - item.discountAmount)}
                                                            <del className="text-primary m-l10">{formatCurrency(item.price)}</del>
                                                        </td>
                                                    :
                                                        <td className="product-item-price">
                                                            {formatCurrency(item.price)}
                                                        </td>
                                                    }
                                                    <td className="product-item-quantity">
                                                        <div className="quantity btn-quantity style-1 me-3">
                                                            <button className="btn btn-plus" type="button">
                                                                <i className="ti-plus"></i>
                                                            </button>
                                                            <input type="text" className="quantity-input" value={1} />
                                                            <button className="btn btn-minus " type="button">
                                                                <i className="ti-minus"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="product-item-totle"><Link to={"shop-cart"} className="btn btn-primary btnhover">Add To Cart</Link></td>
                                                    <td className="product-item-close">
                                                        <Link className="ti-close" onClick={()=>null}></Link>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        }

                                        {user && likedProducts.length === 0 &&
                                            <tbody>
                                            <tr>
                                                <td colSpan="6" className="text-center">(Wishlist is empty)</td>
                                            </tr>
                                            </tbody>
                                        }

                                        {user == null &&
                                            <tbody>
                                            <tr>
                                                <td colSpan="6" className="text-center">
                                                    Have a account?
                                                    <Link to={"/shop-login"}> Login </Link>
                                                    or
                                                    <Link to={"/shop-registration"}> Register </Link>
                                                </td>
                                            </tr>
                                            </tbody>
                                        }

                                    </table>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    {/* <!-- Product END --> */}
                </section>
            
            </div>
        </>
    )
}
export default Wishlist;
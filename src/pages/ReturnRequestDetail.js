import React, {useEffect, useState, useRef} from 'react';
import {Link, useParams} from 'react-router-dom';

import {useUser} from "../contexts/UserContext";
import {useLoading} from "../contexts/LoadingContext";
import {getReturnRequestHistoryDetail,} from "../services/user.service";
import ProfileSidebar from "../components/Home/ProfileSidebar";
import {addAutoWidthTransformation} from "../utils/cloudinaryUtils";
import {formatCurrency} from "../utils/currencyFormatter";
import formatDate from "../utils/datetimeFormatter";


function ReturnRequestDetail(){
    const { loadingDispatch } = useLoading();
    const { id } = useParams();
    const { user } = useUser();
    const [ request, setRequest ] = useState(null);

    useEffect(() => {
        fetchReturnRequestDetail();
    }, [id])

    const fetchReturnRequestDetail = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await getReturnRequestHistoryDetail(id);
            console.log(response);
            setRequest(response);
        } catch (error) {
            console.log(error);
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    const calculateSubtotalRefund = () => {
        return request.returnProducts.reduce((total, returnProduct) => {
            return total + returnProduct.price * returnProduct.returnQuantity;
        }, 0);
    };

    const calculateVatRefund = () => {
        return request.returnProducts.reduce((total, returnProduct) => {
            return total + returnProduct.price * returnProduct.returnQuantity * returnProduct.vatRate / 100;
        }, 0);
    };

    const calculateMinusCoupon = () => {
        const couponPercentage = request.order.couponAmount
            ? (request.order.couponAmount / request.order.subtotal) * 100
            : 0;

        return calculateSubtotalRefund() * couponPercentage / 100;
    };

    return(
        <>
            {user != null &&
             <div className="page-content bg-white">
                <div className="content-block">
                    <section className="content-inner bg-white">
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-3 col-lg-4 m-b30">
                                    <ProfileSidebar user={user} />
                                </div>
                                <div className="col-xl-9 col-lg-8 m-b30">
                                    <div className="shop-bx shop-profile">
                                        <div className="shop-bx-title clearfix">
                                            <h5 className="text-uppercase">Return Request · Return Request Detail</h5>
                                        </div>
                                        {request &&
                                        <>
                                            {request.status <= 3 &&
                                            <div className="row mx-0 mb-2 order-tracking-container" id="return-request-tracking-container">
                                                <div className="col-12 hh-grayBox pt45 pb20">
                                                    <div className="row justify-content-between">
                                                        <div className={`order-tracking ${request.status >= 0 && "completed"}`}>
                                                            <span className="is-complete"></span>
                                                            <p>
                                                                Pending<br/>
                                                                {request.status === 0 &&
                                                                    <span className="text-black-50">
                                                                        {formatDate(request.updatedAt ? request.updatedAt : request.createdAt).formattedDate}
                                                                    </span>
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className={`order-tracking ${request.status >= 1 && "completed"}`}>
                                                            <span className="is-complete"></span>
                                                            <p>
                                                                Confirmed<br/>
                                                                {request.status === 1 &&
                                                                    <span className="text-black-50">
                                                                        {formatDate(request.updatedAt ? request.updatedAt : request.createdAt).formattedDate}
                                                                    </span>
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className={`order-tracking ${request.status >= 2 && "completed"}`}>
                                                            <span className="is-complete"></span>
                                                            <p>
                                                                Returning<br/>
                                                                {request.status === 2 &&
                                                                    <span className="text-black-50">
                                                                        {formatDate(request.updatedAt ? request.updatedAt : request.createdAt).formattedDate}
                                                                    </span>
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className={`order-tracking ${request.status >= 3 && "completed"}`}>
                                                            <span className="is-complete"></span>
                                                            <p>
                                                                Completed<br/>
                                                                {request.status === 3 &&
                                                                    <span className="text-black-50">
                                                                        {formatDate(request.updatedAt ? request.updatedAt : request.createdAt).formattedDate}
                                                                    </span>
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            }

                                            {request.status === 4 &&
                                                <div className="row mx-0 mb-2 order-tracking-container"  id="return-request-tracking-container-2">
                                                    <div className="col-12 hh-grayBox pt45 pb20">
                                                        <div className="row justify-content-between">
                                                            <div className={`order-tracking ${request.status >= 0 && "completed"}`}>
                                                                <span className="is-complete"></span>
                                                                <p>
                                                                    Pending<br/>
                                                                    {request.status === 0 &&
                                                                        <span className="text-black-50">
                                                                        {formatDate(request.updatedAt ? request.updatedAt : request.createdAt).formattedDate}
                                                                    </span>
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className={`order-tracking ${request.status >= 1 && "completed"}`}>
                                                                <span className="is-complete"></span>
                                                                <p>
                                                                    Declined<br/>
                                                                    {request.status === 4 &&
                                                                        <span className="text-black-50">
                                                                        {formatDate(request.updatedAt ? request.updatedAt : request.createdAt).formattedDate}
                                                                    </span>
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }

                                            {request.response &&
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="card border rounded-2 text-secondary">
                                                            <div className="card-body">
                                                                <table className="table table-borderless">
                                                                    <tbody className="">
                                                                    <tr className="py-1">
                                                                        <td className="px-0 py-3 text-muted">
                                                                            <div className="d-flex align-items-center">
                                                                                <i className="fas fa-reply me-2"></i>
                                                                                Seller Response
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-0 py-3 text-end">
                                                                            {request.response}
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="card border rounded-2 text-secondary">
                                                        <div className="card-header font-18 fw-bold border-0">
                                                            Request Info
                                                        </div>
                                                        <div className="card-body pt-0">
                                                            <table className="table table-borderless">
                                                                <tbody className="">
                                                                <tr className="border-bottom">
                                                                    <td className="px-0 py-3 text-muted">
                                                                        <div className="d-flex align-items-center">
                                                                            <i className="fas fa-hashtag me-2"></i>
                                                                            For Order
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-0 py-3 text-end fw-bold text-primary">
                                                                        {request.order.code}
                                                                    </td>
                                                                </tr>
                                                                <tr className="border-bottom">
                                                                    <td className="px-0 py-3 text-muted">
                                                                        <div className="d-flex align-items-center" style={{whiteSpace: "nowrap"}}>
                                                                            <i className="fas fa-calendar-check me-2"></i>
                                                                            Request Date
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-0 py-3 text-end">
                                                                        {formatDate(request.createdAt).formattedDate}
                                                                    </td>
                                                                </tr>
                                                                <tr className="py-1">
                                                                    <td className="px-0 py-3 text-muted">
                                                                        <div className="d-flex align-items-center">
                                                                            <i className="fas fa-undo me-2"></i>
                                                                            Reason
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-0 py-3 text-end">
                                                                        {request.returnReason}
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="card border rounded-2 text-secondary">
                                                        <div className="card-header font-18 fw-bold border-0">
                                                            Customer Info
                                                        </div>
                                                        <div className="card-body pt-0">
                                                            <table className="table table-borderless">
                                                                <tbody className="">
                                                                <tr className="border-bottom">
                                                                    <td className="px-0 py-3 text-muted">
                                                                        <div className="d-flex align-items-center">
                                                                            <i className="fas fa-user me-2"></i>
                                                                            Full Name
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-0 py-3 text-end">
                                                                        {request.order.name}
                                                                    </td>
                                                                </tr>
                                                                <tr className="py-1 border-bottom">
                                                                    <td className="px-0 py-3 text-muted">
                                                                        <div className="d-flex align-items-center">
                                                                            <i className="fas fa-phone me-2"></i>
                                                                            Phone
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-0 py-3 text-end">
                                                                        {request.order.phone}
                                                                    </td>
                                                                </tr>
                                                                <tr className="py-1">
                                                                    <td className="px-0 py-3 text-muted">
                                                                        <div className="d-flex align-items-center">
                                                                            <i className="fas fa-envelope me-2"></i>
                                                                            Email
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-0 py-3 text-end">
                                                                        {request.order.email}
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="card border rounded-2 text-secondary">
                                                        <div className="card-header font-18 fw-bold border-0">
                                                            Uploaded Images
                                                        </div>
                                                        <div className="card-body pt-0">
                                                            <div className="float-start">
                                                                {request.returnRequestImages.map(image =>
                                                                    <img src={addAutoWidthTransformation(image.url)} className="img-thumbnail m-r10 m-b10" style={{height: "200px"}}/>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="table-responsive mb-4">
                                                <table className="table check-tbl ">
                                                    <thead>
                                                    <tr>
                                                        <th>Image</th>
                                                        <th style={{width: "40%"}}>Return Product</th>
                                                        <th>Unit Price</th>
                                                        <th className="text-center">Quantity</th>
                                                        <th className="text-center">Total</th>
                                                        <th className="text-end">VAT</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {request.returnProducts == null ?
                                                        <tr>
                                                            <td colSpan="6" className="text-center">(Your order is empty)</td>
                                                        </tr>
                                                        :
                                                        <>
                                                            {request.returnProducts.map((product)=>(
                                                                <tr key={product.productId}>
                                                                    <td className="product-item-img"><img src={addAutoWidthTransformation(product.productThumbnail)} alt="" /></td>
                                                                    <td className="product-item-name">
                                                                        {product.productName}
                                                                        {product.productVariantAttributeValues.length > 0 &&
                                                                            <p className="font-13 fw-normal text-primary my-0">{product.productVariantAttributeValues.map(attr => attr.attributeName + ": " + attr.attributeValue).join(' | ')}</p>
                                                                        }
                                                                    </td>
                                                                    <td className="product-item-price">
                                                                        {formatCurrency(product.price)}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {product.returnQuantity}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {formatCurrency(product.price * product.returnQuantity)}
                                                                    </td>
                                                                    <td className="text-end">
                                                                        {product.vatRate}%
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </>
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="row justify-content-end mb-3">
                                                <div className="col-md-6">
                                                    <div className="widget">
                                                        <h4 className="widget-title fw-normal font-17">Refund Total</h4>
                                                        <table className="table-borderless check-tbl m-b25">
                                                            <tbody>
                                                            <tr>
                                                                <td className="">Subtotal </td>
                                                                <td className="text-end">{formatCurrency(calculateSubtotalRefund())}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>VAT </td>
                                                                <td className="text-end">{formatCurrency(calculateVatRefund())}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="">
                                                                    Minus Coupon
                                                                </td>
                                                                <td className="text-end">
                                                                    - {formatCurrency(calculateMinusCoupon())}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="fw-bold">Refund Total</td>
                                                                <td className="text-end fw-bold">{formatCurrency(request.refundAmount)}</td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                        }
                                    </div>    
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
             </div>
            }
        </>
    )
}
export default ReturnRequestDetail;






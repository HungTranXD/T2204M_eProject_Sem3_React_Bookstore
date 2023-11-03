import formatDate from "../../utils/datetimeFormatter";
import {addAutoWidthTransformation} from "../../utils/cloudinaryUtils";
import {formatCurrency} from "../../utils/currencyFormatter";
import React, {useState} from "react";
import ReviewProductModal from "./ReviewProductModal";
import {Link} from "react-router-dom";

function OrderDetail({order, fetchOrderDetail}) {
    const [reviewModalShow, setReviewModalShow] = useState(false);
    const [selectedProductToReview, setSelectedProductToReview] = useState(null);

    const handleClickReviewButton = async (product) => {
        await setSelectedProductToReview(product);
        setReviewModalShow(true);
    }

    return (
        <>
            {order.status <= 5 &&
                <div className="row mx-0 mb-2 order-tracking-container">
                    <div className="col-12 hh-grayBox pt45 pb20">
                        <div className="row justify-content-between">
                            <div
                                className={`order-tracking ${order.status >= 0 && "completed"}`}>
                                <span className="is-complete"></span>
                                <p>
                                    Pending<br/>
                                    {order.status === 0 &&
                                        <span className="text-black-50">
                                            {formatDate(order.updatedAt ? order.updatedAt : order.createdAt).formattedDate}
                                        </span>
                                    }
                                </p>
                            </div>
                            <div
                                className={`order-tracking ${order.status >= 1 && "completed"}`}>
                                <span className="is-complete"></span>
                                <p>
                                    Confirmed<br/>
                                    {order.status === 1 &&
                                        <span className="text-black-50">
                                            {formatDate(order.updatedAt ? order.updatedAt : order.createdAt).formattedDate}
                                        </span>
                                    }
                                </p>
                            </div>
                            <div
                                className={`order-tracking ${order.status >= 2 && "completed"}`}>
                                <span className="is-complete"></span>
                                <p>
                                    Preparing<br/>
                                    {order.status === 2 &&
                                    <span className="text-black-50">
                                        {formatDate(order.updatedAt ? order.updatedAt : order.createdAt).formattedDate}
                                    </span>
                                    }
                                </p>
                            </div>
                            <div
                                className={`order-tracking ${order.status >= 3 && "completed"}`}>
                                <span className="is-complete"></span>
                                <p>
                                    Shipping<br/>
                                    {order.status === 3 &&
                                        <span className="text-black-50">
                                            {formatDate(order.updatedAt ? order.updatedAt : order.createdAt).formattedDate}
                                        </span>
                                    }
                                </p>
                            </div>
                            <div
                                className={`order-tracking ${order.status >= 4 && "completed"}`}>
                                <span className="is-complete"></span>
                                <p>
                                    Delivered<br/>
                                    {order.status === 4 &&
                                        <span className="text-black-50">
                                            {formatDate(order.updatedAt ? order.updatedAt : order.createdAt).formattedDate}
                                        </span>
                                    }
                                    {order.status < 4 && order.deliveryEstimate &&
                                        <span className="text-black-50">
                                            {formatDate(order.deliveryEstimate).formattedDate}
                                        </span>
                                    }
                                </p>
                            </div>
                            <div
                                className={`order-tracking ${order.status >= 5 && "completed"}`}>
                                <span className="is-complete"></span>
                                <p>
                                    Completed<br/>
                                    {order.status === 5 &&
                                        <span className="text-black-50">
                                            {formatDate(order.updatedAt ? order.updatedAt : order.createdAt).formattedDate}
                                        </span>
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {order.status === 6 &&
                <div className="card border rounded-2 text-secondary">
                    <div className="card-header font-16 border-0">
                        <span className="text-white bg-danger rounded-2 p-2">Order Canceled</span>
                    </div>
                    <div className="card-body pt-0">
                        <table className="table table-borderless">
                            <tbody className="">
                            <tr className="border-bottom">
                                <td className="px-0 py-3 text-muted">
                                    <div className="d-flex align-items-center">
                                        <i className="fas fa-calendar-times me-2"></i>
                                        Cancel Date
                                    </div>
                                </td>
                                <td className="px-0 py-3 text-end">
                                    {formatDate(order.updatedAt).formattedDate} at {formatDate(order.updatedAt).time12Hour}
                                </td>
                            </tr>
                            <tr className="">
                                <td className="px-0 py-3 text-muted">
                                    <div className="d-flex align-items-center">
                                        <i className="fas fa-bookmark me-2"></i>
                                        Cancel Reason
                                    </div>
                                </td>
                                <td className="px-0 py-3 text-end">
                                    {order.cancelReason}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            }

            <div className="row">
                <div className="col-md-6">
                    <div className="card border rounded-2 text-secondary">
                        <div className="card-header font-18 fw-bold border-0">
                            Order Info
                        </div>
                        <div className="card-body pt-0">
                            <table className="table table-borderless">
                                <tbody className="">
                                <tr className="border-bottom">
                                    <td className="px-0 py-3 text-muted">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-hashtag me-2"></i>
                                            Order Code
                                        </div>
                                    </td>
                                    <td className="px-0 py-3 text-end fw-bold text-primary">
                                        {order.code}
                                    </td>
                                </tr>
                                <tr className="border-bottom">
                                    <td className="px-0 py-3 text-muted">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-calendar-check me-2"></i>
                                            Date Added
                                        </div>
                                    </td>
                                    <td className="px-0 py-3 text-end">
                                        {formatDate(order.createdAt).formattedDate}
                                    </td>
                                </tr>
                                <tr className="py-1">
                                    <td className="px-0 py-3 text-muted">
                                        <div className="d-flex align-items-center"
                                             style={{whiteSpace: "nowrap"}}>
                                            <i className="far fa-credit-card me-2"></i>
                                            Payment Method
                                        </div>
                                    </td>
                                    <td className="px-0 py-3 text-end">
                                        {order.paymentMethod}
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
                                        {order.name}
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
                                        {order.phone}
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
                                        {order.email}
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
                            Shipping Info
                        </div>
                        <div className="card-body pt-0">
                            <table className="table table-borderless">
                                <tbody className="">
                                <tr className="border-bottom">
                                    <td className="px-0 py-3 text-muted">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-map-marker-alt me-2"></i>
                                            Address
                                        </div>
                                    </td>
                                    <td className="px-0 py-3 text-end">
                                        {order.address}, {order.district}, {order.province}, {order.country}
                                    </td>
                                </tr>
                                <tr className="py-1 border-bottom">
                                    <td className="px-0 py-3 text-muted">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-shipping-fast me-2"></i>
                                            Shipping Method
                                        </div>
                                    </td>
                                    <td className="px-0 py-3 text-end">
                                        {order.deliveryService}
                                    </td>
                                </tr>
                                <tr className="py-1">
                                    <td className="px-0 py-3 text-muted">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-truck-loading me-2"></i>
                                            Expected Delivery Date
                                        </div>
                                    </td>
                                    <td className="px-0 py-3 text-end">
                                        {formatDate(order.deliveryEstimate).formattedDate}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-responsive mb-4">
                <table className="table check-tbl ">
                    <thead>
                    <tr>
                        <th>Image</th>
                        <th style={{width: "35%"}}>Product name</th>
                        <th>Unit Price</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-center">Total</th>
                        <th className="text-end">VAT</th>
                        {order.userId && order.status === 5 && !order.returnRequestId &&
                            <th className="text-end">Rating</th>
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {order.orderProducts == null ?
                        <tr>
                            <td colSpan="6" className="text-center">(Your order is
                                empty)
                            </td>
                        </tr>
                        :
                        <>
                            {order.orderProducts.map((product, index) => (
                                <tr key={product.productId}>
                                    <td className="product-item-img"><img
                                        src={addAutoWidthTransformation(product.productThumbnail)}
                                        alt=""/></td>
                                    <td className="product-item-name">{product.productName}</td>
                                    <td className="product-item-price">
                                        {formatCurrency(product.price)}
                                    </td>
                                    <td className="text-center">
                                        {product.quantity}
                                    </td>
                                    <td className="text-center">
                                        {formatCurrency(product.price * product.quantity)}
                                    </td>
                                    <td className="text-end">
                                        {product.vatRate}%
                                    </td>
                                    {order.userId && order.status === 5 && !order.returnRequestId &&
                                        <th className="text-center">
                                            <Link onClick={() => handleClickReviewButton(product)}>
                                            {product.review ? (
                                                <i className="fas fa-star text-yellow"></i>
                                            ) : (
                                                <i className="far fa-star text-muted" ></i>
                                            )}
                                            </Link>
                                        </th>
                                    }

                                </tr>
                            ))}
                            {selectedProductToReview &&
                                <ReviewProductModal show={reviewModalShow} onHide={() => setReviewModalShow(false)} product={selectedProductToReview} fetchOrderDetail={fetchOrderDetail} />
                            }
                        </>
                    }
                    </tbody>
                </table>
            </div>

            <div className="row justify-content-end mb-3">
                <div className="col-md-6">
                    <div className="widget">
                        <h4 className="widget-title fw-normal font-17">Order Total</h4>
                        <table className="table-borderless check-tbl m-b25">
                            <tbody>
                            <tr>
                                <td className="">Subtotal</td>
                                <td className="text-end ">{formatCurrency(order.subtotal)}</td>
                            </tr>
                            <tr>
                                <td className="">VAT</td>
                                <td className="text-end ">{formatCurrency(order.vat)}</td>
                            </tr>
                            <tr>
                                <td className="">Shipping</td>
                                <td className="text-end ">{formatCurrency(order.deliveryFee)}</td>
                            </tr>
                            <tr>
                                <td className="">
                                    Coupon
                                    <span className="text-primary">
                                        {order.couponAmount > 0 && ` (${order.couponCode})`}
                                    </span>
                                </td>
                                <td className="text-end ">
                                    {order.couponAmount > 0
                                        ? `- ${formatCurrency(order.couponAmount)}`
                                        : `${formatCurrency(0)}`}
                                </td>
                            </tr>
                            <tr>
                                <td className="fw-bold">Grand Total</td>
                                <td className="text-end fw-bold">{formatCurrency(order.grandTotal)}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderDetail;
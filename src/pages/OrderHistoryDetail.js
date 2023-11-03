import React, {useEffect, useState, useRef} from 'react';
import {Link, useParams} from 'react-router-dom';

import {useUser} from "../contexts/UserContext";
import {useLoading} from "../contexts/LoadingContext";
import {toast} from "react-toastify";
import {getOrderHistory, getOrderHistoryDetail, updateUserProfile} from "../services/user.service";
import ProfileSidebar from "../components/Home/ProfileSidebar";
import {addAutoWidthTransformation} from "../utils/cloudinaryUtils";
import {formatCurrency} from "../utils/currencyFormatter";
import formatDate from "../utils/datetimeFormatter";
import {cancelOrder, confirmReceivedOrder} from "../services/order.service";
import CancelOrderModal from "../components/Home/CancelOrderModal";
import CreateReturnRequestModal from "../components/Home/CreateReturnRequestModal";
import OrderDetail from "../components/Home/OrderDetail";


function OrderHistoryDetail(){
    const { loadingDispatch } = useLoading();
    const { code } = useParams();
    const { user } = useUser();
    const [ order, setOrder ] = useState([]);
    const [modalShow, setModalShow] = useState(false);


    useEffect(() => {
        fetchOrderDetail();
    }, [code])

    const fetchOrderDetail = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await getOrderHistoryDetail(code);
            setOrder(response);
        } catch (error) {
            console.log(error);
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    const handleConfirmReceivedOrder = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            await confirmReceivedOrder({
                code: order.code,
                email: order.email
            });
            fetchOrderDetail();
        } catch (error) {
            console.log(error);
            toast.error("Can not confirm this order")
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

    const isWithinThreeDays = Date.now() - new Date(order.updatedAt).getTime() <= threeDaysInMilliseconds;

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
                                            <h5 className="text-uppercase">Order History · Order Detail</h5>
                                        </div>
                                        {<>
                                            <OrderDetail order={order} fetchOrderDetail={fetchOrderDetail}/>

                                            <div className="row mb-3">

                                                {/* Case 1: If order is not ship yet (status <= 2) you can cancel order */}
                                                {order.status <= 2 &&
                                                    <div className="col-12">
                                                        <button
                                                            className="btn btn-danger w-100"
                                                            onClick={() => setModalShow(true)}
                                                        >Cancel Order
                                                        </button>
                                                        <CancelOrderModal
                                                            show={modalShow}
                                                            onHide={() => setModalShow(false)}
                                                            order={order}
                                                            fetchOrderDetail={fetchOrderDetail}
                                                        />
                                                    </div>
                                                }

                                                {/* Case 2: If order is delivered (status = 4), still within 3 days return period and now return request created yet */}
                                                {order.status === 4 && isWithinThreeDays && order.returnRequestId == null &&
                                                    <>
                                                        <div className="col-md-6">
                                                            <button
                                                                className="btn btn-outline-primary btnhover w-100"
                                                                onClick={() => setModalShow(true)}
                                                            >
                                                                Return / Refund
                                                            </button>
                                                            <span className="text-muted font-14">* You can return order within 3 days from delivered date.</span>
                                                            <CreateReturnRequestModal
                                                                show={modalShow}
                                                                onHide={() => setModalShow(false)}
                                                                order={order}
                                                                fetchOrderDetail={fetchOrderDetail}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <button
                                                                className="btn btn-primary btnhover w-100"
                                                                onClick={handleConfirmReceivedOrder}
                                                            >
                                                                Order Received
                                                            </button>
                                                        </div>
                                                    </>
                                                }

                                                {/* Case 3: A return request have been created */}
                                                {order.returnRequestId &&
                                                    <div className="col-12">
                                                        <div
                                                            className="rounded-2 border-primary d-flex justify-content-between align-items-center p-3"
                                                            style={{backgroundColor: "#eaa4511a", borderLeft: "3px solid"}}
                                                        >
                                                            <div className="text-black">
                                                                {`Your return request for this order is `}
                                                                {(() => {
                                                                    switch (order.returnRequestStatus) {
                                                                        case 0:
                                                                            return <span className='fw-bold text-warning text-uppercase'>Pending</span>;
                                                                        case 1:
                                                                            return <span className='fw-bold text-info text-uppercase'>Confirmed</span>;
                                                                        case 2:
                                                                            return <span className='fw-bold text-uppercase' style={{color: "#7239ea"}}>Returning</span>;
                                                                        case 3:
                                                                            return <span className='fw-bold text-success text-uppercase'>Completed</span>;
                                                                        case 4:
                                                                            return <span className='fw-bold text-danger text-uppercase'>Declined</span>;
                                                                        default:
                                                                            return null;
                                                                    }
                                                                })()}
                                                            </div>
                                                            <Link
                                                                to={`/return-requests/${order.returnRequestId}`}
                                                                className="btn btn-primary btnhover"
                                                            >
                                                                View detail
                                                                <i className="fas fa-chevron-right m-l10"></i>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                }
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
export default OrderHistoryDetail;






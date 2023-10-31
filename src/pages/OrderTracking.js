import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';

//Components 
import PageTitle from './../layouts/PageTitle';
import {useLoading} from "../contexts/LoadingContext";
import {toast} from "react-toastify";
import {getOrderTracking} from "../services/order.service";
import OrderDetail from "../components/Home/OrderDetail";

function OrderTracking(){
    const { loadingDispatch } = useLoading();
    const [formData, setFormData] = useState({
        code: '',
        email: '',
    });
    const [order, setOrder] = useState(null);

    const changeHandler = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        validator.showMessages();
    };

    const [validator] = React.useState(new SimpleReactValidator({
        className: 'text-danger font-13'
    }));

    const submitForm = async (e) => {
        e.preventDefault();
        if (validator.allValid()) {
            try {
                loadingDispatch({type: 'START_LOADING'});
                const response = await getOrderTracking(formData);
                console.log(response);
                setOrder(response);
            } catch (error) {
                toast.error('Not found!');
            } finally {
                loadingDispatch({type: 'STOP_LOADING'});
            }
        } else {
            toast.error('Empty field is not allowed!');
        }
    };

    return(
        <>
            <div className="page-content">
                <PageTitle  parentPage="Shop" childPage="Order Tracking" />
                <section className="content-inner shop-account">                    
                    <div className="container">
                        <div className="row justify-content-center">
                            {!order ?
                                <div className="col-lg-6 col-md-6 mb-4">
                                    <div className="login-area">
                                        <div className="tab-content nav">
                                            <form onSubmit={submitForm} className={`col-12`}>
                                                <h4 className="text-secondary">ORDER TRACKING</h4>
                                                <p className="font-weight-600">You need to enter your order's code and email address.</p>
                                                <div className="mb-4">
                                                    <label className="label-title">ORDER CODE *</label>
                                                    <input
                                                        name="code"
                                                        className="form-control"
                                                        placeholder="Your Order Code"
                                                        type="text"
                                                        value={formData.code}
                                                        onChange={(e) => changeHandler(e)}
                                                    />
                                                    {validator.message('orderCode', formData.code, 'required')}
                                                </div>
                                                <div className="mb-4">
                                                    <label className="label-title">E-MAIL *</label>
                                                    <input
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Your Email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => changeHandler(e)}
                                                    />
                                                    {validator.message('email', formData.email, 'required|email')}
                                                </div>
                                                <div className="text-left">
                                                    <button type="submit" className="btn btn-primary btnhover me-2">Submit</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            :
                                <div className="col-xl-9 col-lg-8 m-b30">
                                    <OrderDetail order={order}/>
                                </div>
                            }

                        </div>
                    </div>                    
                </section>
            </div>
        </>
    )
}
export default OrderTracking;
import React, {useEffect, useState} from 'react';
//import {Link} from 'react-router-dom';
import {Collapse, Form} from 'react-bootstrap';

//Components 
import PageTitle from './../layouts/PageTitle';

//images
import book1 from './../assets/images/books/grid/book1.jpg';
import book2 from './../assets/images/books/grid/book2.jpg';
import book3 from './../assets/images/books/grid/book3.jpg';
import book4 from './../assets/images/books/grid/book4.jpg';
import book5 from './../assets/images/books/grid/book5.jpg';
import {useLoading} from "../contexts/LoadingContext";
import {useCart} from "../contexts/CartContext";
import {useProvinces} from "../contexts/ProvinceContext";
import {addAutoWidthTransformation} from "../utils/cloudinaryUtils";
import {formatCurrency} from "../utils/currencyFormatter";
import {Link, useLocation} from "react-router-dom";
import {useUser} from "../contexts/UserContext";
import checkIcon from "../assets/images/check-icon.png";
import cancelIcon from "../assets/images/cancel-icon.png";
import formatDate from "../utils/datetimeFormatter";
import SimpleReactValidator from "simple-react-validator";
import {loginUser, registerUser} from "../services/auth.service";
import {toast} from "react-toastify";
import {postOrder} from "../services/order.service";
import {useCouponContext} from "../contexts/CouponContext";
import PaypalCheckoutButton from "../components/Home/PaypalCheckoutButton";
import OrderPaymentStatus from "../components/Home/OrderPaymentStatus";
import {useAuth} from "../contexts/AuthContext";

function ShopCheckout() {
    const [registerAccor, setRegisterAccor] = useState(false);
    const [loginAccor, setLoginAccor] = useState();

    const {user} = useUser();
    const {loadingDispatch} = useLoading();
    const {cartState} = useCart();


    // ------------------------ User login --------------------------------
    const {authDispatch} = useAuth();

    const [loginFormData, setLoginFormData] = useState({
        email: '',
        password: ''
    });

    const loginChangeHandler = (e) => {
        setLoginFormData({...loginFormData, [e.target.name]: e.target.value});
        loginValidator.showMessages();
    };

    const [loginValidator] = React.useState(new SimpleReactValidator({
        className: 'text-danger font-13'
    }));

    const submitLoginForm = async () => {
        if (loginValidator.allValid()) {
            try {
                loadingDispatch({type: 'START_LOADING'});
                const loginData = await loginUser(loginFormData);
                authDispatch({type: 'SET_TOKEN', payload: loginData.token});
                authDispatch({type: 'SET_USER', payload: loginData.user});
                toast.success('You successfully Login!');
            } catch (error) {
                toast.error('Wrong email or password!');
            } finally {
                loadingDispatch({type: 'STOP_LOADING'});
            }
        } else {
            loginValidator.showMessages();
            toast.error('Empty field is not allowed!');
        }
    };


    // ----------------- States for calculate delivery fee ---------------
    const {
        provinces,
        address, setAddress,
        selectedProvinceId, selectedDistrictId,
        setSelectedProvinceId, setSelectedDistrictId,
        selectedDeliveryServiceId, setSelectedDeliveryServiceId,
        selectedService
    } = useProvinces();

    const handleProvinceChange = (event) => {
        const selectedProvinceId = parseInt(event.target.value, 10);
        if (isNaN(selectedProvinceId)) {
            setSelectedProvinceId(null);
        } else {
            setSelectedProvinceId(selectedProvinceId);
        }
        setSelectedDistrictId(null); // Reset selected district when province changes
        setSelectedDeliveryServiceId(null); // Reset selected delivery service when province changes

        //Set the selected Province's name to formData
        const selectedProvince = provinces.find((province) => province.id === selectedProvinceId);
        setFormData({
            ...formData,
            province: (selectedProvince ? selectedProvince.name : ''),
            district: ''
        });
    };

    const handleDistrictChange = (event) => {
        const selectedDistrictId = parseInt(event.target.value, 10);
        if (isNaN(selectedDistrictId)) {
            setSelectedDistrictId(null);
        } else {
            setSelectedDistrictId(selectedDistrictId);
        }

        //Set the selected District's name to formData
        const selectedDistrict = selectedProvinceId
            ? provinces.find((province) => province.id === selectedProvinceId).districts.find((district) => district.id === selectedDistrictId)
            : null;
        setFormData({...formData, district: (selectedDistrict ? selectedDistrict.name : '')});
    };

    const handleDeliveryServiceChange = (event) => {
        const selectedDeliveryServiceId = parseInt(event.target.value, 10);
        setSelectedDeliveryServiceId(selectedDeliveryServiceId);

        //Set the selected delivery service name to formData
        const service = selectedDeliveryServiceId ?
            provinces.find((province) => province.id === selectedProvinceId).districts.find((district) => district.id === selectedDistrictId).deliveryServices.find((service) => service.id === selectedDeliveryServiceId)
            : null;
        setFormData({
            ...formData,
            deliveryService: service ? service.name : ''
        });
    }


    // ------------- States for order create form body (and create new Account) ----------------
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        // address: '',
        district: (selectedDistrictId ?
            provinces.find((province) => province.id === selectedProvinceId).districts.find((district) => district.id === selectedDistrictId).name
            :
            ''),
        province: (selectedProvinceId ?
            provinces.find((province) => province.id === selectedProvinceId).name
            :
            ''),
        deliveryService: selectedService ? selectedService.name : null,
        note: '',
        paymentMethod: '',
        //Create new account if necessary
        password: '',
        confirm_password: '',
    });

    const [createdOrder, setCreatedOrder] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);

    useEffect(() => {
        setFormData({
            ...formData,
            firstName: user ? user.fname : '',
            lastName: user ? user.lname : '',
            email: user ? user.email : '',
            phone: user ? user.phone : '',
        });
        if (user && !validator.allValid()) {
            validator.showMessages();
        }
    }, [user])

    const [validator] = React.useState(new SimpleReactValidator({
        className: 'text-danger font-13'
    }));

    const [passwordValidator] = React.useState(new SimpleReactValidator({
        className: 'text-danger font-13',
        messages: {
            in: 'The confirm password field does not match'
        }
    }));

    const changeHandler = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        validator.showMessages();
    };

    const passwordChangeHandler = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        passwordValidator.showMessages();
    };

    const handleChangeAddress = (userAddress) => {
        setSelectedProvinceId(userAddress.provinceId);
        setSelectedDistrictId(userAddress.districtId);

        //set formData
        setFormData({
            ...formData,
            // address: userAddress.address,
            province: userAddress.provinceName,
            district: userAddress.districtName,
            deliveryService: null
        });

        setAddress(userAddress.address);
    }

    const handlePaymentMethodChange = (e) => {
        const selectedPaymentMethod = e.target.value;
        setFormData({
            ...formData,
            paymentMethod: selectedPaymentMethod,
        });
    };

    const submitForm = async (e) => {
        e.preventDefault();
        if (!registerAccor) {
            // 1) ---- Customer doesn't want to create new account ----
            if (validator.allValid()) {
                try {
                    loadingDispatch({type: 'START_LOADING'});
                    // Estimate delivery date
                    const today = new Date();
                    const deliveryEstimate = new Date(today);
                    deliveryEstimate.setDate(today.getDate() + selectedService.estimatedTimeValue);

                    const orderData = {
                        name: formData.firstName + ' ' + formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                        address: address,
                        district: formData.district,
                        province: formData.province,
                        country: "Vietnam",
                        note: formData.note.trim() === '' ? null : formData.note,
                        subtotal: calculateTotal(),
                        vat: calculateVat(),
                        deliveryFee: selectedService.fee,
                        deliveryService: formData.deliveryService,
                        deliveryEstimate: deliveryEstimate.toISOString(),
                        couponCode: discountAmount > 0 ? coupon.code : null,
                        couponAmount: discountAmount > 0 ? discountAmount : null,
                        grandTotal: calculateGrandTotal(),
                        paymentMethod: formData.paymentMethod,
                        userId: user ? user.id : null,
                        orderProducts: cartState.cartItems.map((item) => ({
                            productId: item.productId ? item.productId : item.id,
                            productVariantId: item.productId ? item.id : null,
                            quantity: item.buy_quantity,
                            price: item.price - item.discountAmount,
                            vatRate: item.vatRate
                        })),
                    };
                    console.log("orderData", orderData);
                    const postResult = await postOrder(orderData);
                    console.log("postResult", postResult);
                    setCreatedOrder(postResult);
                    // If payment method is COD then set paymentStatus to true
                    if (postResult.status === 1) {
                        setPaymentStatus(true);
                    }
                } catch (error) {
                    console.error('Error creating order:', error);
                    toast.error('Can not create order!');
                } finally {
                    loadingDispatch({type: 'STOP_LOADING'});
                }
            } else {
                toast.error('Empty field is not allowed!');
            }
        } else {
            // 2) -------- Customer want to create new account --------
            if (validator.allValid() && passwordValidator.allValid()) {
                try {
                    loadingDispatch({type: 'START_LOADING'});
                    // First register new account and get the returned user's id
                    const userData = {
                        fname: formData.firstName,
                        lname: formData.lastName,
                        email: formData.email,
                        password: formData.password,
                    };
                    const registerData = await registerUser(userData);
                    authDispatch({ type: 'SET_TOKEN', payload: registerData.token });
                    authDispatch({ type: 'SET_USER', payload: registerData.user });

                    // Then create order with user's id
                    const orderData = {
                        name: formData.firstName + ' ' + formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                        address: address,
                        district: formData.district,
                        province: formData.province,
                        country: "Vietnam",
                        note: formData.note.trim() === '' ? null : formData.note,
                        subtotal: calculateTotal(),
                        vat: calculateVat(),
                        deliveryFee: selectedService.fee,
                        deliveryService: formData.deliveryService,
                        deliveryEstimate: deliveryEstimate.toISOString(),
                        couponCode: discountAmount > 0 ? coupon.code : null,
                        couponAmount: discountAmount > 0 ? discountAmount : null,
                        grandTotal: calculateGrandTotal(),
                        paymentMethod: formData.paymentMethod,
                        userId: registerData.user.id,
                        orderProducts: cartState.cartItems.map((item) => ({
                            productId: item.productId ? item.productId : item.id,
                            productVariantId: item.productId ? item.id : null,
                            quantity: item.buy_quantity,
                            price: item.price - item.discountAmount,
                            vatRate: item.vatRate
                        })),
                    };
                    console.log("orderData", orderData);
                    const postResult = await postOrder(orderData);
                    console.log("postResult", postResult);
                    setCreatedOrder(postResult);
                    // If payment method is COD then set paymentStatus to true
                    if (postResult.status === 1) {
                        setPaymentStatus(true);
                    }
                } catch (error) {
                    console.error('Error creating order:', error);
                    toast.error('Can not create order!');
                } finally {
                    loadingDispatch({type: 'STOP_LOADING'});
                }
            } else {
                toast.error('Empty field is not allowed!');
            }
        }

    };


    // ----------------- Calculate products in cart ---------------------
    const calculateSubtotal = (product) => {
        const subtotal = (product.price - (product.discountAmount || 0)) * product.buy_quantity;
        return parseFloat(subtotal.toFixed(2));
    };

    const calculateTotal = () => {
        const total = cartState.cartItems.reduce((total, product) => total + calculateSubtotal(product), 0);
        return parseFloat(total.toFixed(2));
    };

    const calculateVat = () => {
        const total = cartState.cartItems.reduce((total, product) => total + calculateSubtotal(product) * product.vatRate / 100, 0);
        return parseFloat(total.toFixed(2));
    };

    const calculateGrandTotal = () => {
        const grandTotal = calculateTotal() + calculateVat() + (selectedService ? selectedService.fee : 0) - discountAmount;
        return parseFloat(grandTotal.toFixed(2));
    };

    const canCheckout = () => {
        // Check if the cart is not empty and if all buy_quantity values are less than or equal to quantity for each product
        return (
            cartState.cartItems.length > 0 &&
            cartState.cartItems.every((product) => product.buy_quantity <= product.quantity)
        );
    };


    // ----------------------- Calculate coupon ---------------------------
    const {
        coupon,
        discountAmount
    } = useCouponContext();


    return (
        <>
            <div className="page-content">
                <PageTitle parentPage="Shop" childPage="Checkout"/>
                <section className="content-inner-1">
                    {(createdOrder == null && paymentStatus == null) &&
                        <div className="container">
                            <form className="shop-form">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6">
                                        <div className="widget">
                                            <h4 className="widget-title">Billing & Shipping Address</h4>
                                            <div className="row">
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        className="form-control"
                                                        placeholder="First Name"
                                                        value={formData.firstName}
                                                        onChange={(e) => changeHandler(e)}
                                                    />
                                                    {validator.message('firstName', formData.firstName, 'required')}
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        className="form-control"
                                                        placeholder="Last Name"
                                                        value={formData.lastName}
                                                        onChange={(e) => changeHandler(e)}
                                                    />
                                                    {validator.message('lastName', formData.lastName, 'required')}
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <input
                                                        type="text"
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Email"
                                                        value={formData.email}
                                                        onChange={(e) => changeHandler(e)}
                                                    />
                                                    {validator.message('email', formData.email, 'required|email')}
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <input
                                                        type="text"
                                                        name="phone"
                                                        className="form-control"
                                                        placeholder="Phone"
                                                        value={formData.phone}
                                                        onChange={(e) => changeHandler(e)}
                                                    />
                                                    {validator.message('phone', formData.phone, 'required|phone')}
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        className="form-control"
                                                        placeholder="Address"
                                                        value={address}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                    />
                                                    {validator.message('address', address, 'required')}
                                                </div>
                                                <div className="form-group col-lg-6">
                                                    <Form.Select
                                                        aria-label="Credit Card Type"
                                                        onChange={handleProvinceChange}
                                                        value={selectedProvinceId}
                                                    >
                                                        <option value="">Province</option>
                                                        {provinces.map(province =>
                                                            <option key={province.id} value={province.id}>
                                                                {province.name}
                                                            </option>
                                                        )}
                                                    </Form.Select>
                                                    {validator.message('province', formData.province, 'required')}
                                                </div>
                                                <div className="form-group col-lg-6">
                                                    <Form.Select
                                                        aria-label="Credit Card Type"
                                                        onChange={handleDistrictChange}
                                                        value={selectedDistrictId}
                                                    >
                                                        <option value="">District</option>
                                                        {selectedProvinceId &&
                                                            provinces.find((province) => province.id === selectedProvinceId).districts.map(district =>
                                                                <option key={district.id} value={district.id}>
                                                                    {district.name}
                                                                </option>
                                                            )
                                                        }
                                                    </Form.Select>
                                                    {validator.message('district', formData.district, 'required')}
                                                </div>
                                                <div className="form-group">
                                                <textarea
                                                    name="note"
                                                    className="form-control"
                                                    placeholder="Notes about your order, e.g. special notes for delivery"
                                                    value={formData.note}
                                                    onChange={(e) => changeHandler(e)}
                                                ></textarea>
                                                </div>

                                                {/* ------ Create new account ------- */}
                                                {user == null &&
                                                    <>
                                                        <div className="form-group">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="createNewAccount"
                                                                checked={registerAccor}
                                                                onChange={() => setRegisterAccor(!registerAccor)}
                                                            />
                                                            <label className="form-check-label m-l10"
                                                                   htmlFor="createNewAccount">
                                                                Create new account
                                                            </label>
                                                        </div>
                                                        <Collapse in={registerAccor}>
                                                            <div>
                                                                <div className="form-group">
                                                                    <input
                                                                        name="password"
                                                                        className="form-control"
                                                                        placeholder="Type Password"
                                                                        type="password"
                                                                        value={formData.password}
                                                                        onChange={(e) => passwordChangeHandler(e)}
                                                                    />
                                                                    {passwordValidator.message('password', formData.password, 'required|min:8')}
                                                                </div>
                                                                <div className="form-group">
                                                                    <input
                                                                        name="confirm_password"
                                                                        className="form-control"
                                                                        placeholder="Confirm Password"
                                                                        type="password"
                                                                        value={formData.confirm_password}
                                                                        onChange={(e) => passwordChangeHandler(e)}
                                                                    />
                                                                    {passwordValidator.message('confirm_password', formData.confirm_password, `required|min:8|in:${formData.password}`)}
                                                                </div>
                                                            </div>
                                                        </Collapse>
                                                    </>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <div className="widget">
                                            {user == null ?
                                                <>
                                                    <h4 className="widget-title">Already have an account ?</h4>
                                                    <div className="d-flex align-items-center mb-3">
                                                        <button
                                                            className="btn btn-outline-primary btnhover" type="button"
                                                            onClick={() => setLoginAccor(!loginAccor)}
                                                        >
                                                            Login now
                                                            {loginAccor ?
                                                                <i className="fas fa-chevron-up m-l10"></i>
                                                                :
                                                                <i className="fas fa-chevron-down m-l10"></i>
                                                            }

                                                        </button>
                                                    </div>
                                                    <p>You need an account to save and manage your addresses, view
                                                        orders history and review products. Login or create new account
                                                        now.</p>
                                                    <Collapse in={loginAccor}>
                                                        <div>
                                                            <div className="form-group">
                                                                <input
                                                                    name="email"
                                                                    className="form-control"
                                                                    placeholder="Your Email"
                                                                    type="email"
                                                                    value={loginFormData.email}
                                                                    onChange={(e) => loginChangeHandler(e)}
                                                                />
                                                                {loginValidator.message('email', loginFormData.email, 'required|email')}
                                                            </div>
                                                            <div className="form-group">
                                                                <input
                                                                    name="password"
                                                                    className="form-control "
                                                                    placeholder="Type Password"
                                                                    type="password"
                                                                    value={loginFormData.password}
                                                                    onChange={(e) => loginChangeHandler(e)}
                                                                />
                                                                {loginValidator.message('password', loginFormData.password, 'required|min:8')}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary btnhover me-2"
                                                                onClick={submitLoginForm}
                                                            >login
                                                            </button>
                                                        </div>
                                                    </Collapse>
                                                </>
                                                :
                                                <>
                                                    <h4 className="widget-title">Your addresses</h4>
                                                    {user.userAddresses.length > 0 ? user.userAddresses.map(address =>
                                                            <div
                                                                className="d-flex justify-content-between align-items-center rounded-2 px-3 py-3 border mb-3"
                                                                key={address.id}
                                                            >
                                                                <div
                                                                    className="d-flex justify-content-between align-items-center">
                                                                    <i className="fas fa-map-marker-alt text-primary"></i>
                                                                    <div className="ps-3">
                                                                        <div
                                                                            className="text-secondary fw-bold">{address.address}</div>
                                                                        <div className="text-secondary">
                                                                            {address.districtName}, {address.provinceName}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    className="btn btn-primary"
                                                                    type="button"
                                                                    onClick={() => handleChangeAddress(address)}
                                                                >
                                                                    Select
                                                                </button>
                                                            </div>
                                                        )
                                                        :
                                                        <p>You don't have any saved address.</p>
                                                    }
                                                    <button className="btn btn-outline-primary" type="button">
                                                        Edit your address <i className="fas fa-chevron-right m-l10"></i>
                                                    </button>
                                                </>
                                            }
                                        </div>

                                        {/* ------------- DELIVERY SERVICES ---------------- */}
                                        <div className="widget">
                                            <h4 className="widget-title">Delivery Services</h4>
                                            <div className="mb-3 text-secondary">
                                                {`There are
                                                    ${selectedDistrictId &&
                                                provinces.find((province) => province.id === selectedProvinceId)
                                                    .districts.find((district) => district.id === selectedDistrictId)
                                                    .deliveryServices.length}
                                                    shipping services for this location`}
                                            </div>
                                            <div className="mb-4">
                                                {selectedDistrictId &&
                                                    provinces.find((province) => province.id === selectedProvinceId)
                                                        .districts.find((district) => district.id === selectedDistrictId)
                                                        .deliveryServices.map(deliveryService =>
                                                        <Form.Check
                                                            type="radio"
                                                            name="deliveryService"
                                                            className="mb-2"
                                                            id={`service-${deliveryService.id}`}
                                                            label={`${deliveryService.name} (${deliveryService.estimatedTime})`}
                                                            value={deliveryService.id}
                                                            checked={selectedDeliveryServiceId === deliveryService.id}
                                                            onChange={handleDeliveryServiceChange}
                                                        />
                                                    )
                                                }
                                                {validator.message('deliveryService', formData.deliveryService, 'required')}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </form>
                            <div className="dz-divider bg-gray-dark text-gray-dark icon-center  my-5"><i
                                className="fa fa-circle bg-white text-gray-dark"></i></div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="widget">
                                        <h4 className="widget-title">Your Order</h4>
                                        <table className="table-bordered check-tbl">
                                            <thead className="text-center">
                                            <tr>
                                                <th>IMAGE</th>
                                                <th>PRODUCT NAME</th>
                                                <th>PRICE</th>
                                                <th>TOTAL</th>
                                                <th>VAT</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {cartState.cartItems.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="product-item-img"><img
                                                        src={addAutoWidthTransformation(item.thumbnail)} alt=""/></td>
                                                    <td className="product-item-name">
                                                        <div className="fw-bold">
                                                            {item.name}
                                                            <span
                                                                className="fw-normal font-12"> (x{item.buy_quantity})</span>
                                                        </div>
                                                        {item.productVariantAttributeValues &&
                                                            <p className="font-13 fw-normal text-primary my-0">{item.productVariantAttributeValues.map(attr => attr.attributeValue).join(' - ')}</p>
                                                        }
                                                    </td>
                                                    <td className="product-price text-center">{formatCurrency(item.price - (item.discountAmount ? item.discountAmount : 0))}</td>
                                                    <td className="product-item-totle text-center"
                                                        style={{minWidth: "unset"}}>{formatCurrency(calculateSubtotal(item))}</td>
                                                    <td className="text-center">{item.vatRate}%</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <form className="shop-form widget" onSubmit={submitForm}>
                                        <h4 className="widget-title">Order Total</h4>
                                        <table className="table-bordered check-tbl mb-4">
                                            <tbody>
                                            <tr>
                                                <td style={{width: "37%"}}>Order Subtotal</td>
                                                <td className="product-price">{formatCurrency(calculateTotal())}</td>
                                            </tr>
                                            <tr>
                                                <td>VAT</td>
                                                <td className="product-price">{formatCurrency(calculateVat())}</td>
                                            </tr>
                                            <tr>
                                                <td>Shipping</td>
                                                <td>
                                                    {selectedService != null ? formatCurrency(selectedService.fee) : "(Not calculated)"}
                                                    <div className="text-primary">
                                                        {selectedService &&
                                                            ` (${selectedService.name} | ${selectedService.type})`
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Coupon {coupon?.code}</td>
                                                <td>
                                                    {discountAmount > 0
                                                        ? `- ${formatCurrency(discountAmount)}`
                                                        : "(Not applied)"}
                                                    <span className="text-primary">
                                                        {discountAmount > 0 && ` (${coupon.code})`}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Total</td>
                                                <td className="fw-bold">{formatCurrency(calculateGrandTotal())}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <h4 className="widget-title">Payment Method</h4>
                                        <div className="mb-4">
                                            <Form.Check
                                                type="radio"
                                                name="paymentMethod"
                                                className="mb-2"
                                                id="radio-paypal"
                                                label="PAYPAL"
                                                value="PAYPAL"
                                                checked={formData.paymentMethod === 'PAYPAL'}
                                                onChange={handlePaymentMethodChange}
                                            />
                                            {/*<Form.Check*/}
                                            {/*    type="radio"*/}
                                            {/*    name="paymentMethod"*/}
                                            {/*    className="mb-2"*/}
                                            {/*    id="radio-vnpay"*/}
                                            {/*    label="VNPAY"*/}
                                            {/*    value="VNPAY"*/}
                                            {/*    checked={formData.paymentMethod === 'VNPAY'}*/}
                                            {/*    onChange={handlePaymentMethodChange}*/}
                                            {/*/>*/}
                                            <Form.Check
                                                type="radio"
                                                name="paymentMethod"
                                                className="mb-2"
                                                id="radio-cod"
                                                label="COD"
                                                value="COD"
                                                checked={formData.paymentMethod === 'COD'}
                                                onChange={handlePaymentMethodChange}
                                            />
                                            {validator.message('paymentMethod', formData.paymentMethod, 'required')}
                                        </div>
                                        {canCheckout() &&
                                            <div className="form-group">
                                                <button className="btn btn-primary btnhover" type="submit">Place Order
                                                    Now
                                                </button>
                                            </div>
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>
                    }

                    {(createdOrder && paymentStatus == null) &&
                        <div className="container">
                            <form className="shop-form">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6">
                                        <div className="widget">
                                            <h4 className="widget-title">Billing & Shipping Address</h4>
                                            <div className="row">
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={createdOrder.name}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={createdOrder.email}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={createdOrder.phone}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={createdOrder.address}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="form-group col-lg-6">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={createdOrder.province}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="form-group col-lg-6">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={createdOrder.district}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="form-group">
                                                <textarea
                                                    className="form-control"
                                                    value={createdOrder.note ? createdOrder.note : "(No note)"}
                                                    disabled
                                                ></textarea>
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={createdOrder.paymentMethod}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <div className="widget">
                                            <h4 className="widget-title">Your Order</h4>
                                            <table className="table-bordered check-tbl">
                                                <thead className="text-center">
                                                <tr>
                                                    <th>IMAGE</th>
                                                    <th>PRODUCT NAME</th>
                                                    <th>PRICE</th>
                                                    <th>TOTAL</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {createdOrder.orderProducts.map((item) => (
                                                    <tr key={item.productId}>
                                                        <td className="product-item-img"><img
                                                            src={addAutoWidthTransformation(item.productThumbnail)}
                                                            alt=""/></td>
                                                        <td className="product-item-name">
                                                            <div className="fw-bold">
                                                                {item.productName}
                                                                <span
                                                                    className="fw-normal font-12"> (x{item.quantity})</span>
                                                            </div>
                                                            {item.productVariantAttributeValues &&
                                                                <p className="font-13 fw-normal text-primary my-0">{item.productVariantAttributeValues.map(attr => attr.attributeValue).join(' - ')}</p>
                                                            }
                                                        </td>
                                                        <td className="product-price text-center">{formatCurrency(item.price)}</td>
                                                        <td className="product-item-totle text-center"
                                                            style={{minWidth: "unset"}}>{formatCurrency(item.price * item.quantity)}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <form className="shop-form widget">
                                            <h4 className="widget-title">Order Total</h4>
                                            <table className="table-bordered check-tbl mb-5">
                                                <tbody>
                                                <tr>
                                                    <td style={{width: "46%"}}>Order Subtotal</td>
                                                    <td className="product-price">{formatCurrency(createdOrder.subtotal)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Shipping</td>
                                                    <td>
                                                        {createdOrder.deliveryFee != null
                                                            ? `${formatCurrency(createdOrder.deliveryFee)} (${createdOrder.deliveryService})`
                                                            : "(Not calculated)"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Coupon</td>
                                                    <td>{createdOrder.couponAmount > 0
                                                        ? `- ${formatCurrency(createdOrder.couponAmount)} (${createdOrder.couponCode})`
                                                        : "(Not applied)"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Total</td>
                                                    <td className="fw-bold">{formatCurrency(createdOrder.grandTotal)}</td>
                                                </tr>
                                                </tbody>
                                            </table>

                                            <PaypalCheckoutButton
                                                description={"Payment for Order " + createdOrder.code}
                                                value={createdOrder.grandTotal}
                                                orderCode={createdOrder.code}
                                                setPaymentStatus={setPaymentStatus}
                                            />
                                        </form>
                                    </div>
                                </div>
                            </form>
                        </div>
                    }

                    {paymentStatus != null &&
                        <OrderPaymentStatus
                            paymentSuccess={paymentStatus}
                            setPaymentStatus={setPaymentStatus}
                            createdOrder={createdOrder}
                        />
                    }
                </section>

            </div>
        </>
    )
}

export default ShopCheckout;
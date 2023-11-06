import {useLoading} from "../../contexts/LoadingContext";
import React, {useState, useRef} from 'react';
import {toast} from "react-toastify";
import {uploadImage} from "../../services/file.service";
import {postReturnRequest} from "../../services/return-request.service";
import {Form, Modal} from "react-bootstrap";
import {addAutoWidthTransformation} from "../../utils/cloudinaryUtils";
import {formatCurrency} from "../../utils/currencyFormatter";
import imageIcon from "../../assets/images/add-icon.png";
import {Link} from "react-router-dom";

function CreateReturnRequestModal({ show, onHide, order, fetchOrderDetail }) {
    const returnReasons = [
        { name: "Did not receive the order ", desc: "(e.g. parcel lost in transit)" },
        { name: "Received an incomplete product ", desc: "(e.g. missing parts of product, missing products from order)" },
        { name: "Received the wrong product(s) ", desc: "(e.g. wrong size/colour, different product)" },
        { name: "Received a product with physical damage", desc: "(e.g. dents, scratches, cracks)" },
        { name: "Received a faulty product ", desc: "(e.g. malfunction, does not work as intended)" },
        { name: "Received a counterfeit product", desc: "" },
    ];

    const { loadingDispatch } = useLoading();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        returnReason: '',
        returnProducts: order.orderProducts.map(orderProduct => ({
            ...orderProduct,
            orderProductId: orderProduct.id,
            returnQuantity: 1,
            checked: false
        })),
    });

    const handleCheckboxChange = (orderProductId) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            returnProducts: prevFormData.returnProducts.map((returnProduct) => {
                if (returnProduct.orderProductId === orderProductId) {
                    return {
                        ...returnProduct,
                        checked: !returnProduct.checked,
                    };
                }
                return returnProduct;
            }),
        }));
    };

    const handleCheckAllChange = (e) => {
        if (e.target.checked) {
            // Update the checked property for all returnProducts
            const updatedReturnProducts = formData.returnProducts.map((returnProduct) => ({
                ...returnProduct,
                checked: true,
            }));

            setFormData({
                ...formData,
                returnProducts: updatedReturnProducts,
            });
        } else {
            const updatedReturnProducts = formData.returnProducts.map((returnProduct) => ({
                ...returnProduct,
                checked: false,
            }));

            setFormData({
                ...formData,
                returnProducts: updatedReturnProducts,
            });
        }
    };

    const isAllChecked = formData.returnProducts.every((returnProduct) => returnProduct.checked);

    const handleQuantityChange = (orderProductId, newQuantity) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            returnProducts: prevFormData.returnProducts.map((returnProduct) => {
                if (returnProduct.orderProductId === orderProductId) {
                    return {
                        ...returnProduct,
                        returnQuantity: Math.min(
                            Math.max(1, newQuantity),
                            returnProduct.quantity
                        ),
                    };
                }
                return returnProduct;
            }),
        }));
    };

    const calculateSubtotalRefund = () => {
        const selectedReturnProducts = formData.returnProducts.filter((returnProduct) => returnProduct.checked);
        const subtotal = selectedReturnProducts.reduce((total, returnProduct) => {
            return total + (returnProduct.price) * returnProduct.returnQuantity;
        }, 0);

        return subtotal;
    };

    const calculateVatRefund = () => {
        const selectedReturnProducts = formData.returnProducts.filter((returnProduct) => returnProduct.checked);
        const vat = selectedReturnProducts.reduce((total, returnProduct) => {
            return total + (returnProduct.price) * returnProduct.returnQuantity * returnProduct.vatRate / 100;
        }, 0);

        return vat;
    };

    const calculateMinusCoupon = () => {
        const couponPercentage = order.couponAmount
            ? (order.couponAmount / order.subtotal) * 100
            : 0;

        const minusCouponAmount = calculateSubtotalRefund() * couponPercentage / 100;

        return {couponPercentage, minusCouponAmount}
    };

    const calculateTotalRefund = () => {
        const total = calculateSubtotalRefund() + calculateVatRefund() - calculateMinusCoupon().minusCouponAmount
        return Number(total.toFixed(2));
    }

    //-- Select return images
    const [returnImages, setReturnImages] = useState([]);
    const inputRef = useRef();

    const handleImageSelection = (event) => {
        const files = event.target.files;
        const updatedImages = [...returnImages];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Check file type
            const fileType = file.type;
            if (!fileType.match('image/(png|jpeg|jpg)')) {
                // Invalid file type
                toast.error('Invalid file type. Only PNG, JPG, and JPEG files are allowed.');
                continue; // Skip the invalid file
            }

            // Check file size (limit to 3MB)
            const maxSize = 3 * 1024 * 1024; // 3MB in bytes
            if (file.size > maxSize) {
                // File size exceeds the limit
                toast.error('File size exceeds the limit (3MB).');
                continue; // Skip the oversized file
            }

            // Generate a preview URL for the selected image
            const previewURL = URL.createObjectURL(file);

            // Add the selected image and its preview to the returnImages state
            updatedImages.push({ file, previewURL });
        }

        setReturnImages(updatedImages);
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...returnImages];
        updatedImages.splice(index, 1);
        setReturnImages(updatedImages);
    };

    // ------ Validate data -------
    const [errorMessages, setErrorMessages] = useState({
        returnProductsError: null,
        returnReasonError: null,
        returnImagesError: null
    })

    // Validation function to check if at least one return product is checked
    const validateReturnProducts = () => {
        const isAtLeastOneChecked = formData.returnProducts.some((product) => product.checked);
        if (!isAtLeastOneChecked) {
            setErrorMessages((prevState) => ({
                ...prevState,
                returnProductsError: "You have to choose at least 1 product",
            }));
            return false;
        } else {
            setErrorMessages((prevState) => ({
                ...prevState,
                returnProductsError: null,
            }));
            return true;
        }
    };

    // Validation function to check all conditions (return products, return reason, return images)
    const validateAllConditions = () => {
        const isReturnProductsValid = validateReturnProducts();
        const isReturnReasonValid = formData.returnReason.trim() !== "";
        const isReturnImagesValid = returnImages.length > 0;

        setErrorMessages({
            returnProductsError: isReturnProductsValid ? null : "You have to choose at least 1 product",
            returnReasonError: isReturnReasonValid ? null : "You have to choose return reason",
            returnImagesError: isReturnImagesValid ? null : "You have to upload at least 1 image",
        });

        return isReturnProductsValid && isReturnReasonValid && isReturnImagesValid;
    };

    const uploadReturnImages = async () => {
        const returnImagesUrls = [];

        for (const image of returnImages) {
            try {
                // Upload the image to Cloudinary and get the URL
                const uploadedImage = await uploadImage(image.file); // Implement your upload function
                returnImagesUrls.push({ url: uploadedImage.imageUrl });
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.error('Fail to upload image!');
            }
        }

        return returnImagesUrls;
    };

    const submitReturnRequest = async () => {
        if (validateAllConditions()) {
            try {
                loadingDispatch({type: 'START_LOADING'});
                // First upload return images to cloudinary:
                const returnRequestImages = await uploadReturnImages();

                // Then call API to create return request
                const requestData = {
                    orderId: order.id,
                    returnReason: formData.returnReason,
                    refundAmount: calculateTotalRefund(),
                    returnProducts: formData.returnProducts
                        .filter(product => product.checked)
                        .map(product => ({
                            orderProductId: product.orderProductId,
                            returnQuantity: product.returnQuantity,
                        })),
                    returnRequestImages: returnRequestImages,
                }
                await postReturnRequest(requestData);
                //onHide();
                fetchOrderDetail();
                toast.success("Return request created");
                //await new Promise((resolve) => setTimeout(resolve, 3000));
            } catch (error) {
                console.log(error);
                toast.error("Fail to create return request");
            } finally {
                loadingDispatch({type: 'STOP_LOADING'});
            }
        } else {
            toast.error("Validate fail");
        }
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            contentClassName="border-0 rounded-2 shadow"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Create return request for this order?
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {step === 1 &&
                    <>
                        <h4>Step 1: Select return products</h4>
                        <div className="table-responsive mb-5">
                            <table className="table check-tbl">
                                <thead>
                                <tr>
                                    <th className="text-center ">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="checkbox-all-products"
                                            checked={isAllChecked}
                                            onChange={handleCheckAllChange}
                                        />
                                    </th>
                                    <th>Product</th>
                                    <th>Product name</th>
                                    <th className="text-center">Price</th>
                                    <th className="text-center">Quantity</th>
                                    <th>Return Quantity</th>
                                    <th className="text-end" style={{minWidth: "83px"}}>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {formData.returnProducts.map((returnProduct)=>(
                                    <tr key={returnProduct.orderProductId}>
                                        <td className="text-center">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`checkbox-order-product-${returnProduct.orderProductId}`}
                                                checked={returnProduct.checked}
                                                onClick={() => handleCheckboxChange(returnProduct.orderProductId)}
                                            />
                                        </td>
                                        <td className="product-item-img">
                                            <img
                                                src={addAutoWidthTransformation(returnProduct.productThumbnail)} alt=""
                                                style={{
                                                    filter: !returnProduct.checked
                                                        ? "grayscale(100%) blur(2px)"
                                                        : "none" // If returnProduct.checked is true, no style is applied
                                                }}
                                            />
                                        </td>
                                        <td
                                            className={`product-item-name ${!returnProduct.checked && 'text-muted'}`}
                                        >
                                            {returnProduct.productName}<br/>
                                            {returnProduct.productVariantAttributeValues.length > 0 &&
                                                <p className="font-13 fw-normal text-primary my-0">{returnProduct.productVariantAttributeValues.map(attr => attr.attributeName + ": " + attr.attributeValue).join(' | ')}</p>
                                            }
                                        </td>
                                        <td
                                            className={`product-item-price text-center ${!returnProduct.checked && 'text-muted'}`}
                                        >
                                            {formatCurrency(returnProduct.price)}<br/>
                                            <span className="font-14 text-primary">({returnProduct.vatRate}% VAT)</span>
                                        </td>
                                        <td
                                            className={`product-item-price text-center ${!returnProduct.checked && 'text-muted'}`}
                                        >
                                            {returnProduct.quantity}
                                        </td>
                                        <td className="product-item-quantity py-0">
                                            <div className="quantity btn-quantity style-1 m-r15">
                                                <button
                                                    className="btn btn-plus"
                                                    type="button"
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            returnProduct.orderProductId,
                                                            returnProduct.returnQuantity + 1
                                                        )
                                                    }
                                                    disabled={!returnProduct.checked}
                                                >
                                                    <i className="ti-plus"></i>
                                                </button>
                                                <input
                                                    type="text"
                                                    className={`quantity-input ${returnProduct.checked ? 'text-secondary' : 'text-muted'}`}
                                                    value={returnProduct.returnQuantity}
                                                    disabled
                                                />
                                                <button
                                                    className="btn btn-minus "
                                                    type="button"
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            returnProduct.orderProductId,
                                                            returnProduct.returnQuantity - 1
                                                        )
                                                    }
                                                    disabled={!returnProduct.checked}
                                                >
                                                    <i className="ti-minus"></i>
                                                </button>
                                            </div>
                                        </td>
                                        <td className={`product-item-price text-end ${!returnProduct.checked && 'text-muted'}`}>
                                            {returnProduct.checked
                                                ? formatCurrency(returnProduct.price * returnProduct.returnQuantity)
                                                : formatCurrency(0)
                                            }
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {errorMessages.returnProductsError &&
                                <span className="text-danger">{errorMessages.returnProductsError}</span>
                            }
                        </div>

                        <div className="widget">
                            <h4 className="widget-title text-capitalize">Calculate Refund</h4>
                            <table className="table-bordered check-tbl m-b25">
                                <tbody>
                                <tr>
                                    <td style={{width: "80%"}}>Subtotal</td>
                                    <td className="text-end">{formatCurrency(calculateSubtotalRefund())}</td>
                                </tr>
                                <tr>
                                    <td>VAT</td>
                                    <td className="text-end">{formatCurrency(calculateVatRefund())}</td>
                                </tr>
                                <tr>
                                    <td>
                                        Minus Coupon
                                        <span className="text-primary m-l10">
                                    ({calculateMinusCoupon().couponPercentage.toFixed(2)}% of original order subtotal value)
                                </span>
                                    </td>
                                    <td className="text-end">
                                        - {formatCurrency(calculateMinusCoupon().minusCouponAmount)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Total Refund</td>
                                    <td className="text-end">{formatCurrency(calculateTotalRefund())}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                }

                {step === 2 &&
                    <>
                        <h4>Step 2: Select return reason</h4>
                        {returnReasons.map((reason, index) =>
                            <Form.Check
                                type="radio"
                                name="deliveryService"
                                className="mb-2"
                                id={`reason-${index}`}
                                label={`${reason.name} ${reason.desc}`}
                                value={reason.name}
                                checked={formData.returnReason === reason.name}
                                onChange={() => setFormData({ ...formData, returnReason: reason.name })}
                            />
                        )}
                        {errorMessages.returnReasonError &&
                            <span className="text-danger">{errorMessages.returnReasonError}</span>
                        }


                        <h4 className="mt-5">Step 3: Upload images</h4>
                        <div className="d-flex justify-content-start">
                            {returnImages.map((image, index) => (
                                <div key={index} className="mb-3 me-4">
                                    <div className="avatar-container">
                                        <div className="avatar-preview">
                                            <img
                                                src={image.previewURL}
                                                alt="Selected"
                                                className="avatar-image img-thumbnail"
                                            />
                                            <div className="delete-icon" onClick={() => handleRemoveImage(index)}>
                                                <i className="fas fa-times"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="mb-3">
                                <div className="avatar-container">
                                    <img
                                        src={imageIcon}
                                        alt="Avatar"
                                        className="avatar-image img-thumbnail p-4"
                                        onClick={() => inputRef.current.click()}
                                    />
                                </div>
                                <input
                                    type="file"
                                    className="form-control visually-hidden"
                                    multiple
                                    onChange={handleImageSelection}
                                    ref={inputRef}
                                />
                            </div>
                        </div>
                        {errorMessages.returnImagesError &&
                            <span className="text-danger">{errorMessages.returnImagesError}</span>
                        }
                    </>
                }
            </Modal.Body>
            <Modal.Footer>
                {step === 1 ?
                    <Link
                        className="btn btn-secondary"
                        onClick={() => {
                            if (validateReturnProducts())
                                setStep(2);
                        }}
                    >
                        Next
                        <i className="fas fa-chevron-right m-l10"></i>
                    </Link>
                    :
                    <>
                        <Link
                            className="btn btn-secondary"
                            onClick={() => setStep(1)}
                        >
                            <i className="fas fa-chevron-left m-r10"></i>
                            Back
                        </Link>
                        <Link
                            className="btn btn-danger"
                            onClick={() => submitReturnRequest()}
                        >
                            Submit
                        </Link>
                    </>
                }
            </Modal.Footer>
        </Modal>
    );
}

export default CreateReturnRequestModal;
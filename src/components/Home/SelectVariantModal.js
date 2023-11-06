import {useLoading} from "../../contexts/LoadingContext";
import React, {useEffect, useState} from 'react';
import SimpleReactValidator from "simple-react-validator";
import {cancelOrder} from "../../services/order.service";
import {toast} from "react-toastify";
import {Button, Form, Modal} from "react-bootstrap";
import {Link} from "react-router-dom";
import {addAutoWidthTransformation} from "../../utils/cloudinaryUtils";
import {formatCurrency} from "../../utils/currencyFormatter";
import {useCart} from "../../contexts/CartContext";
import useAddToCart from "../../custome-hooks/useAddToCart";
import useVariantSelection from "../../custome-hooks/useVariantSelection";


function SelectVariantModal({ show, onHide, product }) {
    const [buy_quantity, setBuy_quantity] = useState(1);
    const { handleAddToCart } = useAddToCart();

    const { selectedAttributes, selectedVariant, handleAttributeChange } = useVariantSelection(product);

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
                    Select variants
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {product &&
                    <div className="row">
                        <div className="col-4">
                            <img src={addAutoWidthTransformation(product.thumbnail)} alt="book" className="rounded-2"/>
                        </div>
                        <div className="col-8">
                            <h3 className="">{product.name}</h3>
                            <div className="dz-body">
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

                                <div className="d-flex justify-content-between align-items-baseline mt-5">
                                    {product.hasVariants && selectedVariant && (
                                        selectedVariant.discountAmount ?
                                            <div className="price d-flex align-items-baseline">
                                                <h4 className="font-26 text-primary">{formatCurrency(selectedVariant.price - selectedVariant.discountAmount)}</h4>
                                                <p className="p-lr10">{formatCurrency(selectedVariant.price)}</p>
                                            </div>
                                            :
                                            <div className="price">
                                                <h5>{formatCurrency(selectedVariant.price)}</h5>
                                            </div>
                                    )}

                                    <div className="d-flex align-items-center">
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
                                                <Link
                                                    to={`/shop-detail/${product.slug}`}
                                                    className="btn btn-outline-secondary btnhover btnhover2 m-r10">
                                                    See Detail
                                                </Link>
                                                <Link onClick={() => {
                                                    handleAddToCart(selectedVariant, 1);
                                                    onHide();
                                                }}
                                                      className="btn btn-secondary btnhover btnhover2"><i
                                                    className="flaticon-shopping-cart-1 m-r10"></i>
                                                    <span>Add to cart</span>
                                                </Link>
                                            </>
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                }
            </Modal.Body>
        </Modal>
    );
}

export default SelectVariantModal;
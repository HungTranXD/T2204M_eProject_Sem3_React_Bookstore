import {useLoading} from "../../contexts/LoadingContext";
import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import {Button, Form, Modal} from "react-bootstrap";
import Rating from "react-rating";
import {postReview} from "../../services/order.service";
import formatDate from "../../utils/datetimeFormatter";

function ReviewProductModal({ show, onHide, product, fetchOrderDetail }) {
    const { loadingDispatch } = useLoading();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

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

    const submitReviewForm = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            await postReview({
                orderProductId: product.id,
                rating: rating,
                comment: comment
            });
            fetchOrderDetail();
            onHide();
            toast.success("Review created");
        } catch (error) {
            console.log(error);
            toast.error("Fail to create review");
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            contentClassName="border-0 rounded-2 shadow"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Review - {product.productName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!product.review ? (
                    <>
                        <div className="mb-4">
                            <label className="label-title d-block">Overall rating</label>
                            <Rating
                                initialRating={rating}
                                emptySymbol="far fa-star text-yellow fa-2x"
                                fullSymbol="fas fa-star text-yellow fa-2x"
                                fractions={2}
                                onClick={(value) => setRating(value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="label-title">Comment</label>
                            <input
                                name="comment"
                                className="form-control"
                                placeholder="Example: Product is good."
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                    </>
                ) : (
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th className="fw-normal" style={{width: "32%"}}>Rating</th>
                                <th className="fw-normal">
                                    <ul className="dz-rating">
                                    {calculateStarRating(parseFloat(product.review.rating.toFixed(1)))}
                                    </ul>
                                </th>
                            </tr>
                            <tr>
                                <th className="fw-normal">Comment</th>
                                <th className="fw-normal text-secondary">{product.review.comment ? product.review.comment : "(No comment)"}</th>
                            </tr>
                            <tr>
                                <th className="fw-normal">Created Date</th>
                                <th className="fw-normal text-secondary">{formatDate(product.review.createdAt).formattedDate}</th>
                            </tr>
                        </tbody>
                    </table>
                )}

            </Modal.Body>
            <Modal.Footer>
                <button
                    onClick={onHide}
                    className="btn btn-primary"
                >Close</button>
                {!product.review &&
                    <button
                        className="btn btn-danger"
                        onClick={submitReviewForm}
                    >Submit</button>
                }
            </Modal.Footer>
        </Modal>
    );
}

export default ReviewProductModal;
import React from "react";

export function calculateStarRating(rating) {
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
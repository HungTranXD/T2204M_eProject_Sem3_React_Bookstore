export const calculateMinAndMaxPrice = (product) => {
    let minOriginalPrice = 0;
    let maxOriginalPrice = 0;
    let minPrice = 0;
    let maxPrice = 0;
    if (product.productVariants) {
        const variantOriginalPrices = product.productVariants.map((variant) => variant.price);
        minOriginalPrice = Math.min(...variantOriginalPrices);
        maxOriginalPrice = Math.max(...variantOriginalPrices);

        const variantPrices = product.productVariants.map((variant) =>
            variant.discountAmount
                ? variant.price - variant.discountAmount
                : variant.price
        );
        minPrice = Math.min(...variantPrices);
        maxPrice = Math.max(...variantPrices);
    }
    return {minPrice, maxPrice, minOriginalPrice, maxOriginalPrice};
}

export const calculateMinAndMaxDiscount = (product) => {
    let minDiscountAmount = 0;
    let maxDiscountAmount = 0;
    let minDiscountPercentage = 0;
    let maxDiscountPercentage = 0;

    if (product.productVariants) {
        // Initialize with the first variant's values
        minDiscountAmount = product.productVariants[0].discountAmount || 0;
        maxDiscountAmount = product.productVariants[0].discountAmount || 0;
        minDiscountPercentage = calculateDiscountPercentage(product.productVariants[0]);
        maxDiscountPercentage = calculateDiscountPercentage(product.productVariants[0]);

        // Iterate through variants to find min and max values
        product.productVariants.forEach((variant) => {
            const discountAmount = variant.discountAmount || 0;
            const discountPercentage = calculateDiscountPercentage(variant);

            minDiscountAmount = Math.min(minDiscountAmount, discountAmount);
            maxDiscountAmount = Math.max(maxDiscountAmount, discountAmount);
            minDiscountPercentage = Math.min(minDiscountPercentage, discountPercentage);
            maxDiscountPercentage = Math.max(maxDiscountPercentage, discountPercentage);
        });
    }

    return { minDiscountAmount, maxDiscountAmount, minDiscountPercentage, maxDiscountPercentage };
};

// Helper function to calculate discount percentage
const calculateDiscountPercentage = (variant) => {
    if (variant.price === 0) {
        return 0;
    }
    return (variant.discountAmount || 0) * 100 / variant.price;
};
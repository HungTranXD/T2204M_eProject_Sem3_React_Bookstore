import { useState, useEffect } from 'react';

function useVariantSelection(initialProduct) {
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [selectedVariant, setSelectedVariant] = useState(null);

    const handleAttributeChange = (attributeId, attributeValueId) => {
        setSelectedAttributes({
            ...selectedAttributes,
            [attributeId]: attributeValueId,
        });
    };

    const findVariant = (product) => {
        if (!product) return null;
        const result = product.productVariants.find((variant) =>
            variant.productVariantAttributeValues.every((attrValue) =>
                selectedAttributes[attrValue.attributeId] === attrValue.attributeValueId
            )
        );
        setSelectedVariant(result);
    };

    const setDefaultSelectedAttributes = (product) => {
        if (!product || product.productVariants.length === 0) return;
        const initialAttributes = {};
        const firstVariant = product.productVariants[0];
        firstVariant.productVariantAttributeValues.forEach((attrValue) => {
            initialAttributes[attrValue.attributeId] = attrValue.attributeValueId;
        });
        setSelectedAttributes(initialAttributes);
    };

    useEffect(() => {
        setDefaultSelectedAttributes(initialProduct);
    }, [initialProduct]);

    useEffect(() => {
        findVariant(initialProduct);
    }, [initialProduct, selectedAttributes]);

    return {
        selectedAttributes,
        selectedVariant,
        handleAttributeChange,
    };
}

export default useVariantSelection;
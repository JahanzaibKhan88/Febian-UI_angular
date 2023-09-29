import { Validator } from "fluentvalidation-ts";
type Product = {
    active: boolean;
    description: string;
    expiry: string;
    name: string;
    price: number;
    sku: number;
    uom: string;
}

class ProductValidator extends Validator<Product>{
    constructor(){
        super();
        this.ruleFor('description').notNull().withMessage('Please provide product description').minLength(10).withMessage('Please enter at least 10 characters in description.');
        this.ruleFor('expiry').notNull().withMessage('Please provide an expiry date for this product.');
        this.ruleFor('name').notEmpty().withMessage('Please provide a product name.').minLength(3).withMessage('Please provide a valid product name.');
        this.ruleFor('uom').notEmpty().withMessage('Please select a UOM for this product.');
    }
}

export default ProductValidator;
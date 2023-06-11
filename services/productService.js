const Product = require("../models/ProductSchema");
const User = require("../models/userSchema");

exports.createProduct = async (Title, Description, Price, Availability, Category, owner) => {
    console.log("in service product", owner);
    const NewProduct = new Product({
        Title,
        Description,
        Price,
        Availability,
        Category,
        owner
    });
    await NewProduct.save();
    return NewProduct;
}

exports.getProducts = async (id) => {
    let Products;
    if (id) {
        Products = await Product.findById(id);
        return Products;
    } else {
        Products = await Product.find({});
        return Products;
    }
};

exports.updatedProduct = async function (productId, field, value) {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }
    // update field
    switch (field) {
        case "TiTle": product.Title = value;
            break;
        case "Price": product.Price = value;
            break;
        case "description": product.Description = value;
            break;
        case "Availability": product.Availability = value;
            break;
        case "Category": product.Category = value;
            break;
        default:
            throw new Error("Invalid field");
    }

    const updatedProduct = await product.save();
    return updatedProduct;
};

exports.deleteProduct = async (productid) => {
    console.log("in service");
    await Product.findOneAndUpdate({
        _id: productid
    }, {
        isActive: false
    }, {
        new: true,
        runValidators: true
    });
    return "Product deleted successfully ";
};

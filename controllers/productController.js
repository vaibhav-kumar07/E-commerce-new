const ProductService = require("../services/productService");

exports.createProduct = async (req, res) => {
    try {
        const { Title, Description, Price, Availability, Category } = req.body;
        const owner = req.loggedInUser;
        console.log("in product controller");
        const result = await ProductService.createProduct(
            Title,
            Description,
            Price,
            Availability,
            Category,
            owner._id
        );

        res.send(201, result);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};


exports.getAllProducts = async (req, res) => {
    try {
        const result = await ProductService.getProducts();
        res.status(200).send(result);

    } catch (error) {
        console.log(error);
        throw { message: error.message };
    }
};
exports.getProductById = async (req, res) => {
    try {
        const { productid } = req.params.id;
        if (req.loggedInUser?.loggedInUser == "Admin") {
            const result = await ProductService.getProducts(productid);
            res.status(200).send(result);
        }
        else {
            res.status(401).send("user is not logged In  or user is not authorized to  ");
        }
    } catch (error) {
        console.log(error);
        throw { message: error.message };
    }
};


exports.updateProduct = async function (req, res) {
    try {
        const productId = req.params.id;
        const { field, value } = req.body;
        if (req.loggedInUser?.role == "Admin") {
            const updatedProduct = await ProductService.updatedProduct(productId, field, value);
            res.status(200).json(updatedProduct);
        } else {
            res.status(403).json({ message: "you are not authorized to edit product or user is not login" })
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        console.log("in product controller")
        const pid = req.params.id;
        const userid = req.loggedInUser;
        if (req.loggedInUser?.role == "Admin") {
            await ProductService.deleteProduct(userid._id, pid);
            res.status(204).json("product deletd successfully");
        } else {
            res.status(403).json({ message: "you are not authorized to product or user is not login" })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};



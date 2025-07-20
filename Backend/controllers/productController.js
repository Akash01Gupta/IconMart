const mongoose = require('mongoose');
const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudConfig');

// GET all products
module.exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// CREATE product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, category, brand, price, quantity } = req.body;

        if (!name || !description || !category || !brand || price == null || quantity == null) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!req.file || !req.file.path) {
            return res.status(400).json({ error: 'Product image is required' });
        }

        const imageUrl = req.file?.path;
        const imagePublicId = req.file.filename;

        const newProduct = new Product({
            name,
            description,
            category,
            brand,
            price,
            quantity,
            imageUrl,
            imagePublicId,
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created', product: newProduct });
    } catch (error) {
        console.error('🔴 Product creation error:', error.stack || error);
        res.status(500).json({ error: 'Server error' });
    }
};

// UPDATE product
exports.updateProduct = async (req, res) => {
    const id = req.params.id?.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const { name, description, category, brand, price, quantity } = req.body;

        const updateData = {
            ...(name && { name }),
            ...(description && { description }),
            ...(category && { category }),
            ...(brand && { brand }),
            ...(price !== undefined && price !== '' && { price: Number(price) }),
            ...(quantity !== undefined && quantity !== '' && { quantity: Number(quantity) }),
        };

        if (req.file?.path) {
            // delete old image from cloudinary
            if (product.imagePublicId) {
                await cloudinary.uploader.destroy(product.imagePublicId);
            }

            updateData.imageUrl = req.file.path;
            updateData.imagePublicId = req.file.filename;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        res.json({ message: 'Product updated', product: updatedProduct });
    } catch (error) {
        console.error('🔴 Update error:', error.stack || error);
        res.status(500).json({ error: 'Server error' });
    }
};


// GET product by ID
module.exports.getProductById = async (req, res) => {
    const id = req.params.id?.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// DELETE a product
module.exports.deleteProduct = async (req, res) => {
    const id = req.params.id?.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });

        res.json({ message: 'Product deleted', product: deletedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// RATE product
module.exports.rateProduct = async (req, res) => {
    const productId = req.params.id;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // Check if user already reviewed
        const existingReview = product.reviews.find((rev) => rev.user.toString() === userId);

        if (existingReview) {
            return res.status(400).json({ error: 'You already reviewed this product' });
        }

        const newReview = {
            user: userId,
            name: req.user.name,
            rating,
            comment,
        };

        product.reviews.push(newReview);
        product.ratingsCount = product.reviews.length;
        product.ratingsAvg = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

        await product.save();

        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        console.error('Review Error:', error);
        res.status(500).json({ error: 'Server error while submitting review' });
    }
};


// Edit a review
module.exports.editReview = async (req, res) => {
    const { productId, reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).json({ error: 'Invalid product or review ID' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const review = product.reviews.id(reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        if (!review.user || !review.user.equals(req.user._id)) {
            return res.status(403).json({ error: 'You can only edit your own reviews' });
        }

        if (rating !== undefined && (rating < 1 || rating > 5)) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        if (rating !== undefined) review.rating = rating;
        if (comment !== undefined) review.comment = comment.trim();
        review.updatedAt = new Date();

        await product.save();

        res.json({ message: 'Review updated successfully', review });
    } catch (error) {
        console.error('Error editing review:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a review
module.exports.deleteReview = async (req, res) => {
    const { productId, reviewId } = req.params;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).json({ error: 'Invalid product or review ID' });
    }

    try {
        // Find the product
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // Find review using .find() to avoid ObjectId vs string mismatch
        const reviewIndex = product.reviews.findIndex(
            (r) => r._id.toString() === reviewId
        );

        if (reviewIndex === -1) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const review = product.reviews[reviewIndex];

        // Check if user is the owner of the review
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized to delete this review' });
        }

        // Remove the review
        product.reviews.splice(reviewIndex, 1);

        // Recalculate ratings
        const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
        product.ratingsCount = product.reviews.length;
        product.ratingsAvg = product.ratingsCount > 0 ? total / product.ratingsCount : 0;

        await product.save();

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


// Get single review
module.exports.getSingleReview = async (req, res) => {
    const { productId, reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).json({ error: 'Invalid product or review ID' });
    }

    try {
        const product = await Product.findById(productId).select('reviews');
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const review = product.reviews.id(reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        res.json(review);
    } catch (error) {
        console.error('Error fetching review:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all reviews (paginated)
module.exports.getAllReviews = async (req, res) => {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    try {
        const product = await Product.findById(productId).select('reviews');
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const totalReviews = product.reviews.length;
        const startIndex = (page - 1) * limit;
        const reviews = product.reviews
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(startIndex, startIndex + limit);

        res.json({
            page,
            totalPages: Math.ceil(totalReviews / limit),
            totalReviews,
            reviews,
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Cleanup invalid reviews
module.exports.cleanInvalidReviews = async (req, res) => {
    try {
        const products = await Product.find();

        let cleanedProducts = 0;
        let removedReviews = 0;

        for (const product of products) {
            const original = product.reviews.length;
            product.reviews = product.reviews.filter(r => r.user && r.name);
            const cleaned = product.reviews.length;

            if (cleaned !== original) {
                removedReviews += original - cleaned;
                await product.save();
                cleanedProducts++;
            }
        }

        res.json({
            message: 'Cleanup completed',
            cleanedProducts,
            removedReviews,
        });
    } catch (error) {
        console.error('Cleanup error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



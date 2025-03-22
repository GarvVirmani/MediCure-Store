const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../middleware');
const User = require('../../models/User');

// Route to like/unlike a product
router.post('/product/:productId/like', isLoggedIn, async (req, res) => {
    const { productId } = req.params;
    const user = req.user;
    const isLiked = user.wishList.includes(productId);

    const option = isLiked ? '$pull' : '$addToSet';
    req.user = await User.findByIdAndUpdate(req.user._id, { [option]: { wishList: productId } }, { new: true });
    res.send('Like done API');
});

// Route to remove an item from the user's cart
router.post('/user/:productId/remove', isLoggedIn, async (req, res) => {
    const productId = req.params.productId;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        const productIndex = user.cart.findIndex(item => item._id.toString() === productId);
        if (productIndex > -1) {
            user.cart.splice(productIndex, 1);
            await user.save();
        } else {
            req.flash('error_msg', 'Item not found in cart');
        }

        res.redirect('/user/cart'); // Redirect back to the cart page
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
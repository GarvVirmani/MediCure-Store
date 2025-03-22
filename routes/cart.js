const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware');
const Product = require('../models/Product');
const User = require('../models/User');

router.get('/user/cart' , isLoggedIn , async(req,res)=>{
    const user = await User.findById(req.user._id).populate('cart');
    const totalAmount = user.cart.reduce((sum , curr)=> sum+curr.price , 0)
    const productInfo = user.cart.map((p)=>p.name).join(',');
    res.render('cart/cart' , {user, totalAmount , productInfo});
})

router.post('/user/:productId/add', isLoggedIn, async (req, res) => {
    const productId = req.params.productId;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
            // If the product does not exist, add it to the cart with quantity 1
            const product = await Product.findById(productId); // Assuming you have a Product model
            user.cart.push({
                _id: product._id,
                name: product.name,
                desc: product.desc,
                img: product.img,
                price: product.price,
                quantity: product.quantity 
            });
        await user.save();
        res.redirect('/user/cart'); // Redirect to the cart page
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
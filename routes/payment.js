const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
router.use(express.static('public'));
router.use(express.urlencoded({extended:true}));
const YOUR_DOMAIN='https://medicure-store.onrender.com';
router.post('/create-checkout-session',async (req,res)=>{
    const product=req.body;
    console.log(product);
        // Validation to check if productinfo and amount are present
        if (!product.productinfo || !product.amount) {
            return res.status(400).send('Product information or amount is missing');
        }
    const lineItems=[{
        price_data:{
            currency:"inr",
            product_data:{
                name:product.productinfo
            },
            unit_amount:product.amount*100,
        },
        quantity:1
    }
    ];
const session = await stripe.checkout.sessions.create({
  payment_method_types:['card'],
  line_items: lineItems,
  mode: 'payment',
  success_url: `${YOUR_DOMAIN}/success`,
  cancel_url: `${YOUR_DOMAIN}/cancel`,
});
    res.redirect(303,session.url);
});
// Success route
router.get('/success', (req, res) => {
    req.flash('success', 'Payment successful! Thank you for your purchase.');
    res.redirect('/');
});

// Cancel route
router.get('/cancel', (req, res) => {
    req.flash('error', 'Payment canceled. Please try again.');
    res.redirect('/');
});
module.exports = router;

const express = require('express');
const Stripe = require("stripe");
const { Order } = require('../models/order');

require("dotenv").config();

const router = express.Router();

const stripe = Stripe(process.env.STRIPE_KEY);

router.post('/create-checkout-session', async (req, res) => {
    try {
        if (!Array.isArray(req.body.cartItems)) {
            throw new Error('cartItems is not an array');
        } else {
            // console.log(req.body)
        }

        const customer = await stripe.customers.create({
            metadata: {
              userId: req.body.userId,
              cart: JSON.stringify(req.body.cartItems),
            },
          });

        const line_items = req.body.cartItems.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.title,
                        // images: `http://localhost:3000/uploads/${item.imageFile}`,
                        description: item.description,
                        metadata: {
                            id: item._id,
                        },
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.cartQuantity,
            };
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            shipping_address_collection: {
                allowed_countries: ["US", "CA", "EG"],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: "fixed_amount",
                        fixed_amount: {
                            amount: 0,
                            currency: "usd",
                        },
                        display_name: "Free shipping",
                        // Delivers between 5-7 business days
                        delivery_estimate: {
                            minimum: {
                                unit: "business_day",
                                value: 5,
                            },
                            maximum: {
                                unit: "business_day",
                                value: 7,
                            },
                        },
                    },
                },
                {
                    shipping_rate_data: {
                        type: "fixed_amount",
                        fixed_amount: {
                            amount: 1500,
                            currency: "usd",
                        },
                        display_name: "Next day air",
                        // Delivers in exactly 1 business day
                        delivery_estimate: {
                            minimum: {
                                unit: "business_day",
                                value: 1,
                            },
                            maximum: {
                                unit: "business_day",
                                value: 1,
                            },
                        },
                    },
                },
            ],
            phone_number_collection: {
                enabled: true,
            },
            customer: customer.id,
            line_items,
            allow_promotion_codes: true,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/checkout-success`,
            cancel_url: `${process.env.CLIENT_URL}/meals`,
        });

        // Send the URL of the created session back to the client
        res.send({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send('Failed to create checkout session.');
    }
});

//create order:
const createOrder = async(customer,data)=>{
    const Items = JSON.parse(customer.metadata.cart)

    const newOrder = new Order({
        userId: customer.metadata.userId,
        customerId: data.customer,
        paymentIntentId: data.payment_intent,
        meals: Items,
        subtotal: data.amount_subtotal,
        total: data.amount_total,
        shipping: data.customer_details,
        payment_status: data.payment_status,
    });
    try {
        const savedOrder = await newOrder.save()

        console.log("processed order:", savedOrder)
    } catch (err) {
        console.log(err) 
    }
}

//webhook

let endpointSecret;
// endpointSecret = "whsec_8f68efa76e4f0b31b83e0d3a956d076a83e8b791a20372201c417eee64af85a9"
// endpointSecret = process.env.STRIPE_WEBHOOK_KEY
// Match the raw body to content type application/json
// If you are using Express v4 - v4.16 you need to use body-parser, not express, to retrieve the req body
router.post('/webhook', express.json({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];

    let data;
    let eventType

    if (endpointSecret) {
        let event;
        let stringBody = JSON.stringify(req.body);
        try {
            console.log(stringBody)
            event = stripe.webhooks.constructEvent(stringBody, sig, endpointSecret);
            console.log('webhook verified')

        }
        catch (err) {
            console.log(`⚠️ Webhook Error: ${err.message}`)
            res.status(400).send(`Webhook Error: ${err.message}`);
        }
        data = event.data.object;
        eventType = event.type;
    } else {
        data = req.body.data.object;
        eventType = req.body.type;
    }


    // Handle the event
    if (eventType === "checkout.session.completed") {
        stripe.customers.retrieve(data.customer).then((customer) => {
            // console.log(customer);
            // console.log("data:", data);
            createOrder(customer,data)
        }).catch((err) => {
            console.log(err.message)
        })
    }


    // Return a res to acknowledge receipt of the event
    res.status(200).end();
});


module.exports = router;

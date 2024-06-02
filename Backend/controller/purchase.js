const Razorpay = require('razorpay');
const Order = require('../models/order');
const sequelize = require('../util/database');
const User = require('../models/user');


exports.getTransactionStatus = async (req, res ) => {
    try {
        const isPremiumUser = req.user.ispremiumuser;
        res.status(200).json({ status:isPremiumUser });
    } catch (err) {
        console.error('Error in getTransactionStatus:', err)                                                                                                         
        res.status(500).json({ errpr: err, message: 'Sometghing went wrong' })
    }
}


exports.purchasepremium = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET 
        });
        const amount = 2500; 
        
        const order = await rzp.orders.create({ amount, currency: "INR" });

        await req.user.createOrder({ orderid: order.id, status: 'PENDING'});
        
        res.status(201).json({ order, key_id : rzp.key_id});

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong', err: err });
    }
}

exports.updateFailedStatus = async (req, res) => {
    try {
      const { order_id } = req.body;
      const order = await Order.findOne({ where: { orderid: order_id } });
      await order.update({ status: 'FAILED' });
      res.status(200).json({ success: true, message: "Order status updated to FAILED." });
    } catch (err) {
      console.error('Error updating order status:', err);
      res.status(500).json({ error: err, message: 'Failed to update order status.' });
    }
  };

exports.updateTransactionStatus = async (req, res) => {
    const t=await sequelize.transaction();
    try {
        const { payment_id, order_id } = req.body;

        const order = await Order.findOne({ where: { orderid: order_id }});
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const updateUserPromise = User.update(
            { ispremiumuser: true },
            {where:{id:req.user.id},transaction:t}
        );
        const updateOrderPromise = order.update(
            {paymentid: payment_id, status: 'SUCCESSFUL' },
            {transaction:t}
        );

        await Promise.all([updateOrderPromise, updateUserPromise]);

        await t.commit();

        res.status(202).json({ success: true, message: "Transaction Successful" });
    } catch (err) {
        await t.rollback();
        console.error('Error in updateTransactionStatus:', err);
        res.status(500).json({ error: err.message || "Something went wrong" });
    }
};

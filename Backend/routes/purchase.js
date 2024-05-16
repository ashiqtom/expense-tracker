const express = require('express');

const purchaseController = require('../controller/purchase');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/premiummembership',authenticatemiddleware.authenticate,purchaseController.purchasepremium);

router.get('/getStatus',authenticatemiddleware.authenticate,purchaseController.getTransactionStatus);

router.post('/updatetransactionstatus', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatus)

router.post('/updateorderstatus', authenticatemiddleware.authenticate, purchaseController.updateOrderStatus)


module.exports = router; 
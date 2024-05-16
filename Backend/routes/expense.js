const express = require('express');

const router = express.Router();

const expenseController = require('../controller/expense');
const userAuthentication =require('../middleware/auth')

router.get('/get', userAuthentication.authenticate ,expenseController.getExpence);

router.post('/post', userAuthentication.authenticate ,expenseController.postExpence);  
  
router.delete('/:expenseId', userAuthentication.authenticate ,expenseController.deleteExpence );

module.exports = router;
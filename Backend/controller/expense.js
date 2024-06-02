const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database')



exports.getExpence=async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const itemsPerPage = +req.query.itemsPerPage || 2;
      let totalaItems=await Expense.count({
        where: { UserId: req.user.id }
      });
      const expenses = await Expense.findAll({
        where:{UserId:req.user.id},
        offset:(page-1)*itemsPerPage,
        limit:itemsPerPage,
      });
      res.status(200).json({
        expenses:expenses,
        currentPage:page,
        nextPage:page+1,
        previousPage:page-1,
        HasNextPage:itemsPerPage*page<totalaItems,        
        hasPreviousPage:page>1,        
        lastPage:Math.ceil(totalaItems/itemsPerPage),
      });
    } catch (err) { 
      console.error('Error fetching expenses:', err);
      res.status(500).json({ err: 'Failed to fetch expenses' });
    }
}

exports.postExpence=async (req, res) => {
  const t=await sequelize.transaction();
  try {
    const { amount, description, category } = req.body;
    const expense = await Expense.create(
      { amount, description, category,UserId:req.user.id},
      {transaction:t}
    );
    const totalAmount=req.user.totalExpense+parseInt(amount);
    await User.update(
      { totalExpense:totalAmount },
      {where:{id:req.user.id},transaction:t}
    );
    await t.commit()
    res.status(201).json(expense);
  } catch (err) {
    await t.rollback();
    console.error('Error creating expense:', err);
    res.status(500).json({ err: 'Failed to create expense' });
  }
}

exports.deleteExpence=async (req, res) => {
  const t=await sequelize.transaction();
    try {
      const expenseId = req.params.expenseId;

      const curentExpense=await Expense.findOne(
        {where:{id: expenseId, UserId:req.user.id}},
        {transaction:t}
      );

      await Expense.destroy(
        {where: { id: expenseId, UserId:req.user.id }},
        {transaction:t}
      );

      const expense=req.user.totalExpense - curentExpense.amount;

      await req.user.update(
        { totalExpense:expense },
        {transaction:t}
      );
      
      await t.commit()
      res.status(204).end();
    } catch (err) {
      await t.rollback();
      console.error('Error deleting expense:', err);
      res.status(500).json({ err: 'Internal Server Error' });
    }
}
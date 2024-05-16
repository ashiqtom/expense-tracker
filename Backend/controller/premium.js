const User = require('../models/user');
const UserServices=require('../services/userservices');
const S3Services=require('../services/S3services');
const FileDownloaded=require('../models/filesDownloaded');
 
// exports.downloadRecoard=async (req, res) => { 
//     try {
//       const isPremiumUser = req.user.ispremiumuser;
//       if(isPremiumUser){
//         const page= +req.query.page || 1;
      
//         let totalaItems=await FileDownloaded.count({
//           where: { UserId: req.user.id }
//         });
//         const itemsPerPage=2;
//         const downloadRecoard=await FileDownloaded.findAll({
//            where : { UserId : req.user.id },
//           offset:(page-1)*itemsPerPage,
//           limit:itemsPerPage,
//           })
//         res.status(201).json({
//           downloadRecoard:downloadRecoard,
//           currentPage:page,
//           HasNextPage:itemsPerPage*page<totalaItems,
//           nextPage:page+1,
//           hasPreviousPage:page>1,
//           previousPage:page-1,
//           lastPage:Math.ceil(totalaItems/itemsPerPage),
//         })
//       }else{
//         res.status(401).json({ success: false, message: "Unauthorized : you are not a premium user" });
//       }
//     } catch (err) {
//         console.error('Error fetching:', err);
//         res.status(500).json({ error: 'Failed to fetch' ,err:err});
//     }
// };
  
exports.downloadRecoard=async (req, res) => { 
  try {
    const isPremiumUser = req.user.ispremiumuser;
    if(isPremiumUser){
      const downloadRecoard=await FileDownloaded.findAll({ where : { UserId : req.user.id }})
      res.status(201).json(downloadRecoard)
    }else{
      res.status(401).json({ success: false, message: "Unauthorized : you are not a premium user" });
    }
  } catch (err) {
      console.error('Error fetching:', err);
      res.status(500).json({ error: 'Failed to fetch' ,err:err});
  }
};

exports.download=async (req, res) => { 
    try {
      const isPremiumUser = req.user.ispremiumuser;
      if(isPremiumUser){
        const expense=await UserServices.getExpenses(req);
        const stringifiedExpenses = JSON.stringify(expense);

        const filename=`Expense${req.user.id}/${new Date()}.txt`;
        const fileUrl=await S3Services.uploadToS3(stringifiedExpenses,filename);

        await FileDownloaded.create({url:fileUrl.Location,UserId:req.user.id})
        
        res.status(201).json(fileUrl )
      }else{
        res.status(401).json({ success: false, message: "Unauthorized : you are not a premium user" });
      }
    } catch (err) {
        console.error('Error fetching:', err);
        res.status(500).json({ error: 'Failed to fetch' ,err:err});
    }
};
  

exports.getPremium = async (req, res) => {
    try {
      const isPremiumUser = req.user.ispremiumuser;
      if(isPremiumUser){
        const aggExp=await User.findAll({
          attributes:["username","totalExpense"],
          order:[["totalExpense",'DESC']]
        })
        res.status(200).json(aggExp)
      }else{
         res.status(401).json({ success: false, message: "Unauthorized : you are not a premium user" });
      }
    } catch (err) {
        console.error('Error fetching:', err);
        res.status(500).json({ error: 'Failed to fetch' });
    }
};

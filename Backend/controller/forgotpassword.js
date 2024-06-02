const User = require('../models/user');
const forgotPasswordRequest = require('../models/forgotPasswordRequests');
const bcrypt = require('bcrypt');
const Sib=require('sib-api-v3-sdk');

const client=Sib.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.SIB_API_KEY;
const tranEmailApi=new Sib.TransactionalEmailsApi()

const { v4: uuidv4 } = require('uuid');

exports.forgot= async (req, res) => {
    try {     
        const { email } = req.body;
        const user= await User.findOne({ where: { email } });
        if(!user){
            return res.status(404).json({ message: 'user not found' });
        }
        const id = uuidv4();
        await forgotPasswordRequest.create({id,isActive:true,UserId:user.id})
    
        const sender={
            email:'dummy@gmail.com'
        };
        const receivers=[{
            email:email 
        }];
        const response = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Reset password',
            htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
            
         });
        res.status(200).json({ message: 'Reset email sent successfully' });
    } catch (error) {
        console.error('Failed to send reset email:', error);
        res.status(500).json({ error: 'Failed to send reset email' });
    }
};

exports.resetpassword=async (req, res) => {
    try{
        const id =  req.params.id;
        const forgotDetails =await forgotPasswordRequest.findOne({ where : { id }})
        if(forgotDetails.isActive){
            await forgotDetails.update({ isActive: false});
            res.status(200).send(`             
                                <!DOCTYPE html>
                                <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>updatePassword</title>
                                </head>
                                <body>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newPassword">Enter New password</label>
                                        <input name="newPassword" type="password" required></input>
                                        <button>reset</button>
                                    </form>
                                </body>
                                </html>
                                `);   
        }else{
            res.status(401).json({ error: 'already used reset email option' });
        }
               
    } catch(error){
        console.error('Failed to reset email:', error);
        res.status(500).json({ error: 'Failed to  reset email' });
    }
}

exports.updatepassword =async (req, res) => {
    try {
        const newpassword = req.query.newPassword;
        const  passwordId  = req.params.id;     
        const forgotDetails =await forgotPasswordRequest.findOne({ where : { id: passwordId }})
        const user =await User.findOne({where: { id : forgotDetails.UserId}});
        if(user){
            const saltRounds = 10;
            const hashedPassword=await bcrypt.hash(newpassword, saltRounds );
            user.update({ password: hashedPassword })
            res.status(201).send(`<html><h3>Successfuly update the new password</h3></html>`)
        }else{
            return res.status(404).json({ error: 'No user Exists', success: false})
        }
    } catch(error){
        console.log(error)
        return res.status(403).json({ error, success: false } )
    }
}


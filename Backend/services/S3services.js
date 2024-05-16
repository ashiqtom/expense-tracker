const AWS=require('aws-sdk');

exports.uploadToS3=async(data,filename)=>{
    try {
        const BUCKET_NAME=process.env.awsbucketName;
        const IAM_USER_KEY= process.env.awsAccesskeyID;
        const IAM_USER_SECRET= process.env.awsSecretaccesskey;
    
        const s3bucket=new AWS.S3({
            accessKeyId:IAM_USER_KEY,
            secretAccessKey:IAM_USER_SECRET
        })
        const params={
            Bucket:BUCKET_NAME,
            Key:filename,
            Body:data,
            ACL:'public-read'
        }
        const response = await s3bucket.upload(params).promise();
        //console.log('Upload success', response);
        return response; 
    } catch (err) {
        console.log('Upload error', err);
        throw err;
    }
}

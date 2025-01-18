const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.s3Upload = async (file) => {
  const { name, type, data: fileData,folder } = file;
  const uploadParams = {
    Bucket: process.env.COMMUNICATION_BUCKET,
    Key: `${folder}/${Date.now()}-${name}`,
    Body: Buffer.from(fileData), // Convert binary data to buffer
    ContentType: type,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);
     const fileUrl = `https://${process.env.COMMUNICATION_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;

    console.log('File uploaded successfully:', response);
    return {msg:"success",data:fileUrl }
  } catch (err) {
    console.error('Error uploading file:', err);
    return {msg:"failed",data:err}
  }
};



const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.s3Upload = async (file) => {
  const { name, type, data: fileData, folder } = file;

  let fileBuffer;
  
  // Check if data is already a Buffer or needs Base64 conversion
  if (typeof fileData === "string") {
    console.log("📂 Converting Base64 to Buffer...");
    fileBuffer = Buffer.from(fileData, "base64"); // Convert Base64 to Buffer
  } else {
    console.log("📂 Using existing Buffer...");
    fileBuffer = fileData; // Already a Buffer from React Web
  }

  const uploadParams = {
    Bucket: process.env.COMMUNICATION_BUCKET,
    Key: `${folder}/${Date.now()}-${name}`,
    Body: fileBuffer, // Upload as Buffer
    ContentType: type,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    const fileUrl = `https://${process.env.COMMUNICATION_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;

    console.log("File uploaded successfully:", fileUrl);
    return { msg: "success", data: fileUrl };
  } catch (err) {
    console.error("Error uploading file:", err);
    return { msg: "failed", data: err.message };
  }
};

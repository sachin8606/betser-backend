const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); 
// Helper function to convert webm to mp4
const convertWebmToMp4 = (inputBuffer) => {
    return new Promise((resolve, reject) => {
      const inputPath = path.join(__dirname, `temp_input_${uuidv4()}.webm`);
      const outputPath = path.join(__dirname, `temp_output_${uuidv4()}.mp4`);
  
      fs.writeFileSync(inputPath, inputBuffer);
  
      ffmpeg(inputPath)
        .output(outputPath)
        .on('end', () => {
          const mp4Buffer = fs.readFileSync(outputPath);
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
          resolve(mp4Buffer);
        })
        .on('error', (err) => {
          fs.unlinkSync(inputPath);
          reject(err);
        })
        .run();
    });
  };

  module.exports = {convertWebmToMp4}
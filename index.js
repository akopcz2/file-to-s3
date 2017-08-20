let AWS = require('aws-sdk'),
fs = require('fs'),
prompt = require('prompt');
require('dotenv').config();

let accessKey, secretKey, bucket;

if(process.env.ACCESS_KEY){
  accessKey = process.env.ACCESS_KEY;
}

if(process.env.SECRET_KEY){
  secretKey = process.env.SECRET_KEY;
}

if(process.env.BUCKET){
  bucket = process.env.BUCKET;
}

// For dev purposes only
AWS.config.update({ accessKeyId: `${accessKey}`, secretAccessKey: `${secretKey}` });

 prompt.start();
 
  // 
  // Get two properties from the user: username and email 
  // 
  prompt.get(['filename',], function (err, result) {

    let epFile = result.filename;
    passFileToS3(file)
  });


function passFileToS3(file){
  // Read in the file, convert it to base64, store to S3
  fs.readFile(`${file}.apk`, function (err, data) {
    if (err) { throw err; }

    let base64data = new Buffer(data, 'binary');

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    month = month + 1;
    let year = date.getFullYear();
    let timestamp = Math.floor(date.getTime() / 1000);
    let dateString = `${month}_${day}_${year}_${timestamp}`;

    let s3 = new AWS.S3();
      s3.upload({
          Bucket: `${bucket}`,
          Key:  `${file}_${dateString}.apk`,
          Body: base64data,
          ACL: 'public-read'
      },function (resp) {
          console.log(arguments);
          console.log('Successfully uploaded package.');
      });
  });
};
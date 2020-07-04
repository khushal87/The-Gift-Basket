const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-2" });

let s3;
s3 = new AWS.S3({ apiVersion: '2006-03-01' });

var bucketParams = {
    Bucket: process.argv[2],
    ACL: 'public-read'
}

s3.createBucket(bucketParams, function (err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data.Location);
    }
});
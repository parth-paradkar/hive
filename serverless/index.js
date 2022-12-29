'use strict';
const AWS = require('aws-sdk');
const simpleParser = require('mailparser').simpleParser;
const s3 = new AWS.S3();
const dbClient = new AWS.DynamoDB.DocumentClient();

const bucketName = process.env.S3_BUCKET;
const tableName = process.env.EMAILS_TABLE;


module.exports.handler = function (event, context, callback) {
    var s3Object = event.Records[0].s3.object;
// Retrieve the email from your bucket
    var req = {
        Bucket: bucketName,
        Key: s3Object.key
    };
    s3.getObject(req, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err);
        } else {
            simpleParser(data.Body, (err, parsed) => {
                if (err) {
                    console.log(err, err.stack);
                    callback(err);
                } else {
                    var params = {
                        TableName: tableName,
                        Item: {
                            s3Key: req.Key,
                            userEmail: parsed.from.value[0].address,
                            date: parsed.date.getUTCDate(),
                            subject: parsed.subject,
                            htmlContent: parsed.html,
                            notes: []
                        }
                    }
                    dbClient.put(params, (err, data) => {
                        if(err) {
                            console.log(err);
                        }
                        else {
                            console.log(`Inserted S3 object ${req.Key} to DB`)
                            console.log(data)
                        }
                    });
                }
            });
        }
    });
};
const serverless = require('serverless-http')
const express = require('express')
const app = express()
const AWS = require('aws-sdk')
const bodyParser = require('body-parser');


const tableName = process.env.EMAILS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json({ strict: false }));

app.get('/bookmarks', (req, res) => {
    const params = {
        TableName: tableName,
    }
    dynamoDb.scan(params, (error, result) => {
        if(error) {
            console.log(error);
            res.status(400).json({ error: 'Could not get bookmarks' });
        }
        if(result.Items) {
            res.json(result.Items)
        } else {
            res.status(400).json({ error: 'No bookmarks found!' });
        }
    })
})

module.exports.handler = serverless(app)
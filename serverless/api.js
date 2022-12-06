const serverless = require('serverless-http')
const express = require('express')
const app = express()
const AWS = require('aws-sdk')
const bodyParser = require('body-parser');


const tableName = process.env.EMAILS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views');

app.use(bodyParser.json({ strict: false }));
app.use(express.static('public'));

app.get('/bookmark/:id', (req, res) => {
    const params = {
        TableName: tableName,
        Key: {
            s3Key: req.params.id,
        }
    }
    dynamoDb.get(params, (err, data) => {
        if(err) {
            console.log(err)
            res.status(400).json({ error: 'Could not get bookmark' });   
        }
        else {
            res.render('bookmark', { subject: data.Item.subject, htmlContent: data.Item.htmlContent })
        }
    })
})

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
            res.render('index', { emails: result.Items.map((value) => { return { url: `/dev/bookmark/${value.s3Key}`, subject: value.subject } }) })
        } else {
            res.status(400).json({ error: 'No bookmarks found!' });
        }
    })
})

module.exports.handler = serverless(app)
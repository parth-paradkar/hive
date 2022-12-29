const serverless = require('serverless-http')
const express = require('express')
const app = express()
const AWS = require('aws-sdk')
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require("uuid")


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
            res.status(500).json({ error: 'Internal Server Error' });   
        }
        else {
            console.log(data);
            res.render('bookmark', { s3Key: req.params.id, subject: data.Item.subject, htmlContent: data.Item.htmlContent, notes: data.Item.notes })
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
            res.status(500).json({ error: 'Internal Server Error' });
        }
        if(result.Items) {
            res.render('index', { 
                emails: result.Items.map((value) => { 
                        return { 
                            url: `/dev/bookmark/${value.s3Key}`, 
                            subject: value.subject, 
                            s3Key: value.s3Key, 
                            date: value.date
                        } 
                    }) 
                }
            )
        } else {
            res.status(404).json({ error: 'No bookmarks found!' });
        }
    })
})

app.delete("/bookmarks/delete/:id", (req, res) => {
    const params = {
        TableName: tableName,
        Key: {
            s3Key: req.params.id,
        }
    }
    dynamoDb.delete(params, (err, data) => {
        if(err){
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' }); 
        } else {
            console.log(`Document with s3Key ${req.params.id} deleted successfully`);
            res.status(200).json("Bookmark deleted!")
        }
    })
})

app.post("/notes/add", (req, res) => {
    console.log(req)
    const key = req.query.key;
    const noteContent = req.body;
    const currentDate = new Date();
    const dateString = currentDate.toString();
    const params = {
        TableName: tableName,
        Key: {
            s3Key: key
        },
        UpdateExpression: 'SET #l = list_append(if_not_exists(#l, :empty_list), :val)',
        ExpressionAttributeNames: {
            "#l": "notes"
        },
        ExpressionAttributeValues: { 
            ":val": [{id: uuidv4(), content: noteContent, date: dateString}],
            ":empty_list": []
        },
        ReturnValues: 'UPDATED_NEW'
    }
    console.log(params)
    dynamoDb.update(params, (error, data) => {
        if (error) {
            console.error("Error updating item in table: ", error);
            res.status(500).json({ error: "Internal server error" });
        } else {
            console.log("Successfully updated item in table: ", data);
            res.status(200).json({ data: data });
        }
    })
})

module.exports.handler = serverless(app)
# Hive

Hive is a self-hosted newsletter archive. The user can forward newsletter emails to the Hive email service and browse them on a web page. For personal use, the application fits into AWS's free plan.

Hive makes use of AWS's Simple Email Service , which creates objects in an S3 bucket when it receives an email. This triggers a Lambda function that parses the data in the S3 file and pushes it to DynamoDB. The data in DynamoDB is served through a web app also created through AWS Lambda.

## Setup

Note: Setup requires having a domain name and an AWS account

1. Setup AWS SES for receiving emails
   Follow the steps given [here](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-setting-up.html). Create a rule set that pushes incoming emails to S3.

2. Setup serverless locally
   Follow the steps given [here](https://www.serverless.com/framework/docs/getting-started/).

3. Clone the repository locally

4. Deploy the serverless application using the CLI command
   ```bash
   cd serverless
   serverless deploy
   ```

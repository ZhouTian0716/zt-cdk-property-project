// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
import {AttributeValue} from "dynamodb-data-types"
// Set the region
AWS.config.update({ region: 'INSERT_REGION_NAME_HERE' });
let data = require(process.argv[2]);
// Create DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10'});
let items = [];
for (let index = 0; index < data.length; index++) {
    const element = data[index];
    // Format element in the correct format for DynamoDB's API 
    let item = {
        PutRequest: {
            Item: AttributeValue.wrap(element)
        }
    };
    items.push(item);

    if (items.length == 25 || index == data.length-1) {
        let params = {
            RequestItems: {
            }
        };
        params["RequestItems"][process.argv[3]] = items;
        // Async function call to write the items to the DB 
        ddb.batchWriteItem(params, function (err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data);
            }
        });
        items = [];
    }
}
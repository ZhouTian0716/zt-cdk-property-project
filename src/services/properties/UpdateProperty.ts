import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function updateProperty(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters && "id" in event.queryStringParameters && event.body) {
    const parsedBody = JSON.parse(event.body);
    const propertyId = event.queryStringParameters["id"];
    console.log("propertyId", propertyId);
    console.log("parsedBody", parsedBody);
    const requestBodyKey = Object.keys(parsedBody)[0];
    console.log("requestBodyKey", requestBodyKey);
    const requestBodyValue = parsedBody[requestBodyKey];
    console.log("requestBodyValue", requestBodyValue);

    const updateResult = await ddbClient.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: { id: { S: propertyId } },
        UpdateExpression: "set #zzzNew = :new",
        ExpressionAttributeValues: { ":new": { S: requestBodyValue } },
        ExpressionAttributeNames: { "#zzzNew": requestBodyKey },
        ReturnValues: "UPDATED_NEW",
      })
    );
    return {
        statusCode: 204,
        body: JSON.stringify(updateResult.Attributes),
    }
  }
  return {
    statusCode: 400,
    body: JSON.stringify("Please provide right args!!"),
  };
}

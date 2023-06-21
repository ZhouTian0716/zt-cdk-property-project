import { DynamoDBDocumentClient, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getProperties(event: APIGatewayProxyEvent, ddbDocClient: DynamoDBDocumentClient): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters) {
    if ("id" in event.queryStringParameters) {
      const propertyId = event.queryStringParameters["id"];
      const getItemResponse = await ddbDocClient.send(
        new GetCommand({
          TableName: process.env.TABLE_NAME,
          Key: {
            id: propertyId,
          },
        })
      );
      if (getItemResponse.Item) {
        return {
          statusCode: 200,
          body: JSON.stringify(getItemResponse.Item),
        };
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify(`Property with id ${propertyId} not found!`),
        };
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify("id is required"),
      };
    }
  }

  // Dangerous! This will return all items in the table, costing you money!
  const result = await ddbDocClient.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );
  const Items = result.Items;
  return {
    statusCode: 200,
    body: JSON.stringify(Items),
  };
}

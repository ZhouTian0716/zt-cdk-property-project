import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

export async function postPropertiesWithDoc(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
  const randomId = v4();
  const item = JSON.parse(event.body);
  item.id = randomId;
  console.log("request-body", item);
  const result = await ddbDocClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,

      Item: item,
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify(randomId),
  };
}

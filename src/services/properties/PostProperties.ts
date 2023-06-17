import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

export async function postProperties(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const randomId = v4();
  const item = JSON.parse(event.body);
  console.log('request-body',item);
  const result = await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        id: { S: randomId },
        address: { S: item.address }
      },
    })
  );
  console.log(result);
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
}

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";
import { validateAsPropertyEntry } from "../shared/Validator";
import { marshall } from "@aws-sdk/util-dynamodb";

export async function postProperties(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const randomId = v4();
  const item = JSON.parse(event.body);
  item.id = randomId;

  validateAsPropertyEntry(item);

  const result = await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        id: { S: randomId },
        address: { S: item.address },
        description: { S: item.description },
      },
    })
  );
  // console.log(result);
  return {
    statusCode: 200,
    body: JSON.stringify({ id: item.id }),
  };
}

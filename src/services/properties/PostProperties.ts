import { DynamoDBDocumentClient,PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { validateAsPropertyEntry } from "../shared/Validator";
import { createRandomId, parseJSON } from "../shared/Utils";

export async function postProperties(event: APIGatewayProxyEvent, ddbDocClient: DynamoDBDocumentClient): Promise<APIGatewayProxyResult> {
  const randomId = createRandomId();
  const item = parseJSON(event.body);
  item.id = randomId;

  validateAsPropertyEntry(item);

  const result = await ddbDocClient.send(
  new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: item,
  })
);

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
}


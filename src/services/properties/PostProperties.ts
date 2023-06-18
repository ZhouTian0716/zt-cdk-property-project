import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { validateAsPropertyEntry } from "../shared/Validator";
import { marshall } from "@aws-sdk/util-dynamodb";
import { createRandomId, parseJSON } from "../shared/Utils";

export async function postProperties(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const randomId = createRandomId();
  const item = parseJSON(event.body);
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

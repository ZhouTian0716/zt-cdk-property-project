import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hasAdminGroup } from "../shared/Utils";

export async function deleteProperty(event: APIGatewayProxyEvent, ddbDocClient: DynamoDBDocumentClient): Promise<APIGatewayProxyResult> {
  if (!hasAdminGroup(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify("Only Admins can access delete route!"),
    };
  }

  if (event.queryStringParameters && "id" in event.queryStringParameters) {
    const propertyId = event.queryStringParameters["id"];

    await ddbDocClient.send(
      new DeleteCommand({
        TableName: process.env.TABLE_NAME,
        Key: { id: propertyId },
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify(`Successfully deleted property with id ${propertyId}`),
    };
  }
  return {
    statusCode: 400,
    body: JSON.stringify("Please provide right args!!"),
  };
}

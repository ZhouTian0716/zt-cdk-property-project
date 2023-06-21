import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postProperties } from "./PostProperties";
import { getProperties } from "./GetProperties";
import { updateProperty } from "./UpdateProperty";
import { deleteProperty } from "./DeleteProperty";
import { JsonError, MissingFieldError } from "../shared/Validator";
import { addCorsHeader } from "../shared/Utils";
import { translateConfig } from "../shared/config";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client, translateConfig);

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let response: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getProperties(event, ddbDocClient);
        response = getResponse;
        break;
      case "POST":
        const postResponse = await postProperties(event, ddbDocClient);
        response = postResponse;
        break;
      case "PUT":
        const putResponse = await updateProperty(event, ddbDocClient);
        response = putResponse;
        break;
      case "DELETE":
        const deleteResponse = await deleteProperty(event, ddbDocClient);
        response = deleteResponse;
        break;
      default:
        break;
    }
  } catch (error) {
    if (error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: error.message,
      };
    }
    if (error instanceof JsonError) {
      return {
        statusCode: 400,
        body: error.message,
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }

  addCorsHeader(response);
  return response;
}

export { handler };

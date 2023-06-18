import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postProperties } from "./PostProperties";
import { getProperties } from "./GetProperties";
import { postPropertiesWithDoc } from "./PostPropertiesWithDoc";
import { updateProperty } from "./UpdateProperty";
import { deleteProperty } from "./DeleteProperty";
import { MissingFieldError } from "../shared/Validator";

const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let message: string;

  try {
    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getProperties(event, ddbClient);
        console.log("checking res",getResponse);
        return getResponse;
      case "POST":
        const postResponse = await postProperties(event, ddbClient);
        return postResponse;
      case "PUT":
        const putResponse = await updateProperty(event, ddbClient);
        return putResponse;
      case "DELETE":
        const deleteResponse = await deleteProperty(event, ddbClient);
        return deleteResponse;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
    if(error instanceof MissingFieldError){
      return {
        statusCode: 400,
        body: JSON.stringify(error),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message),
  };

  return response;
}

export { handler };

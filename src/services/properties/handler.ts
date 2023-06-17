import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let message: string;
  switch (event.httpMethod) {
    case "GET":
      message = "hehee from get";
      break;
    case "POST":
      message = "hehee from post";
      break;
    default:
      break;
  }
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message),
  };

  return response;
}

export { handler };

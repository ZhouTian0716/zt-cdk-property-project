import { handler } from "../src/services/properties/handler";

process.env.TABLE_NAME = "PropertiesTable-02c779044ee4";
process.env.AWS_REGION = "ap-southeast-2";

handler(
  {
    httpMethod: "GET",
    queryStringParameters:{
      id:"2900bf5d-5fde-4130-b17b-2ba66f838de8"
    }
  } as any,
  {} as any
);

// handler(
//   {
//     httpMethod: "POST",
//     body: JSON.stringify({
//       address: "http call from nodejs terminal",
//     }),
//   } as any,
//   {} as any
// );
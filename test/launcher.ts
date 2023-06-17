import { handler } from "../src/services/properties/handler";

process.env.TABLE_NAME = "PropertiesTable-02c779044ee4";
process.env.AWS_REGION = "ap-southeast-2";

handler(
  {
    httpMethod: "GET",
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
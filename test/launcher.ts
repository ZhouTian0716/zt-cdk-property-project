import { handler } from "../src/services/properties/handler";

process.env.TABLE_NAME = "PropertiesTable-02c779044ee4";
process.env.AWS_REGION = "ap-southeast-2";

// handler(
//   {
//     httpMethod: "GET",
//     // queryStringParameters: {
//     //   id: "2900bf5d-5fde-4130-b17b-2ba66f838de8",
//     // },
//   } as any,
//   {} as any
// );

handler(
  {
    httpMethod: "DELETE",
    queryStringParameters: {
      id: "2900bf5d-5fde-4130-b17b-2ba66f838de8",
    },
  } as any,
  {} as any
);

// handler(
//   {
//     httpMethod: "PUT",
//     queryStringParameters: {
//       id: "2900bf5d-5fde-4130-b17b-2ba66f838de8",
//     },
//     body: JSON.stringify({
//       address: "testing update new check",
//     }),
//   } as any,
//   {} as any
// );

// handler(
//   {
//     httpMethod: "POST",
//     body: JSON.stringify({
//       address: "http testing marshall",
//     }),
//   } as any,
//   {} as any
// );

// handler(
//   {
//     httpMethod: "GET",
//     // queryStringParameters:{
//     //   id:"2900bf5d-5fde-4130-b17b-2ba66f838de8"
//     // }
//   } as any,
//   {} as any
// );

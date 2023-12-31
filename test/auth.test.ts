import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";

// ZT-NOTE: This account needs to be activated before it can be used.
async function testAuth() {
  const service = new AuthService();
  const loginResult = await service.login("admin1", "Ateam12345)");
  console.log("LOGIN-ACCESS-TOKEN", loginResult.getSignInUserSession().getIdToken().getJwtToken());
  const credentials = await service.generateTemporaryCredentials(loginResult);
  console.log("credentails", credentials);
  const buckets = await listBuckets(credentials);
  console.log("BUCKETS FETCHED USING ASSIGN ROLES", buckets);
}

async function listBuckets(credentials: any) {
  const client = new S3Client({
    credentials: credentials,
  });
  const command = new ListBucketsCommand({});
  const result = await client.send(command);
  return result;
}

testAuth();

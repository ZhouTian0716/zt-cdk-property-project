import { type CognitoUser } from "@aws-amplify/auth";
import { Amplify, Auth } from "aws-amplify";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const awsRegion = "ap-southeast-2";

Amplify.configure({
  Auth: {
    region: awsRegion,
    userPoolId: "ap-southeast-2_eGOzIXMlU",
    userPoolWebClientId: "2trvpud071bup9m6daffq73iql",
    identityPoolId: "ap-southeast-2:37136033-01bf-475b-9dce-42b4ba221efe",
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
});

export class AuthService {
  public async login(userName: string, password: string) {
    const result = (await Auth.signIn(userName, password)) as CognitoUser;
    return result;
  }

  public async generateTemporaryCredentials(user: CognitoUser) {
    const jwtToken = user.getSignInUserSession().getIdToken().getJwtToken();
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/ap-southeast-2_eGOzIXMlU`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: "ap-southeast-2:37136033-01bf-475b-9dce-42b4ba221efe",
        logins: {
          [cognitoIdentityPool]: jwtToken,
        },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}

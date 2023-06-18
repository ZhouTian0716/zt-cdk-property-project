import { type CognitoUser } from '@aws-amplify/auth';
import { Amplify, Auth } from 'aws-amplify';
// import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
// import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'

const awsRegion = 'ap-southeast-2'

Amplify.configure({
    Auth: {
        region: awsRegion,
        userPoolId: 'ap-southeast-2_eGOzIXMlU',
        userPoolWebClientId: '2trvpud071bup9m6daffq73iql',
        // identityPoolId: 'eu-west-1:5b2b0567-17ce-4070-b540-3e4688c46f43',
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
});

export class AuthService {
  public async login(userName: string, password: string) {
    const result = (await Auth.signIn(userName, password)) as CognitoUser;
    return result;
  }
}

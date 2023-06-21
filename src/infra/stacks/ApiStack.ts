import { Stack, StackProps } from "aws-cdk-lib";
import { AuthorizationType, CognitoUserPoolsAuthorizer, Cors, LambdaIntegration, MethodOptions, ResourceOptions, RestApi } from "aws-cdk-lib/aws-apigateway";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  propertiesLambdaIntegration: LambdaIntegration;
  userPool: IUserPool;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);
    const api = new RestApi(this, "PropertiesApi");

    // ZT-NOTE: This is adding Cognito User Pool Authorizer to the API Gateway
    // Similar idea like the auth middle ware in Express application
    const authorizer = new CognitoUserPoolsAuthorizer(this, "PropertiesApiAuthorizer", {
      cognitoUserPools: [props.userPool],
      identitySource: "method.request.header.Authorization",
    });
    authorizer._attachToApi(api);

    const optionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      },
    };

    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    };

    // ZT-NOTE: "/properties" here
    const propertiesResource = api.root.addResource("properties", optionsWithCors);
    propertiesResource.addMethod("GET", props.propertiesLambdaIntegration);
    propertiesResource.addMethod("POST", props.propertiesLambdaIntegration);
    propertiesResource.addMethod("PUT", props.propertiesLambdaIntegration, optionsWithAuth);
    propertiesResource.addMethod("DELETE", props.propertiesLambdaIntegration, optionsWithAuth);
  }
}

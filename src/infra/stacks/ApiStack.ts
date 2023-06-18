import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  propertiesLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);
    const api = new RestApi(this, "PropertiesApi");
    // ZT-NOTE: "/properties" here
    const propertiesResource = api.root.addResource("properties");
    propertiesResource.addMethod("GET", props.propertiesLambdaIntegration);
    propertiesResource.addMethod("POST", props.propertiesLambdaIntegration);
    propertiesResource.addMethod("PUT", props.propertiesLambdaIntegration);
    propertiesResource.addMethod("DELETE", props.propertiesLambdaIntegration);
  }
}

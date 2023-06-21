import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
import { UiDeploymentStack } from "./stacks/UiDeploymentStack";

const app = new App();
const dataStack = new DataStack(app, "DataStack");
const lambdaStack = new LambdaStack(app, "LambdaStack", {
  propertiesTable: dataStack.propertiesTable,
});
const authStack = new AuthStack(app, 'AuthStack');
new ApiStack(app, "ApiStack", {
  propertiesLambdaIntegration: lambdaStack.propertiesLambdaIntegration,
  userPool: authStack.userPool
});
// new UiDeploymentStack(app, 'UiDeploymentStack', {
//   deploymentBucket: dataStack.deploymentBucket
// })

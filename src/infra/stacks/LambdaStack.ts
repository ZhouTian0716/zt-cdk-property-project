import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
// Note: This is specific to Node.js
// And it needs esbuild to be installed
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface LambdaStackProps extends StackProps {
  propertiesTable: ITable;
}

export class LambdaStack extends Stack {
  public readonly propertiesLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const propertiesLambda = new NodejsFunction(this, "PropertiesLambda", {
      runtime: Runtime.NODEJS_16_X,
      handler: "handler",
      entry: join(__dirname, "..", "..", "services", "properties", "handler.ts"),
      environment: {
        TABLE_NAME: props.propertiesTable.tableName,
      },
    });


    this.propertiesLambdaIntegration = new LambdaIntegration(propertiesLambda);
  }
}

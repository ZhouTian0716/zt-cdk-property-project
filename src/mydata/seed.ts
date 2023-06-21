import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CustomResource, Duration } from 'aws-cdk-lib';
import { Function, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

interface SeedDynamoDBProps {
  tableName: string;
  data: object[];
}

class SeedDynamoDB extends Construct {
  constructor(scope: Construct, id: string, props: SeedDynamoDBProps) {
    super(scope, id);

    const lambdaFunction = new Function(this, 'SeedDynamoDBFunction', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('path/to/lambda/code'), // Replace with the path to your Lambda function code
      handler: 'index.handler',
      timeout: Duration.minutes(5),
    });

    lambdaFunction.addToRolePolicy(
      new PolicyStatement({
        actions: ['dynamodb:PutItem'],
        resources: [props.tableName],
      })
    );

    const customResource = new CustomResource(this, 'SeedDynamoDBResource', {
      serviceToken: lambdaFunction.functionArn,
      properties: {
        tableName: props.tableName,
        data: props.data,
      },
    });

    // Add a dependency between the custom resource and the DynamoDB table
    customResource.node.addDependency(props.tableName);
  }
}

const app = new cdk.App();

// Replace with your stack name
const stack = new cdk.Stack(app, 'MyStack');

// Replace with your DynamoDB table name
const tableName = 'YourTableName';

// Replace with the path to your JSON data file
const jsonData = require('./path/to/data.json');

new SeedDynamoDB(stack, 'SeedDynamoDB', {
  tableName,
  data: jsonData,
});

app.synth();
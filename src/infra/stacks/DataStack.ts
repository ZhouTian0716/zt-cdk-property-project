import { Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../Utils";

export class DataStack extends Stack {
  public readonly propertiesTable: ITable;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id);
    const suffix = getSuffixFromStack(this);
    this.propertiesTable = new Table(this, "PropertiesTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: `PropertiesTable-${suffix}`,
    });
  }
}

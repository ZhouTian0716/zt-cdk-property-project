import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { CfnUserPoolGroup, UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class AuthStack extends Stack {
  public userPool: UserPool;
  private userPoolClient: UserPoolClient;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.createUserPool();
    this.createUserPoolClient();
    this.createAdminsGroup();
  }

  private createUserPool() {
    this.userPool = new UserPool(this, "CRMUserPool", {
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true,
      },
    });
    new CfnOutput(this, "CRMUserPoolId", {
      value: this.userPool.userPoolId,
    });
  }

  private createUserPoolClient() {
    this.userPoolClient = this.userPool.addClient("CRMUserPoolClient", {
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
    });
    new CfnOutput(this, "CRMUserPoolClientId", {
      value: this.userPoolClient.userPoolClientId,
    });
  }

  private createAdminsGroup() {
    new CfnUserPoolGroup(this, "CRMAdmins", {
      userPoolId: this.userPool.userPoolId,
      groupName: "admins",
    });
  }
}

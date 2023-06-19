import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, CfnUserPoolGroup, UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Effect, FederatedPrincipal, PolicyStatement, Role } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";



export class AuthStack extends Stack {
  public userPool: UserPool;
  private userPoolClient: UserPoolClient;
  private identityPool: CfnIdentityPool;
  // Roles for identity pool
  private authenticatedRole: Role;
  private unAuthenticatedRole: Role;
  private adminRole: Role;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.createUserPool();
    this.createUserPoolClient();
    this.createIdentityPool();
    this.createRoles();
    this.attachRoles();
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

  // ZT-NOTE: This initialises the identity pool.
  private createIdentityPool() {
    this.identityPool = new CfnIdentityPool(this, "PropertyIdentityPool", {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: this.userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });
    new CfnOutput(this, "PropertyIdentityPoolId", {
      value: this.identityPool.ref,
    });
  }

  // ZT-NOTE: Admin user can do delete for example.
  private createAdminsGroup() {
    new CfnUserPoolGroup(this, "CRMAdmins", {
      userPoolId: this.userPool.userPoolId,
      groupName: "admins",
      roleArn: this.adminRole.roleArn,
    });
  }

  // ZT-NOTE: Add roles for S3 access for example.
  private createRoles() {
    this.authenticatedRole = new Role(this, "CognitoDefaultAuthenticatedRole", {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });
    this.unAuthenticatedRole = new Role(this, "CognitoDefaultUnauthenticatedRole", {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "unauthenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });
    this.adminRole = new Role(this, "CognitoAdminRole", {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });
    this.adminRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:PutObject", "s3:PutObjectAcl", "s3:ListAllMyBuckets"],
        resources: ["*"],
      })
    );
  }

  private attachRoles() {
    new CfnIdentityPoolRoleAttachment(this, "RolesAttachment", {
      identityPoolId: this.identityPool.ref,
      roles: {
        authenticated: this.authenticatedRole.roleArn,
        unauthenticated: this.unAuthenticatedRole.roleArn,
      },
      // ZT-NOTE: Previous roles setup get roles encoded in the token.
      roleMappings: {
        adminsMapping: {
          type: "Token",
          ambiguousRoleResolution: "AuthenticatedRole",
          identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`,
        },
      },
    });
  }
}

```
aws cognito-idp admin-set-user-password --user-pool-id ap-southeast-2_eGOzIXMlU --username <your-user-name> --password <your-password)> --permanent
```

```
cdk deploy --all --outputs-file outputs.json
```

```
aws dynamodb put-item --table-name PropertiesTable-02c779044ee4 --item '{"id":{"S":"75090c83-8d1a-41b2-89b1-298f74655555"},"address":{"S":"zt3"},"description":{"S":"holly with cli"},"phone":{"N":"555"}}'
```
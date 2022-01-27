# Personal Code Artifact Repo

This simply little CDK project creates a CDN backed code repo
for distributing artifacts (for things like Maven, etc).

## How to customize

Replace the following:

- `bucketName`: the name of the artifact store
- `HostZone`: need this for a vanity domain
- `CNameRecord`: your vanity domain

This repo creates CFN infra for maintaining `artifacts.philcali.me` repo.
Good luck!

## How to use it

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

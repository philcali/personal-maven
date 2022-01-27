import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as PersonalMaven from '../lib/personal-maven-stack';

test('Bucket is created with public ACLs', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new PersonalMaven.PersonalMavenStack(app, 'MyTestStack');
    // THEN
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::S3::Bucket', {
        PublicAccessBlockConfiguration: {
            BlockPublicAcls: true,
            BlockPublicPolicy: true
        }
    });
});

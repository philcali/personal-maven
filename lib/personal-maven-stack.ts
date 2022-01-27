import {
  Stack,
  StackProps,
  aws_certificatemanager as acm,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_route53 as route53,
  aws_s3 as s3,
  ArnFormat,
  Duration
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

const DOMAIN_NAME = 'philcali.me';
const ZONE_ID = 'ZI7HL5YZ6FD32';
const CERT_ID = '2bb9cc4e-cc87-4fb8-aa7e-c5888c0110aa';

export class PersonalMavenStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'PersonalMavenArtifacts', {
      bucketName: 'philcali-artifact-repo',
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        blockPublicPolicy: true
      })
    });

    const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'PersonalHZ', {
      hostedZoneId: ZONE_ID,
      zoneName: DOMAIN_NAME
    });

    const certificate = acm.Certificate.fromCertificateArn(this, 'PersonalCert', this.formatArn({
      service: "acm",
      resource: "certificate",
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      resourceName: CERT_ID
    }));

    const distribution = new cloudfront.Distribution(this, "PersonlMaven", {
      defaultBehavior: {
        origin: new origins.S3Origin(bucket),
        cachePolicy: new cloudfront.CachePolicy(this, "MavenCachePolicy", {
          minTtl: Duration.minutes(1),
          maxTtl: Duration.hours(4)
        })
      },
      domainNames: [ `artifacts.${DOMAIN_NAME}` ],
      certificate,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2019
    });

    new route53.CnameRecord(this, 'MavenCNAME', {
      zone,
      domainName: distribution.domainName,
      recordName: `artifacts.${DOMAIN_NAME}`,
      ttl: Duration.minutes(5)
    });
  }
}

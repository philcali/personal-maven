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
import configuration from './configuration';
import { Construct } from 'constructs';

export class PersonalMavenStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'PersonalMavenArtifacts', {
      bucketName: configuration.bucketName,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        blockPublicPolicy: true
      })
    });

    const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'PersonalHZ', {
      hostedZoneId: configuration.zoneId,
      zoneName: configuration.domainName
    });

    const certificate = acm.Certificate.fromCertificateArn(this, 'PersonalCert', this.formatArn({
      service: "acm",
      resource: "certificate",
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      resourceName: configuration.certificateId
    }));

    const distribution = new cloudfront.Distribution(this, "PersonlMaven", {
      defaultBehavior: {
        origin: new origins.S3Origin(bucket),
        cachePolicy: new cloudfront.CachePolicy(this, "MavenCachePolicy", {
          minTtl: Duration.minutes(1),
          maxTtl: Duration.hours(4)
        })
      },
      domainNames: [ configuration.subdomain ],
      certificate,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2019
    });

    new route53.CnameRecord(this, 'MavenCNAME', {
      zone,
      domainName: distribution.domainName,
      recordName: configuration.subdomain,
      ttl: Duration.minutes(5)
    });
  }
}

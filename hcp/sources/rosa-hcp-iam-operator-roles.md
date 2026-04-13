# Sources: ROSA HCP IAM Operator Roles & Route53 DNS

Generated: 2026-04-13

## Primary sources

### Red Hat Documentation

| URL | Content | Access | Date verified |
|-----|---------|--------|---------------|
| https://docs.redhat.com/en/documentation/red_hat_openshift_service_on_aws/4/html/introduction_to_rosa/cloud-experts-rosa-hcp-sts-explained | ROSA HCP STS & OIDC explained — IRSA flow, operator roles, OIDC provider details | Public | 2026-04-13 |
| https://docs.redhat.com/en/documentation/red_hat_openshift_service_on_aws/4/html/install_rosa_with_hcp_clusters/rosa-hcp-sts-creating-a-cluster-quickly | Creating ROSA HCP cluster — operator role creation steps, --hosted-cp flag | Public | 2026-04-13 |
| https://docs.redhat.com/en/documentation/red_hat_openshift_service_on_aws/4/html/install_rosa_with_hcp_clusters/rosa-hcp-aws-private-creating-cluster | ROSA HCP private cluster — Route53 private hosted zones, DNS forwarding | Public | 2026-04-13 |
| https://docs.redhat.com/en/documentation/red_hat_openshift_service_on_aws/4/html/authentication_and_authorization/assuming-an-aws-iam-role-for-a-service-account | Assuming IAM roles via service accounts — IRSA token flow | Public | 2026-04-13 |
| https://docs.redhat.com/en/documentation/red_hat_openshift_service_on_aws/4/html/introduction_to_rosa/rosa-oidc-overview | ROSA OIDC provider overview | Public | 2026-04-13 |

### KCS / Access Portal

| URL | Content | Access | Date verified |
|-----|---------|--------|---------------|
| https://access.redhat.com/articles/7109571 | DNS Resolution in ROSA HCP vs ROSA Classic — private hosted zones, public zone for TLS only | Public | 2026-04-13 |

### AWS Documentation

| URL | Content | Access | Date verified |
|-----|---------|--------|---------------|
| https://docs.aws.amazon.com/rosa/latest/userguide/security-iam-awsmanpol-operator-policies.html | AWS managed policies for ROSA HCP operator roles — full list of 8 policies | Public | 2026-04-13 |
| https://docs.aws.amazon.com/aws-managed-policy/latest/reference/ROSAControlPlaneOperatorPolicy.html | ROSAControlPlaneOperatorPolicy — Route53 permissions (ChangeResourceRecordSets restricted to *.hypershift.local), VPC endpoint management | Public | 2026-04-13 |
| https://docs.aws.amazon.com/rosa/latest/userguide/getting-started-hcp.html | ROSA HCP getting started — rosa create operator-roles command, prerequisites | Public | 2026-04-13 |

## Key facts and their sources

| Claim | Source |
|-------|--------|
| 8 operator roles per cluster | AWS docs (security-iam-awsmanpol-operator-policies) |
| Naming pattern `<PREFIX>-<NS>-<OPERATOR>` | Red Hat docs (rosa-hcp-sts-creating-a-cluster-quickly) |
| ROSAControlPlaneOperatorPolicy scoped to `*.hypershift.local` | AWS docs (ROSAControlPlaneOperatorPolicy reference) |
| 2 private hosted zones per cluster | KCS 7109571, Red Hat docs (rosa-hcp-aws-private-creating-cluster) |
| Zone names: `<cluster>.hypershift.local` + `rosa.<prefix>.<id>.p3.openshiftapps.com` | KCS 7109571 |
| OIDC provider at `oidc.op1.openshiftapps.com` | Red Hat docs (cloud-experts-rosa-hcp-sts-explained) |
| Public zone exists for TLS cert validation only | KCS 7109571, Red Hat docs (rosa-hcp-aws-private-creating-cluster) |
| PrivateLink mandatory for all ROSA HCP clusters | Red Hat docs (rosa-hcp-networking) |
| `--hosted-cp` flag required for HCP operator roles | AWS docs (getting-started-hcp), Red Hat docs |
| CPO reconciliation is continuous (not event-triggered) | Inferred from Kubernetes controller model |

## Time-sensitive claims

- `ROSAControlPlaneOperatorPolicy` is at version v6 as of 2026-04-09 (AWS managed — auto-updates). Verify policy permissions if the page is used after significant AWS policy updates.
- ARO HCP is pre-GA as of 2026-04; the scope disclaimer on this page should be updated if ARO HCP reaches GA.

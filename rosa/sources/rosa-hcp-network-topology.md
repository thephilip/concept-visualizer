# Sources: ROSA HCP Network Topology

One-pager: `rosa/outputs/rosa-hcp-network-topology.html`
Date researched: 2026-04-07

---

## Primary sources

### Architecture

- **ROSA HCP architecture models** — control plane placement, PrivateLink overview, HA layout
  https://docs.redhat.com/en/documentation/red_hat_openshift_service_on_aws/4/html/architecture/rosa-architecture-models

- **AWS ROSA getting started (HCP)** — VPC requirements, CIDR defaults, subnet tagging, NAT gateway, egress configuration
  https://docs.aws.amazon.com/rosa/latest/userguide/getting-started-hcp.html

### PrivateLink and private clusters

- **ROSA HCP private cluster creation** — PrivateLink security group behavior, `--additional-allowed-principals`, VPC peering / Transit Gateway considerations
  https://docs.redhat.com/en/documentation/red_hat_openshift_service_on_aws/4/html/install_rosa_with_hcp_clusters/rosa-hcp-aws-private-creating-cluster

### DNS

- **KCS 7109571** — ROSA HCP vs Classic DNS architecture; dual-zone model (private + public zone); public zone for cert validation only; AWS Application Security team design review. Publicly accessible.
  https://access.redhat.com/articles/7109571

- **ROSA HCP custom DNS resolver tutorial** — Route 53 Inbound Resolver endpoint requirement for custom DNS servers
  https://docs.redhat.com/en/documentation/red_hat_openshift_service_on_aws/4/html/tutorials/cloud-experts-custom-dns-resolver

### Zero-egress

- **ROSA HCP zero-egress install**
  https://docs.redhat.com/en/documentation/red_hat_openshift_service_on_aws/4/html/install_rosa_with_hcp_clusters/rosa-hcp-egress-zero-install

---

## Supporting KCS articles (all publicly accessible as of 2026-04-07)

| KCS | Content | URL |
|---|---|---|
| 7109571 | DNS: ROSA HCP vs Classic — dual-zone model, cert validation | https://access.redhat.com/articles/7109571 |
| 7096266 | `rosa create network` CLI, VPC ownership, CloudFormation templates | https://access.redhat.com/articles/7096266 |
| 6980058 | Multiple ROSA clusters in a single VPC — supported/unsupported | https://access.redhat.com/solutions/6980058 |
| 7015390 | dnsmasq 40s timeout — **ARO-specific, does not apply to ROSA HCP** | https://access.redhat.com/solutions/7015390 |

---

## Claims requiring re-verification over time

- **Private hosted zone names** (`rosa.<prefix>.<id>.p3.openshiftapps.com`, `<cluster>.hypershift.local`) — zone naming convention could change across ROSA versions.
- **Zero-egress flag** (`--properties zero_egress:true`) — verify flag name is still current in the ROSA CLI before citing in cases.
- **PrivateLink endpoint SG behavior** — default security group allowing only VPC CIDR inbound; confirm behavior matches for new HCP versions.
- **OVN-Kubernetes as the only supported CNI** — no alternative documented as of research date; confirm if any future HCP releases add options.

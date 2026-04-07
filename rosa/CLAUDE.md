# ROSA conventions

Platform: **Red Hat OpenShift Service on AWS (ROSA)**  
Variants: **ROSA Classic** and **ROSA HCP (Hosted Control Planes)**  
Managed by: Red Hat SRE

Read this file for any one-pager covering ROSA-specific architecture, behavior, or failure modes. Read it alongside `../../guide.md`, not instead of it.

---

## Classic vs. HCP — always distinguish

ROSA has two fundamentally different architecture models. Content that is accurate for one is often wrong for the other. **Never write "ROSA" without specifying Classic or HCP** unless the behavior is genuinely identical in both.

| Concern | ROSA Classic | ROSA HCP |
|---|---|---|
| Control plane location | Customer AWS account | Red Hat AWS account |
| Control plane nodes | Customer-visible, customer pays | Not visible to customer |
| Worker nodes | Customer AWS account | Customer AWS account |
| SRE access model | Full cluster access | Isolated; limited customer-facing access |
| Upgrade mechanism | Standard OCP upgrade | HyperShift-based; faster, more granular |
| DNS | Route 53 private hosted zones | Route 53 private hosted zones |
| Cluster API endpoint | Public or private | Public or private |
| Pull secret updates | Manual | Supported from 4.20.6+ via `rosa` CLI |
| oc exec access | Standard | Restricted in some configurations |
| OLM / operator install | Standard | Some operators have HCP-specific constraints |

---

## DNS architecture (ROSA)

- **No dnsmasq.** CoreDNS forwards external queries directly to the AWS VPC resolver. The node-level dnsmasq hop that causes ARO's 40-second timeout issue **does not exist on ROSA**.
- AWS VPC resolver is typically at the VPC CIDR base + 2 (e.g. `10.0.0.2` for a `10.0.0.0/16` VPC).
- CoreDNS reads the node's `/etc/resolv.conf`, which on ROSA points directly to the VPC resolver — no intermediate forwarder.
- The DNS Operator and `dns.operator/default` `spec.servers[]` work the same as upstream OCP.

**ROSA HCP private clusters with custom DNS:**  
Custom DHCP option sets require additional configuration — Route 53 Inbound Resolver endpoints must be configured so that the custom DNS server can forward ROSA's private hosted zones back into AWS. See ROSA HCP custom DNS resolver tutorial on docs.redhat.com.

**ROSA Classic private clusters with custom DNS:**  
Same Route 53 Inbound Resolver pattern. See ROSA Classic custom DNS resolver tutorial on docs.redhat.com.

**Private hosted zones created during cluster provisioning:**
- HCP: `rosa.<domain-prefix>.<unique-id>.p3.openshiftapps.com` and `<cluster-name>.hypershift.local`
- Classic: `<domain-prefix>.<unique-id>.p1.openshiftapps.com`

These zones must be resolvable from within the VPC. Custom DNS servers must forward them to Route 53 Inbound Resolver endpoints.

---

## Networking

- **NLB hairpinning (Classic):** CoreDNS 900s cache TTL combined with NLB per-query IP rotation can cause intermittent connectivity. Known issue OCPBUGS-9026 — no platform fix as of last check.
- **MUO TLS / ML-KEM (ROSA):** Go 1.24+ enabled X25519MLKEM768 by default, producing larger ClientHello packets silently dropped by some AWS Network Firewalls. Workaround: `GODEBUG=tlsmlkem=0` applied by SRE; permanent fix requires customer firewall changes.
- AWS Security Groups and Network Firewall rules can cause DNS failures independently of in-cluster DNS config. Always check the AWS network perimeter.

---

## Identity and credentials

- ROSA uses **AWS STS / OIDC** for cluster and operator credentials — not long-lived IAM keys.
- Operator roles and OIDC provider must exist before cluster creation.
- Pull secret: managed by customer. HCP supports updates via `rosa update cluster --pull-secret` from 4.20.6+.

---

## SRE access and support boundary

- Red Hat SRE manages the control plane and has access to cluster infrastructure.
- Customers have `cluster-admin` on worker/application namespaces but not on SRE-managed namespaces.
- Break-fix boundary: Red Hat supports the platform; application-level issues, custom operator configs, and architecture consulting are out of scope for TSE cases.

---

## Upgrade and lifecycle

- ROSA follows OCP lifecycle with managed upgrade tooling.
- For upgrade pre-checks, use the ROSA Update Path tooling (not the OCP standard path tool).
- Open a proactive case before major upgrades — use the ROSA-specific proactive case process.
- EUS (Extended Update Support) channel subscription is required for EUS-to-EUS upgrade paths.
- cgroup v1 → v2 migration: occurs during upgrades to certain OCP versions. JVM workloads on old JDK versions (pre-cgroupv2 awareness) are at risk of OOMKill under cgv2's strict `memory.max`.

---

## HCP-specific notes

- **kube-scheduler metrics:** Known gap — OCPBUGS-57640 tracks missing kube-scheduler metrics in ROSA HCP.
- **PrivateLink lifecycle:** PrivateLink cluster severance is not a supported operation. Engineering-confirmed as of last check — verify current status before citing.
- **Cluster ownership transfer:** ROSA-390 tracks the ownership transfer feature. Verify current status before citing in a one-pager.
- **OLM bundle unpacking failures:** Some operators (e.g. CrowdStrike, NVIDIA GPU Operator) have HCP-specific OLM constraints. Check operator compatibility before authoring content about operator installs on HCP.
- **Log forwarding:** Two methods exist — OIDC-based CloudWatch audit log method and native `rosa create log-forwarder`. Equivalency between them has a documentation gap; verify before asserting they are interchangeable.

---

## Authoritative sources for ROSA

| Topic | Source |
|---|---|
| ROSA architecture overview | docs.aws.amazon.com/rosa/latest/userguide/rosa-architecture-models.html |
| DNS Operator in ROSA | docs.openshift.com/rosa/networking/dns-operator.html |
| HCP custom DNS resolver | docs.redhat.com — ROSA HCP custom DNS resolver tutorial |
| Classic custom DNS resolver | docs.redhat.com — ROSA Classic custom DNS resolver tutorial |
| NLB hairpinning | OCPBUGS-9026 |
| kube-scheduler metrics gap | OCPBUGS-57640 |

Always verify bug/Jira references are still open and accurately described before citing them. Status changes without notice.

---

## Scope banner text (copy-paste)

**ROSA-only content:**
> **ROSA-specific.** [The behavior described here] applies to Red Hat OpenShift Service on AWS. Specify Classic or HCP if the behavior differs between variants.

**ROSA Classic only:**
> **ROSA Classic-specific.** This does not apply to ROSA HCP or self-managed OCP.

**ROSA HCP only:**
> **ROSA HCP-specific.** This does not apply to ROSA Classic or self-managed OCP.

**Differentiating ROSA from ARO:**
> **AWS only (ROSA).** [ARO equivalent behavior or note that no equivalent exists on ARO.]

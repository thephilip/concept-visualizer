# OCP conventions

Platform: **Red Hat OpenShift Container Platform (OCP) — self-managed**  
Managed by: Customer (with Red Hat support)

Read this file for any one-pager covering self-managed OCP architecture or behavior. Read it alongside `../../guide.md`, not instead of it.

---

## What "self-managed OCP" means in this context

Self-managed OCP covers clusters installed by customers using the OpenShift installer (`openshift-install`) on any supported infrastructure — AWS, Azure, GCP, bare metal, VMware, or others. This is distinct from:

- **ARO** — managed OCP on Azure (Red Hat + Microsoft)
- **ROSA** — managed OCP on AWS (Red Hat SRE)
- **OSD** — managed OCP on AWS or GCP (Red Hat SRE, not covered separately here)

The customer is responsible for the control plane, worker nodes, infrastructure, and upgrades. Red Hat provides support and the software.

---

## DNS architecture (self-managed OCP)

- **No dnsmasq node forwarder.** The dnsmasq pattern is ARO-specific and does not apply here.
- CoreDNS forwards external queries to upstream resolvers via the node's `/etc/resolv.conf`. The contents of that file depend on the underlying infrastructure and how the cluster was installed.
- On AWS: node resolv.conf typically points to the AWS VPC resolver (CIDR base + 2).
- On Azure: node resolv.conf points to Azure DNS (`168.63.129.16`) — but without ARO's dnsmasq intermediary. The 40-second blocking behavior does not apply.
- On bare metal / VMware: resolv.conf reflects whatever DNS servers are provided by the network.
- The DNS Operator and `dns.operator/default` are the standard config interface on all platforms.

---

## Key differences from managed offerings

| Concern | Self-managed OCP | ARO / ROSA |
|---|---|---|
| Control plane access | Full customer access | Managed / restricted |
| SRE | None — customer operates | Red Hat SRE |
| Managed resource groups | Not applicable | ARO: deny assignments on managed RG |
| Upgrade scheduling | Customer-controlled | Managed (with customer input) |
| Pull secret | Customer-managed | Customer-managed |
| Network plugin choice | SDN (deprecated) or OVN-Kubernetes | OVN-Kubernetes (ARO/ROSA enforce this) |
| Installer types | IPI, UPI, Agent-based | Not customer-selectable |

---

## Network plugin

- **OVN-Kubernetes** is the current default and the only supported plugin going forward. SDN is deprecated.
- SDN → OVN migration must be completed before upgrading past the version where SDN is removed.
- Customers must not remove the migration annotation prematurely — doing so can leave the cluster in an unrecoverable state.

---

## MachineConfig and MachineConfigPool

- Customers have full control over `MachineConfig` and `MachineConfigPool` objects.
- MachineConfig changes trigger rolling node reboots via the Machine Config Operator (MCO).
- A degraded MachineConfigPool blocks upgrades. Common causes: unexpected on-disk state, osImageURL mismatch after upgrade.
- Every node must be associated with exactly one MachineConfigPool. Nodes without a pool association will not receive MCO updates.

---

## Upgrade and lifecycle

- Use the OCP standard upgrade path tooling (not ROSA-specific tooling).
- For upgrade pre-checks, follow KCS 7004992 — OCP section.
- EUS-to-EUS paths require EUS channel subscription and all intermediate acknowledgment gates.
- API deprecation review is required before any minor version upgrade (check removed APIs).
- cgroup v1 → v2 migration occurs during certain upgrades. JVM workloads on old JDKs are at risk.

---

## Support boundary notes for one-pagers

Self-managed OCP one-pagers should be clear about what is customer-operated vs. platform-provided:

- The customer controls node configuration, networking, storage, and upgrade timing.
- Red Hat support covers break-fix on the platform layer. Architecture and design consulting is out of scope for TSE cases.
- Third-party operator compatibility is the vendor's responsibility — Red Hat does not certify third-party compatibility with specific OCP versions.

---

## Authoritative sources for OCP

| Topic | Source |
|---|---|
| DNS Operator | docs.openshift.com — DNS Operator in OpenShift Container Platform |
| DNS Operator (GitHub, authoritative for behavior) | github.com/openshift/cluster-dns-operator |
| OCP upgrade pre-checks | KCS 7004992 |
| MachineConfig / MCO | docs.openshift.com — Machine Config Operator |
| Network plugin migration | docs.openshift.com — SDN to OVN-Kubernetes migration |
| API deprecation | docs.openshift.com — release notes for target version |

---

## Scope banner text (copy-paste)

**OCP self-managed only:**
> **Self-managed OCP.** This applies to clusters installed with the OpenShift installer on customer-managed infrastructure. Behavior may differ on managed offerings (ARO, ROSA).

**Clarifying difference from managed:**
> **Note:** On ARO, [specific difference]. On ROSA, [specific difference]. On self-managed OCP, [behavior described here].

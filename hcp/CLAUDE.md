# HCP conventions

Platform: **HyperShift / Hosted Control Planes**
Variants: **ROSA HCP**, **ARO HCP**, **Agent-based HCP**, **KubeVirt HCP**
Managed by: Red Hat SRE (control plane) / Customer (worker nodes and infrastructure)

Read this file for any one-pager covering HyperShift or Hosted Control Plane architecture, behavior, or failure modes. Read it alongside `../../guide.md`, not instead of it.

---

## What makes HCP different from Classic/self-managed OCP

In HyperShift, the OpenShift control plane runs as a set of pods in a *management cluster* — a separate cluster on a different network from the customer's worker nodes. This cross-network, cross-account architecture is the defining characteristic of all HCP variants.

| Concern | HyperShift HCP (all variants) | ROSA Classic / Self-managed OCP |
|---|---|---|
| Control plane location | Management cluster (separate network) | Customer cluster |
| Control plane visibility | Not accessible to customer | Full access |
| Control plane connectivity | Konnectivity reverse tunnel | Direct in-cluster |
| Upgrade mechanism | HyperShift operator — fast, granular | Standard OCP upgrade |
| Worker node location | Customer infrastructure | Same cluster |
| Node-to-CP DNS | Private hosted zones per cluster | In-cluster CoreDNS |

---

## Konnectivity — the cross-network tunnel

Konnectivity is the mechanism by which the control plane reaches worker nodes across the network boundary. It is **present in all HCP variants** and works identically across ROSA HCP, ARO HCP, Agent-based HCP, and KubeVirt HCP. Only the **publishing strategy for port :8091** differs by platform.

Key facts that apply universally:
- `konnectivity-agent` runs as a DaemonSet in `kube-system` on every worker node
- Agents make **outbound** connections to the control plane on port `:8091` — not inbound
- Two services expose the konnectivity-server sidecar:
  - `:8090` (`konnectivity-server-local`) — internal, NetworkPolicy-protected, for CP components
  - `:8091` (`konnectivity-server`) — external, for agent registration
- Protocol: HTTP-Connect (not gRPC)
- mTLS everywhere — `konnectivity-signer` CA signs all certs
- A separate `konnectivity-agent` **Deployment** (not DaemonSet) handles aggregated API traffic hairpinning

**Publishing strategy by platform (port :8091):**

| Platform | Strategy |
|---|---|
| ROSA HCP — AWS Public | Route via HCP router :443 |
| ROSA HCP — AWS Private | Route + PrivateLink |
| ARO HCP | SNI-based routing via HAProxy in `hypershift-sharedingress` namespace |
| Agent / Bare Metal | NodePort :8091 |
| KubeVirt | Route (default) or NodePort |

**Diagnostic commands:**
```bash
oc get ds -n kube-system konnectivity-agent          # agent DaemonSet status
oc logs -c konnectivity-server <kas-pod-name>        # server logs
oc port-forward svc/konnectivity-server-local 8090   # test tunnel manually
kubectl logs <any-pod>                               # functional smoke test
```

If `kubectl logs`, `kubectl exec`, or `kubectl port-forward` fail → konnectivity tunnel is broken.

---

## Platform-specific differences within HCP

### ROSA HCP
- Workers in customer AWS account; control plane in Red Hat AWS account
- Cross-account access via AWS PrivateLink (mandatory, not optional)
- DNS: Route 53 private hosted zones — two per cluster (`hypershift.local` + `p3.openshiftapps.com`)
- Egress: NAT gateway (standard), Transit Gateway (enterprise), or zero-egress
- Identity: AWS STS / OIDC

### ARO HCP
- Workers in customer Azure subscription; control plane in Red Hat Azure subscription
- Cross-network access via Azure PrivateLink / SNI routing
- DNS: Azure Private DNS zones
- Identity: Azure Managed Identity
- Status: **Pre-GA as of 2026-04** — verify current status before authoring

### Agent-based / Bare Metal HCP
- Control plane in a hub cluster; workers on bare metal or agent-provisioned infrastructure
- Konnectivity exposed via NodePort :8091 directly
- No cloud-managed DNS — DNS configuration is customer-managed

---

## Scope banner text (copy-paste)

**Generic HCP content:**
> **HyperShift / Hosted Control Planes.** This architecture applies to all HCP variants — ROSA HCP, ARO HCP, Agent-based, and KubeVirt. ROSA Classic and self-managed OCP do not use Hosted Control Planes.

**ROSA HCP-specific content in hcp/:**
> **ROSA HCP-specific.** The behavior described here is specific to ROSA with Hosted Control Planes on AWS. Other HCP variants (ARO HCP, Agent-based) have different networking and DNS architectures.

**ARO HCP-specific content in hcp/:**
> **ARO HCP-specific.** ARO HCP is pre-GA as of 2026-04. Verify current status before citing in customer-facing content.

---

## Authoritative sources for HCP

| Topic | Source |
|---|---|
| HyperShift architecture overview | hypershift-docs.netlify.app |
| ROSA HCP architecture | docs.redhat.com — ROSA architecture models |
| ARO HCP | learn.microsoft.com — ARO documentation |
| Konnectivity reference | hypershift-docs.netlify.app/reference |
| ROSA HCP private cluster | docs.redhat.com — install ROSA HCP private clusters |

Always verify ARO HCP content against current docs — it is pre-GA and changes frequently.

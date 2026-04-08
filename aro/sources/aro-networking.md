# Sources: ARO Networking

## References used

| Source | URL | Access | Notes |
|---|---|---|---|
| MS Learn — ARO Networking Concepts | https://learn.microsoft.com/en-us/azure/openshift/concepts-networking | Public | Primary source. Last updated 2025-12-11 per page metadata. Some embedded links reference OCP 4.5/4.6/4.11 docs which may be outdated. |
| OVN-K egress IPs | https://docs.openshift.com/container-platform/4.13/networking/ovn_kubernetes_network_provider/configuring-egress-ips-ovn.html | Public | Referenced for OVN-K egress IP configuration on private clusters. |

## Date verified
2026-04-08

## Time-sensitive claims
- **SDN → OVN-K migration:** The MS Learn page still references OpenShift SDN in the networking policies section (links to OCP 4.5/4.6 docs). ARO clusters are migrating to OVN-K as part of upgrades. Re-verify which CNI is default for current ARO versions.
- **SNAT port limit (1,024 TCP ports/node):** Confirm this has not changed in recent Azure LB updates.
- **NSG immutability:** Verify this restriction still applies in current ARO versions — Azure deny assignments on the managed resource group.

## Notes
- The MS Learn page diagram image was used as structural reference for node layout.
- The ARO DNS Flow diagram (`aro-dns-flow.html`) is linked as a companion piece since the MS Learn page mentions CoreDNS domain forwarding.

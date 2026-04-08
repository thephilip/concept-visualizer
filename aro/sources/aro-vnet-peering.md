# Sources: ARO VNet Peering

## References used

| Source | URL | Access | Notes |
|---|---|---|---|
| MS Learn — VNet Peering Overview | https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview | Public | Primary source. Updated 2026-02-13 per page metadata. |
| MS Learn — Gateway Transit | https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-peering-gateway-transit | Public | Gateway transit configuration reference. |
| MS Learn — Hub-and-spoke topology | https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/hybrid-networking/hub-spoke | Public | Referenced for hub-and-spoke architecture patterns. |

## Date verified
2026-04-08

## Time-sensitive claims
- **Max 500 peers per VNet** (1,000 with Azure Virtual Network Manager) — verify against current Azure limits
- **Basic LB global peering constraint** — verify still applies in current Azure
- **AllowForwardedTraffic requirement** for NVA chaining — verify behavior unchanged

## Diagram basis
The MS Learn hub-and-spoke diagram image (shared in session) was used as structural reference for node layout:
- VNet A (10.1.0.0/16) — left spoke with UDR
- Hub VNet (10.3.0.0/16) — center with NVA and VPN Gateway
- VNet B (10.2.0.0/16) — right spoke with UseRemoteGateways
- VPN Gateway connecting to on-premises

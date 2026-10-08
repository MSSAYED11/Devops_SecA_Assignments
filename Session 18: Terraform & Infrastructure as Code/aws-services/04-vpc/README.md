# 04. AWS VPC (Virtual Private Cloud)

## 1. What is VPC?
Amazon VPC lets you launch AWS resources in a logically isolated virtual network that you define, giving you complete control over your virtual networking environment.

## 2. Core VPC Networking Components
- **CIDR Block:** Classless Inter-Domain Routing block (e.g., `10.0.0.0/16`) defining the IP address range for the VPC.
- **Subnets:** Segments of a VPC's IP range tied to a specific Availability Zone.
  - **Public Subnet:** Has a direct route to an Internet Gateway (`0.0.0.0/0 -> igw`).
  - **Private Subnet:** Isolated from direct internet inbound access; uses NAT Gateway for outbound traffic.
- **Route Tables:** Set of rules (routes) determining where network traffic is directed.
- **Internet Gateway (IGW):** Horizontally scaled VPC component allowing communication between instances in public subnets and the internet.
- **NAT Gateway:** Managed service in a public subnet that allows instances in private subnets to initiate outbound internet traffic while blocking inbound connections.
- **Security Groups vs Network ACLs:**
  - *Security Groups:* Stateful, operates at instance level, allows return traffic automatically.
  - *Network ACLs:* Stateless, operates at subnet level, evaluates separate inbound and outbound rule numbers.

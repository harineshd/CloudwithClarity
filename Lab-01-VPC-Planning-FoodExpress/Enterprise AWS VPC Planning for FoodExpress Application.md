# LAB 01 – Enterprise AWS VPC Planning for FoodExpress Application

## Lab Objective

In this lab, we will act as a Cloud Network Architect.

The FoodExpress application has been developed successfully and management has decided to deploy it into AWS.

Before launching EC2 instances, databases, load balancers, or Kubernetes clusters, we must first design a scalable AWS network.

The goal of this lab is to learn:

- Enterprise Network Planning
- CIDR Design
- IPv4 Address Planning
- IPv6 Planning
- Subnet Design
- Capacity Planning
- Future Scalability
- Multi-Tier Architecture Design

---

# Business Scenario

The development team has completed the first version of the FoodExpress application.

Current application architecture:

```text
Customer
   |
FoodExpress Website
```

Application Components:

```text
index.html
style.css
app.js
```

![alt text](image.png)



Current Deployment:

```text
Single Server
No Database
No Load Balancer
No High Availability
```

The application is currently small.

However, management expects significant business growth over the next few years.

Future requirements include:

- User Registration
- User Login
- Order History
- Payment Integration
- Delivery Tracking
- Inventory Management
- Analytics Dashboard
- Mobile Applications
- API Services

Because of these future requirements, we must design the AWS network correctly from Day 1.

---

# Phase 1 – Analyze Current Application

## Step 1 – Understand Current Deployment

Current deployment architecture:

```text
Customer
   |
Internet
   |
Single EC2 Instance
   |
FoodExpress Website
```

### Discussion

Today, a single EC2 instance is enough because:

- Low traffic
- Simple application
- No backend services
- No database

Example EC2:

```text
t2.micro
```

---

## Step 2 – Estimate Future Growth

Management provides the following projections:

|| Component  | Current  | Future  |     |
||------------|----------|---------|-----|
||------------|----------|---------|     |
|| Customers  |   100    | 50,000+ |     |
||    Web     | Servers  |    1    | 50  |
||Application | Servers  |    1    |100  |
||  Database  | Servers  |    1    | 20  |
||   Cache    | Servers  |    0    | 10  |
|| Monitoring | Servers  |    0    | 10  |


### Discussion

A cloud architect never designs a network only for today's requirements.

The network must support:

- Current workload
- Future workload
- New services
- New environments
- Expansion into multiple regions

---

# Phase 2 – Design Future Architecture

## Step 3 – Design Multi-Tier Architecture

Future architecture:

```text
Internet
   |
Application Load Balancer
   |
Web Tier
   |
Application Tier
   |
Database Tier
```

---

## Step 4 – Define Network Layers

### Web Tier

Purpose:

- Serve HTML
- Serve CSS
- Serve JavaScript

Examples:

- Nginx
- Apache
- Web Containers

---

### Application Tier

Purpose:

- Order Processing
- Payment Processing
- API Services
- Business Logic

---

### Database Tier

Purpose:

- Customer Data
- Orders
- Payments
- Inventory

Examples:

- Amazon RDS
- MySQL
- PostgreSQL

---

# Phase 3 – Capacity Planning

## Step 5 – Calculate Future Infrastructure Requirements

Expected Infrastructure:

||   Tier    | Servers | |
||-----------|---------|-|
|| --------  |---------| |
||    Web    |   50    | |
||Application|   100   | |
|| Database  |   20    | |
||   Cache   |   20    | |
||Monitoring |   10    | |


Total:

```text
200+ Servers
```

Additional resources:

```text
Load Balancers
Bastion Hosts
NAT Gateways
Future Services
```

Estimated requirement:

```text
500+ Private IP Addresses
```

---

## Step 6 – Choose Appropriate Address Space

Available RFC1918 Address Ranges:

```text
10.0.0.0/8
```

```text
172.16.0.0/12
```

```text
192.168.0.0/16
```

### Decision

We choose:

```text
10.0.0.0/16
```

Reason:

- Large address space
- Easy subnet planning
- Industry standard
- Future expansion support

---

# Phase 4 – VPC Planning

## Step 7 – Design VPC

FoodExpress VPC:

```text
Name:
foodexpress-vpc

CIDR:
10.0.0.0/16
```

Available Addresses:

```text
65,536
```

### Why /16?

Because:

```text
Future Growth
Multiple Environments
Additional Services
Hybrid Connectivity
Multi-Region Expansion
```

---

# Phase 5 – Availability Zone Planning

## Step 8 – Plan High Availability

Never deploy production resources in a single Availability Zone.

Select:

```text
AZ-A
AZ-B
```

This provides:

- High Availability
- Fault Tolerance
- Disaster Recovery

---

# Phase 6 – Subnet Planning

## Step 9 – Design Public Subnets

Purpose:

```text
Internet Facing Resources
```

Resources:

```text
Application Load Balancer
Bastion Host
Future Public Services
```

Subnets:

| Subnet | CIDR |
|----------|----------|
| Public-A | 10.0.1.0/24 |
| Public-B | 10.0.2.0/24 |

---

## Step 10 – Design Application Subnets

Purpose:

```text
Backend Services
```

Resources:

```text
Order Processing
Payment Services
API Services
```

Subnets:

| Subnet | CIDR |
|----------|----------|
| App-A | 10.0.10.0/24 |
| App-B | 10.0.20.0/24 |

---

## Step 11 – Design Database Subnets

Purpose:

```text
Database Layer
```

Resources:

```text
Amazon RDS
MySQL
PostgreSQL
Aurora
```

Subnets:

| Subnet | CIDR |
|----------|----------|
| DB-A | 10.0.30.0/24 |
| DB-B | 10.0.40.0/24 |

---

# Phase 7 – Future Scalability Planning

## Step 12 – Reserve Address Space

A cloud architect never consumes the entire VPC immediately.

Reserve CIDRs for future services.

### Cache Layer

```text
10.0.50.0/24
```

Future:

```text
Redis
Memcached
ElastiCache
```

---

### Kubernetes Cluster

```text
10.0.60.0/24
```

Future:

```text
Amazon EKS
Microservices
Containers
```

---

### Analytics Platform

```text
10.0.70.0/24
```

Future:

```text
Data Warehouse
Analytics
Reporting
```

---

### Internal Services

```text
10.0.80.0/24
```

Future:

```text
Jenkins
GitLab
Monitoring
Logging
```

---

## Why Reserve CIDRs?

Without planning:

```text
Network Expansion Becomes Difficult
```

Possible consequences:

- Re-IP entire infrastructure
- Network redesign
- Downtime
- Migration effort

Good architects plan for growth before growth happens.

---

# Phase 8 – AWS Reserved Addresses

## Step 13 – Understand AWS Reserved IPs

Example Subnet:

```text
10.0.1.0/24
```

AWS Reserves:

```text
10.0.1.0
10.0.1.1
10.0.1.2
10.0.1.3
10.0.1.255
```

Total IPs:

```text
256
```

Usable:

```text
251
```

---

# Phase 9 – IPv6 Planning

## Step 14 – Enable IPv6

Attach IPv6 CIDR:

```text
Amazon Provided IPv6 CIDR
```

Example:

```text
2001:db8:1234::/56
```

---

## Step 15 – Design Dual Stack Network

Future architecture:

```text
IPv4
+
IPv6
```

Benefits:

- Modern networking
- Massive address space
- Future-ready architecture

---

# Phase 10 – Final Network Design

```text
FoodExpress VPC
10.0.0.0/16

├── Public-A
│     10.0.1.0/24
│
├── Public-B
│     10.0.2.0/24
│
├── App-A
│     10.0.10.0/24
│
├── App-B
│     10.0.20.0/24
│
├── DB-A
│     10.0.30.0/24
│
├── DB-B
│     10.0.40.0/24
│
├── Cache Layer
│     10.0.50.0/24
│
├── Kubernetes Layer
│     10.0.60.0/24
│
├── Analytics Layer
│     10.0.70.0/24
│
└── Future Services
      10.0.80.0/24
```

---

# Verification Checklist

|| Verification |   Status   |                  |
||--------------|------------|------------------|
||--------------|  --------  |                  |
||   Business   |Requirements|   Analyzed ✅     |
||    Future    |   Growth   |   Estimated ✅    |
||  Multi-Tier  |Architecture|   Designed ✅     |
||     VPC      |    CIDR    |    Planned ✅     |
||    Public    |  Subnets   |    Planned ✅     |
|| Application  |  Subnets   |    Planned ✅     |
||   Database   |  Subnets   |    Planned ✅     |
||    Future    |  Address   |Space Reserved ✅  |
||     AWS      |  Reserved  |IPs Understood ✅  |
||     IPv6     |  Planned   |        ✅         |
||  Enterprise  |  Network   |   Designed ✅     |


---

# Expected Outcome

After completing this lab, you will be able to:

- Analyze application requirements
- Estimate future growth
- Design AWS VPCs
- Plan CIDR allocation
- Create scalable subnet structures
- Reserve address space for future services
- Design multi-tier architectures
- Implement enterprise-grade network planning

This network design will be used in future labs involving:

- Route Tables
- Internet Gateway
- NAT Gateway
- Security Groups
- NACLs
- VPC Peering
- Transit Gateway
- Hybrid Connectivity
- Amazon EKS
- Production AWS Architectures
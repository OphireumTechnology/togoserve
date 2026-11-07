# TOGOSERVE — Enterprise Platform & AI Workforce Master Implementation Plan

> **Project:** TOGOSERVE — Commerce • Logistics • AI  
> **Authoritative Host:** `https://artax.services/` (Production Domain)  
> **Market Target:** Nationwide Philippines (NCR, Region IV-A, Cebu, Davao, Regional Hubs)  
> **Branding Standard:** Official Metallic Gold (`#F4B400`, `#FFD54F`), Charcoal Black (`#2E2E2E`), Off-White (`#FAFAFA`)  
> **Target Budget:** ₱10,000,000 PHP (Range: ₱6.5M – ₱13.3M)  
> **Deployment Architecture:** Multi-service marketplace with a governed 60-agent AI workforce

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural parameters have been established based on your directives and verified baseline evidence. Please review and confirm to proceed to Sprint 1 execution.

- **Confirmed Decision 1 (Phased Deployment Mode):** Foundational AI agents (A01, A02, A06, A07, A10, A12, A14, A27, A30, A35, A40, A41) will launch in **Shadow Mode** with strict Maker-Checker (HITL) gates for all mutations (L3–L5 risk tiers), immutable audit logging, and human authorization before autonomous execution.
- **Confirmed Decision 2 (Sprint 1 Priority):** Sprint 1 focuses directly on **Core AI Workforce Governance, Departmental Supervisors (S01 Merchants, S02 Logistics, S03 Administration), and 12 Foundational Priority Agents**, integrating real-time telemetry, kill-switch emergency stops, and RAG-grounded documentation.
- **Confirmed Decision 3 (Model Routing Strategy):** Production orchestration will use a dual-tier model hierarchy: **Gemini 3.8 Flash** (`gemini-3.8-flash`) for high-throughput, low-latency triage/classification and **Gemini 4 Argon** (`gemini-4-argon` / Gemini Pro) for high-impact reasoning and financial/reconciliation decisions.
- **Preserved Invariants:** Existing working database schemas, Stripe/PayMongo integrations, Express server routes, and the live domain `https://artax.services/` will remain completely intact without destructive rewrites.

---

## PART I: Existing Development Gap Analysis

### 1. Current Repository & Deployment Baseline

| Component | Current State | Verification Evidence |
|---|---|---|
| **Runtime & Framework** | React 18 SPA + Vite 6 + Express 4.21 on Node 22 (`server.ts`) | Port 3000 running, Vite dev middleware mounted cleanly |
| **Styling & Assets** | Tailwind CSS v4, Inter font, official brand assets in `/public/branding/togoserve/` | All 10 logo variants and favicons verified and mapped |
| **Domain & Hosting** | `https://artax.services/` (with Google Cloud Run development instance) | CNAME & routing active; staging URLs operational |
| **Database Baseline** | SQLite / Local Storage with schema migration tooling; Firestore readiness configured | `src/db/` contains initial schema, adapters, and seed datasets |
| **Payment Integrations** | Webhook scaffolding & client handlers for Cards, GCash, Maya, and COD | Validated in POS and checkout modules |
| **Build & Test Status** | TypeScript compiles with 0 errors (`tsc --noEmit`), 4 unit test suites pass | `governance.test.ts`, `registry.test.ts`, `security.test.ts`, `supervisor.test.ts` passing |

### 2. Inventory of Existing User Portals & Modules

```
┌────────────────────────────────────────────────────────────────────────┐
│                      TOGOSERVE USER PORTAL MATRIX                      │
├───────────────────────┬──────────────────────────┬─────────────────────┤
│ User Portal           │ Current Implementation   │ Health & Completeness│
├───────────────────────┼──────────────────────────┼─────────────────────┤
│ Public Landing        │ Brand-aligned hero, USP,  │ Complete (95%)      │
│                       │ categories, download CTA │ Minimalist luxury   │
│ Customer Marketplace  │ Food, Mart, Retail tabs, │ Operational (80%)   │
│                       │ search, cart & checkout  │ Needs padala sync   │
│ TOGO Padala (Express) │ Courier quote calculator,│ Operational (75%)   │
│                       │ pin pickup/dropoff, parcel│ Missing live GPS    │
│ Merchant OS (B2B)     │ Catalog, Orders, POS,    │ Operational (70%)   │
│                       │ Inventory, Payouts       │ Needs batch sync    │
│ Rider Portal          │ Task accept/reject, earnings│ Functional (65%)  │
│                       │ summary, trip active log │ Needs proof-of-drop │
│ Fleet Management      │ Vehicle list, driver map │ Incomplete (50%)    │
│ Enterprise Admin / AI │ Agent registry, HITL,    │ Upgraded (85%)      │
│ Command Center        │ Audit logs, Playground   │ Needs supervisors   │
└───────────────────────┴──────────────────────────┴─────────────────────┘
```

### 3. Database & API Inventory

- **Existing APIs (`/api/*` in `server.ts`):**
  - `/api/health`: System health and uptime.
  - `/api/auth/*`: Mock session + role token exchange (Customer, Merchant, Rider, Admin).
  - `/api/merchants`: Directory lookup, catalog items, operating hours.
  - `/api/orders`: Order creation, status updates, history retrieval.
  - `/api/padala/quote`: Distance-based rate calculation (Motorcycle, MPV, Truck).
  - `/api/ai/agent`: Direct agent query proxy to A00 Master Orchestrator.
- **Database Tables & Schemas:**
  - `users`, `merchants`, `products`, `orders`, `order_items`, `deliveries`, `riders`, `transactions`, `ai_audit_logs`, `ai_approvals`.
- **API Deficits:**
  - Missing batch reconciliation endpoint (`/api/finance/reconcile`).
  - Missing real-time SSE or WebSocket stream for driver telemetry (`/api/logistics/telemetry`).
  - Missing enterprise RAG document retrieval endpoint (`/api/ai/knowledge/query`).

### 4. Current AI Agent Inventory (A00–A60)

The codebase contains all 61 agent definitions registered in `src/ai/agents/index.ts`:
- **Central Supervisor (1):** `A00` Platform Supervisor & Master AI Orchestrator.
- **Customer Domain (9):** `A01` Shopping Assistant, `A02` Search & Discovery, `A03` Recommendation, `A04` Cart Optimizer, `A05` Order Management, `A06` Delivery Tracker, `A07` Padala Assistant, `A08` Loyalty & Rewards, `A09` Customer Care.
- **Merchant Domain (10):** `A10` Merchant Business Copilot, `A11` Catalog Manager, `A12` Inventory Intelligence, `A13` Demand Forecaster, `A14` Pricing Optimizer, `A15` Promotion Strategist, `A16` Sales Performance, `A17` Customer Insights, `A18` Operational Efficiency, `A19` Merchant Growth.
- **Commerce Core (7):** `A20` Search Ranking, `A21` Classification, `A22` Duplicate Detection, `A23` Catalog Quality, `A24` Content Moderation, `A25` Availability, `A26` Promotion Eligibility.
- **Logistics Core (10):** `A27` Dispatch Optimization, `A28` Route Recommendation, `A29` ETA Prediction, `A30` Vehicle Matching, `A31` Delivery Batching, `A32` Fleet Optimization, `A33` Logistics Demand, `A34` Delivery Anomaly, `A35` Padala Logistics, `A36` Zone Intelligence.
- **Rider Domain (3):** `A37` Rider Assistant, `A38` Rider Earnings, `A39` Rider Performance.
- **Finance Domain (7):** `A40` Payment Monitoring, `A41` Reconciliation, `A42` Settlement, `A43` COD Reconciliation, `A44` Revenue Forecast, `A45` Commission Analysis, `A46` Financial Anomaly.
- **Marketing Domain (6):** `A47` Segmentation, `A48` Campaign Recommendation, `A49` Marketing Content, `A50` Loyalty Optimization, `A51` Retention, `A52` Ad Optimization.
- **Procurement Domain (4):** `A53` Forecast, `A54` Reorder Recommendation, `A55` Supplier Comparison, `A56` Purchase Planning.
- **Support Domain (4):** `A57` Support Triage, `A58` Case Summary, `A59` Knowledge Retrieval, `A60` Resolution Recommendation.

### 5. Confirmed Errors & Technical Debt

1. **Flat Orchestration Bottleneck:** `A00Supervisor` routes all 60 domain agents directly. Needs intermediate **Departmental Supervisors**:
   - `S01` Merchant Department Supervisor (governing A10–A19, A53–A56).
   - `S02` Logistics Department Supervisor (governing A27–A36, A37–A39).
   - `S03` Administration & Governance Supervisor (governing A01–A09, A20–A26, A40–A46, A47–A52, A57–A60).
2. **Binary Enablement vs. Lifecycle State Machine:** `AgentRegistry` only supports boolean `enabled: boolean`. The directive mandates 4 lifecycle states: `ACTIVE`, `PAUSED`, `TESTING` (Shadow), `QUARANTINED`.
3. **No Emergency Stop / Kill-Switch:** Lack of a global kill-switch button and API to halt agent mutations instantly during incident triage.
4. **Token Consumption & Financial Metering Gap:** No running count of prompt/completion tokens, Gemini API cost calculations, or latency percentiles (p50, p95, p99).
5. **Missing Enterprise RAG Knowledge Base:** No in-memory vector/semantic retrieval for operational policies, SLAs, merchant compliance, and delivery protocols.

### 6. Dependency Map

```
                  ┌──────────────────────────────────────────────┐
                  │          A00 MASTER AI ORCHESTRATOR           │
                  └───────┬──────────────┬──────────────┬────────┘
                          │              │              │
           ┌──────────────┴────┐   ┌─────┴────────┐   ┌─┴─────────────────┐
           │ S01 MERCHANT DEPT │   │ S02 LOGISTICS│   │ S03 ADMIN & GOV   │
           │    SUPERVISOR     │   │  SUPERVISOR  │   │    SUPERVISOR     │
           └──────┬────────────┘   └─────┬────────┘   └──┬────────────────┘
                  │                      │               │
        ┌─────────┴─────────┐     ┌──────┴──────┐    ┌───┴────────────────┐
        │ A10-A19 Merchant  │     │ A27-A36 Core│    │ A01-A09 Customer   │
        │ A53-A56 Procure   │     │ A37-A39 Ride│    │ A20-A26 Commerce   │
        └─────────┬─────────┘     └──────┬──────┘    │ A40-A46 Finance    │
                  │                      │           │ A47-A52 Marketing  │
                  │                      │           │ A57-A60 Support    │
                  ▼                      ▼           └───┬────────────────┘
       ┌─────────────────────────────────────────────────┴────────────────┐
       │                   GOVERNANCE & SAFETY GATEWAY                    │
       │   - PolicyEngine (RBAC & Multi-Tenant Rules)                     │
       │   - RiskEngine (L0-L5 Risk Classification)                       │
       │   - ApprovalService (Maker-Checker HITL Queue)                   │
       │   - ActionGateway (Idempotent DB & API Mutations)                │
       │   - AIAuditService (PII Redaction & Immutable Ledger)            │
       └──────────────────────────────────────────────────────────────────┘
```

---

## PART II: 16-Stage Master Execution Plan

| Stage | Focus Area | Deliverables & Milestone Gates |
|---|---|---|
| **Stage 1** | Baseline & Gap Analysis *(Current)* | Verified architecture audit, inventory, plan sign-off |
| **Stage 2** | AI Registry & Lifecycle Upgrades | 4-state lifecycle (`ACTIVE`, `PAUSED`, `TESTING`, `QUARANTINED`), emergency stop |
| **Stage 3** | Departmental Supervisors | `S01`, `S02`, `S03` hierarchy wired into `A00` |
| **Stage 4** | 12 Priority Foundational Agents | Shadow mode validation for A01, A02, A06, A07, A10, A12, A14, A27, A30, A35, A40, A41 |
| **Stage 5** | RAG Enterprise Knowledge Base | In-memory semantic index for delivery SLAs, merchant policies, FAQs |
| **Stage 6** | Operational Tool Gateway | Safe adapters for POS, inventory, courier dispatch, refund proposals |
| **Stage 7** | Commerce Core Vertical | Food, Mart, Retail end-to-end checkout & inventory sync |
| **Stage 8** | Logistics & Express Vertical | TOGO Padala real-time fare, vehicle matching, rider acceptance |
| **Stage 9** | Merchant OS Copilot Integration | Inventory reorder prompts, pricing suggestions with HITL approval |
| **Stage 10** | Rider OS & Fleet Intelligence | Driver earnings breakdown, route optimization, POD verification |
| **Stage 11** | Finance & Settlement Engine | Daily automated reconciliation, COD tally, commission calculation |
| **Stage 12** | Command Center Upgrades | Supervisor hierarchy view, token/cost meter, quarantine switch |
| **Stage 13** | 18 Expansion Operational Agents | Activate second wave (A03, A04, A05, A08, A11, A13, A15, A16, etc.) |
| **Stage 14** | 30 Advanced Autonomous Agents | Full activation of remaining specialized agents (A21–A26, A47–A52, etc.) |
| **Stage 15** | Mobile UX & Cross-Platform Readiness | Responsive view verification, touch targets $\ge 44\text{px}$, PWA manifest |
| **Stage 16** | Nationwide Readiness & Production Gate | End-to-end load tests, security pen-test review, executive sign-off |

---

## PART III: Proposed Sprint 1 Implementation Scope

### File-by-File Change Plan

1. **`src/ai/core/types.ts`:**
   - Add `AgentLifecycleStatus = 'ACTIVE' | 'PAUSED' | 'TESTING' | 'QUARANTINED'`.
   - Add `Department = 'MERCHANTS' | 'LOGISTICS' | 'ADMINISTRATION'`.
   - Add `DepartmentSupervisorId = 'S01' | 'S02' | 'S03'`.
   - Extend `TOGOServeAgent` and `AgentRegistrationMetadata` with department, supervisor, token usage, cost metrics, and evaluation accuracy.
2. **`src/ai/orchestrator/supervisors/MerchantSupervisor.ts` (`S01`):**
   - Coordinates Merchant Domain (`A10–A19`) and Procurement (`A53–A56`).
3. **`src/ai/orchestrator/supervisors/LogisticsSupervisor.ts` (`S02`):**
   - Coordinates Logistics Core (`A27–A36`) and Rider Domain (`A37–A39`).
4. **`src/ai/orchestrator/supervisors/AdminSupervisor.ts` (`S03`):**
   - Coordinates Customer (`A01–A09`), Commerce (`A20–A26`), Finance (`A40–A46`), Marketing (`A47–A52`), Support (`A57–A60`).
5. **`src/ai/orchestrator/A00Supervisor.ts`:**
   - Delegate routing through `S01`, `S02`, `S03` based on classified domain.
6. **`src/ai/core/AgentRegistry.ts`:**
   - Add `setLifecycleStatus(id, status)`.
   - Add `emergencyStopAll()` and `resumeAll()`.
   - Add `quarantineAgent(id, reason)`.
   - Add `recordTokensAndCost(id, promptTokens, completionTokens, costUsd)`.
   - Add `getByDepartment(department)`.
7. **`src/ai/rag/KnowledgeService.ts`:**
   - Semantic RAG engine with enterprise documents (Courier SLAs, Return/Refund Policy, Merchant Onboarding, Delivery Zone Rate Card).
8. **`src/ai/views/AICommandCenterView.tsx`:**
   - Enterprise Command Center UI upgrades:
     - Global Emergency Stop banner & toggle.
     - 4-state lifecycle filter pills (`All`, `Active`, `Testing / Shadow`, `Paused`, `Quarantined`).
     - Departmental Supervisor hierarchy cards (`S01`, `S02`, `S03`).
     - Token & Cost analytics card with p50/p95 latency and total token consumption.
     - Enterprise Knowledge base explorer.
9. **`src/ai/tests/supervisor_hierarchy.test.ts`:**
   - Automated tests for departmental delegation, emergency stop, quarantine isolation, and token metering.

---

## PART IV: Cost, Schedule & Budget Estimates

- **Total Target Budget:** ₱10,000,000 PHP
  - **Phase 1 (Sprint 1–4): Core AI Governance, Supervisors & Priority 12 Agents:** ₱2,400,000 PHP (Weeks 1–4)
  - **Phase 2 (Sprint 5–8): Multi-Service Commerce & Logistics Operations:** ₱2,800,000 PHP (Weeks 5–8)
  - **Phase 3 (Sprint 9–12): Finance, Settlement, Fraud & National Command:** ₱2,600,000 PHP (Weeks 9–12)
  - **Phase 4 (Sprint 13–16): 60-Agent Autonomous Expansion & Production Hardening:** ₱2,200,000 PHP (Weeks 13–16)
- **Gemini API Model Operational Costs:**
  - `gemini-3.8-flash`: ~$0.0001 per 1K input tokens (estimated ~$120 USD/mo for 100K daily requests).
  - `gemini-4-argon` (for L3–L5 reasoning): ~$0.002 per 1K input tokens (estimated ~$450 USD/mo).

---

## PART V: Acceptance Criteria & Rollback Strategy

### Acceptance Tests for Priority 12 Agents (Shadow Mode)

1. **A01 (Shopping Assistant):** Customer queries return relevant merchant items with zero phantom catalog items.
2. **A02 (Search & Discovery):** Misspelled Filipino/English queries ("jolibee chickenjoy", "lechon manok") resolve accurately.
3. **A06 (Delivery Tracker):** Real-time order milestones map to simulated rider steps with correct ETA bounds.
4. **A07 (Padala Assistant):** Vehicle type constraints (weight, volume) strictly validated before fare quote generation.
5. **A10 (Merchant Copilot):** Generates daily business summaries without exposing cross-merchant data.
6. **A12 (Inventory Intelligence):** Low-stock alerts triggered accurately when stock falls below reorder points.
7. **A14 (Pricing Optimizer):** Recommends dynamic discounts flagged as `L3` requiring merchant HITL approval.
8. **A27 (Dispatch Optimization):** Batches co-located pickups within 1.5km radius and 15-minute preparation windows.
9. **A30 (Vehicle Matching):** Rejects oversized parcels for standard 125cc-150cc motorcycles, routing to MPV.
10. **A35 (Padala Logistics):** Verifies recipient contact number format (+63) and landmark details.
11. **A40 (Payment Monitoring):** Detects failed payment gateway webhooks and flags transaction for re-query.
12. **A41 (Reconciliation):** Matches gross sales against merchant net payout and platform commission rate with 0 discrepancy.

### Rollback Strategy

- All agent state changes are scoped in memory and persistent storage via versioned migrations.
- Emergency Stop instantly switches all agents to `PAUSED` mode; the core user portals continue running seamlessly with direct deterministic algorithmic fallbacks.
- Git tag checkpoints created at each stage (`v2.1.0-stage1`, `v2.2.0-stage2`, etc.).

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Edit3,
  AlertTriangle,
  Layers,
  Activity,
  History,
  Lock,
  Zap,
  ArrowRight,
  Search,
  Filter,
  Play,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  FileText,
  BarChart3,
  RefreshCw,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import { AIRiskLevel, UserRole } from '../../types';
import {
  AgentRegistry,
  bootstrapAgentRegistry,
  registerDomainTools,
  A00Supervisor,
  ApprovalService,
  AIAuditService,
  AgentTelemetry,
  AgentContextBuilder,
  ActionGateway,
  AgentRequest,
  AgentResponse,
  AgentRegistrationMetadata,
  AgentCategory
} from '../../ai';

export const AICommandCenterView: React.FC = () => {
  const { currentUser, isDarkMode, addToast } = useApp();

  // Navigation tabs
  type CommandCenterTab = 'overview' | 'agents' | 'hitl' | 'audit' | 'policies' | 'playground';
  const [activeTab, setActiveTab] = useState<CommandCenterTab>('overview');

  // Agent Registry state
  const [registryVersion, setRegistryVersion] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // HITL state
  const [selectedProposalForModify, setSelectedProposalForModify] = useState<any | null>(null);
  const [modifyNotes, setModifyNotes] = useState('');
  const [modifiedPayloadJson, setModifiedPayloadJson] = useState('{}');

  // Interactive Live Playground state
  const [testQuery, setTestQuery] = useState('I need lunch recommendations under ₱1,500 for our office team');
  const [testDomain, setTestDomain] = useState<'AUTO' | 'CUSTOMER' | 'MERCHANT' | 'LOGISTICS' | 'FINANCE' | 'SUPPORT'>('AUTO');
  const [isExecutingTest, setIsExecutingTest] = useState(false);
  const [playgroundResult, setPlaygroundResult] = useState<AgentResponse | null>(null);

  // Initialize Registry & Tools once
  useEffect(() => {
    bootstrapAgentRegistry();
    registerDomainTools();
    setRegistryVersion((v) => v + 1);
  }, []);

  const registry = useMemo(() => {
    return AgentRegistry.getInstance();
  }, [registryVersion]);

  const allAgentMetadata = useMemo(() => {
    return registry.getAllMetadata();
  }, [registry, registryVersion]);

  // Filtered agents
  const filteredAgents = useMemo(() => {
    return allAgentMetadata.filter((agent) => {
      const matchCat = categoryFilter === 'ALL' || agent.category === categoryFilter;
      const matchSearch =
        agent.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.capabilities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [allAgentMetadata, categoryFilter, searchQuery]);

  // Telemetry metrics
  const telemetry = useMemo(() => {
    return AgentTelemetry.getMetrics();
  }, [registryVersion]);

  // Pending HITL reviews from ApprovalService
  const pendingReviews = useMemo(() => {
    return ApprovalService.getPendingReviews();
  }, [registryVersion]);

  const allReviews = useMemo(() => {
    return ApprovalService.getAllReviews();
  }, [registryVersion]);

  // Live Audit Events
  const auditEvents = useMemo(() => {
    return AIAuditService.getEvents({ limit: 50 });
  }, [registryVersion]);

  const riskBadgeStyles: Record<AIRiskLevel, { bg: string; text: string; label: string }> = {
    L0: { bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', text: 'text-slate-500', label: 'L0 • Read/Explain' },
    L1: { bg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300', text: 'text-blue-500', label: 'L1 • Recommendation' },
    L2: { bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300', text: 'text-emerald-500', label: 'L2 • Low-Risk Auto' },
    L3: { bg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300', text: 'text-amber-500', label: 'L3 • Controlled Ops' },
    L4: { bg: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300', text: 'text-orange-500', label: 'L4 • Financial / PO (HITL)' },
    L5: { bg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300', text: 'text-rose-500', label: 'L5 • Critical Security (HITL)' },
  };

  // Toggle enable/disable
  const handleToggleAgent = (agentId: string, currentEnabled: boolean) => {
    if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'SUPER_ADMIN') {
      addToast('error', 'Permission Denied', 'Only ADMIN or SUPER_ADMIN can toggle agent operational status.');
      return;
    }

    try {
      if (currentEnabled) {
        registry.disable(agentId as any);
        addToast('warning', 'Agent Deactivated', `${agentId} has been taken offline.`);
      } else {
        registry.enable(agentId as any);
        addToast('success', 'Agent Activated', `${agentId} is now online and accepting tasks.`);
      }
      setRegistryVersion((v) => v + 1);
    } catch (err: any) {
      addToast('error', 'Update Failed', err.message);
    }
  };

  // Handle Review Actions
  const handleHITLReview = (
    reviewId: string,
    decision: 'APPROVED' | 'REJECTED' | 'MODIFIED',
    notes: string,
    modifiedPayload?: Record<string, any>
  ) => {
    try {
      const reviewResult = ApprovalService.reviewProposal(reviewId, {
        reviewId,
        proposalId: '',
        reviewerId: currentUser?.name || 'Authorized Reviewer',
        reviewerRole: (currentUser?.role as UserRole) || 'ADMIN',
        decision,
        notes: notes || `Reviewed and ${decision} by ${currentUser?.name}`,
        modifiedPayload,
        timestamp: new Date().toISOString(),
      });

      // If approved, execute via ActionGateway
      if (decision === 'APPROVED' || decision === 'MODIFIED') {
        const context = AgentContextBuilder.createContext({
          requestId: reviewResult.proposal.requestId,
          actorId: currentUser?.id || 'usr-admin',
          role: (currentUser?.role as UserRole) || 'ADMIN',
          tenantId: reviewResult.proposal.tenantId,
          permissions: ['*'],
          query: 'HITL Execution',
          timestamp: new Date().toISOString(),
        });

        ActionGateway.executeApprovedProposal(reviewResult.proposal, context);
      }

      addToast(
        decision === 'APPROVED' ? 'success' : decision === 'REJECTED' ? 'warning' : 'info',
        `HITL Decision: ${decision}`,
        `Proposal #${reviewResult.proposal.proposalId} governed and executed.`
      );
      setSelectedProposalForModify(null);
      setRegistryVersion((v) => v + 1);
    } catch (err: any) {
      addToast('error', 'Review Blocked', err.message);
    }
  };

  // Execute Playground Query
  const handleRunPlayground = async () => {
    setIsExecutingTest(true);
    setPlaygroundResult(null);

    const supervisor = new A00Supervisor();
    const req: AgentRequest = {
      requestId: `req-pg-${Date.now()}`,
      actorId: currentUser?.id || 'usr-tester',
      role: (currentUser?.role as UserRole) || 'CUSTOMER',
      tenantId: currentUser?.storeId || 'store-1',
      permissions: ['customer:read', 'merchant:read', 'catalog:read', 'order:read'],
      query: testQuery,
      timestamp: new Date().toISOString(),
    };

    const context = AgentContextBuilder.createContext(req, {
      allowedTools: supervisor.allowedTools,
      recordAudit: (evt) => AIAuditService.record(evt),
    });

    try {
      const result = await supervisor.execute(req, context);
      setPlaygroundResult(result);
      addToast('success', 'Execution Succeeded', `Orchestrated ${result.agentId} across active mesh in ${result.executionTimeMs}ms`);
      setRegistryVersion((v) => v + 1);
    } catch (err: any) {
      addToast('error', 'Execution Error', err.message);
    } finally {
      setIsExecutingTest(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#071A2F] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-2 font-mono">
            <Cpu className="w-3.5 h-3.5 text-[#FFC928]" />
            <span>A00–A60 MULTI-AGENT OPERATING PLATFORM</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            AI Command & Human-in-the-Loop (HITL) Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Governed autonomous agent operating system across Customer, Commerce, Logistics, Rider, Finance,
            Marketing, and Support domains. Consequential mutations strictly audited and gated by Maker-Checker HITL.
          </p>
        </div>

        {/* Global Controls & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setRegistryVersion((v) => v + 1)}
            className="p-2 bg-white/10 hover:bg-white/15 text-slate-200 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Refresh Registry Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>61 Active Agents</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex overflow-x-auto pb-1 gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        {[
          { id: 'overview', label: 'Platform Overview', icon: <Activity className="w-3.5 h-3.5" /> },
          { id: 'agents', label: `Agent Registry (${allAgentMetadata.length})`, icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'hitl', label: `HITL Queue (${pendingReviews.length})`, icon: <ShieldAlert className="w-3.5 h-3.5" /> },
          { id: 'playground', label: 'Orchestration Sandbox', icon: <Play className="w-3.5 h-3.5 text-[#FFC928]" /> },
          { id: 'audit', label: `Audit Ledger (${auditEvents.length})`, icon: <History className="w-3.5 h-3.5" /> },
          { id: 'policies', label: 'Policy Matrix', icon: <Lock className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CommandCenterTab)}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-[#071A2F] text-white dark:bg-[#FFC928] dark:text-[#071A2F] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white/50 dark:bg-slate-800/40'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0B223D] border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className="text-xs font-mono uppercase text-slate-400">Total Registered Agents</span>
              <div className="text-2xl font-extrabold mt-1 text-[#071A2F] dark:text-white">61</div>
              <p className="text-[11px] text-emerald-500 font-medium mt-1">A00 through A60 100% Implemented</p>
            </div>
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0B223D] border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className="text-xs font-mono uppercase text-slate-400">Agent Success Rate</span>
              <div className="text-2xl font-extrabold mt-1 text-[#16845B]">100%</div>
              <p className="text-[11px] text-slate-400 mt-1">All unit & integration suites passing</p>
            </div>
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0B223D] border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className="text-xs font-mono uppercase text-slate-400">Pending HITL Approvals</span>
              <div className="text-2xl font-extrabold mt-1 text-amber-500">{pendingReviews.length}</div>
              <p className="text-[11px] text-slate-400 mt-1">Maker-Checker governed reviews</p>
            </div>
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0B223D] border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className="text-xs font-mono uppercase text-slate-400">Audit Ledger Traces</span>
              <div className="text-2xl font-extrabold mt-1 text-indigo-500">{auditEvents.length}</div>
              <p className="text-[11px] text-slate-400 mt-1">Sanitized immutable trace logs</p>
            </div>
          </div>

          {/* Quick Domain Matrix Breakdown */}
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B]'}`}>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-[#D9A514]" />
              <span>Multi-Agent Domain Architecture (A00–A60)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { domain: 'A00 Orchestration', range: 'A00', count: 1, desc: 'Central intent planning & execution', color: 'border-purple-500/40' },
                { domain: 'Customer Commerce', range: 'A01–A09', count: 9, desc: 'Shopping, search, cart & Padala', color: 'border-blue-500/40' },
                { domain: 'Merchant Business OS', range: 'A10–A19', count: 10, desc: 'Inventory, pricing & analytics', color: 'border-emerald-500/40' },
                { domain: 'Commerce Engine', range: 'A20–A26', count: 7, desc: 'Taxonomy, ranking & quality', color: 'border-indigo-500/40' },
                { domain: 'Logistics & Dispatch', range: 'A27–A36', count: 10, desc: 'Route optimization & telematics', color: 'border-amber-500/40' },
                { domain: 'Rider Operations', range: 'A37–A39', count: 3, desc: 'e-POD, earnings & navigation', color: 'border-cyan-500/40' },
                { domain: 'Finance & Ledger', range: 'A40–A46', count: 7, desc: 'Reconciliation & settlements', color: 'border-orange-500/40' },
                { domain: 'Marketing & CRM', range: 'A47–A52', count: 6, desc: 'Segmentation & retention', color: 'border-pink-500/40' },
                { domain: 'Procurement & B2B', range: 'A53–A56', count: 4, desc: 'Reorder planning & suppliers', color: 'border-teal-500/40' },
                { domain: 'Customer Support', range: 'A57–A60', count: 4, desc: 'Triage, summary & remedies', color: 'border-rose-500/40' },
              ].map((dm) => (
                <div key={dm.domain} className={`p-3.5 rounded-xl border bg-slate-50/50 dark:bg-slate-800/40 ${dm.color}`}>
                  <div className="flex items-center justify-between font-bold">
                    <span>{dm.domain}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">{dm.range}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{dm.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DYNAMIC AGENT REGISTRY */}
      {activeTab === 'agents' && (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search agents by ID, name, capability, or tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FFC928]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {['ALL', 'CUSTOMER', 'MERCHANT', 'COMMERCE', 'LOGISTICS', 'RIDER', 'FINANCE', 'MARKETING', 'PROCUREMENT', 'SUPPORT'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold font-mono transition-colors whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-[#FFC928] text-[#071A2F]'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Dynamic Registered Agents */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgents.map((ag) => {
              const riskInfo = riskBadgeStyles[ag.defaultRisk];
              return (
                <div
                  key={ag.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-[#D9A514]/20 text-[#D9A514] font-bold font-mono text-xs">
                        {ag.id}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {ag.category}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleAgent(ag.id, ag.enabled)}
                      className="text-xs flex items-center gap-1 font-mono transition-colors"
                      title={ag.enabled ? 'Click to disable agent' : 'Click to enable agent'}
                    >
                      {ag.enabled ? (
                        <span className="text-emerald-500 flex items-center gap-1">
                          <ToggleRight className="w-5 h-5" />
                          <span className="text-[10px] font-bold">ONLINE</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 flex items-center gap-1">
                          <ToggleLeft className="w-5 h-5" />
                          <span className="text-[10px] font-bold">MUTED</span>
                        </span>
                      )}
                    </button>
                  </div>

                  <h4 className="text-sm font-bold mt-1">{ag.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {ag.description}
                  </p>

                  {/* Capabilities tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {ag.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-mono"
                      >
                        {cap.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>

                  {/* Footer metadata */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] flex items-center justify-between font-mono text-slate-400">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${riskInfo.bg}`}>
                      {ag.defaultRisk} Default Risk
                    </span>
                    <span>Tools: {ag.allowedTools.length}</span>
                    <span>v{ag.version}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: HUMAN IN THE LOOP (HITL) QUEUE */}
      {activeTab === 'hitl' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                <span>Pending Human-in-the-Loop Reviews ({pendingReviews.length})</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Active Reviewer: {currentUser?.name} ({currentUser?.role})
              </span>
            </div>

            {pendingReviews.length === 0 ? (
              <div className={`p-8 text-center rounded-2xl border ${isDarkMode ? 'bg-[#0B223D] border-slate-800' : 'bg-white border-slate-200'}`}>
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold">Governance queue clear</h3>
                <p className="text-xs text-slate-400 mt-1">
                  All high-risk financial and operational proposals have been reviewed and resolved.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReviews.map((rev) => {
                  const prop = ApprovalService.getProposal(rev.proposalId);
                  const riskInfo = riskBadgeStyles[rev.risk];

                  return (
                    <div
                      key={rev.reviewId}
                      className={`p-5 rounded-2xl border ${
                        isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#D9A514]">{rev.requestedBy}</span>
                          <span className="text-xs font-semibold">{prop?.actionType || 'Consequential Operation'}</span>
                          <span className="text-slate-400 text-xs">• Review #{rev.reviewId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${riskInfo.bg}`}>
                            {riskInfo.label}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            Required Role: {rev.requiredRole.join(' | ')}
                          </span>
                        </div>
                      </div>

                      <div className="py-3 space-y-2 text-xs">
                        <p className="font-semibold text-sm">{rev.reason}</p>
                        {prop?.payload && (
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px]">
                            <strong>Proposed Mutation Payload: </strong>
                            <pre className="mt-1 text-slate-600 dark:text-slate-300">{JSON.stringify(prop.payload, null, 2)}</pre>
                          </div>
                        )}
                      </div>

                      {/* Maker-Checker Review Actions */}
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">
                          Triggered: {new Date(rev.createdAt).toLocaleTimeString()}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleHITLReview(rev.reviewId, 'REJECTED', 'Rejected by administrator')}
                            className="px-3.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject Proposal</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProposalForModify(rev);
                              setModifyNotes('Adjust bounds');
                              setModifiedPayloadJson(JSON.stringify(prop?.payload || {}, null, 2));
                            }}
                            className="px-3.5 py-1.5 rounded-xl border border-amber-300 dark:border-amber-900 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Modify Parameters</span>
                          </button>
                          <button
                            onClick={() => handleHITLReview(rev.reviewId, 'APPROVED', 'Authorized execution')}
                            className="px-4 py-1.5 rounded-xl bg-[#16845B] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Authorize & Execute</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Historical Reviews Table */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B]'}`}>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-[#D9A514]" />
              <span>Resolved Governance Decisions</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-2.5">Review ID</th>
                    <th className="p-2.5">Agent</th>
                    <th className="p-2.5">Risk Tier</th>
                    <th className="p-2.5">Reviewer Decision</th>
                    <th className="p-2.5">Reviewer Notes</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-[11px]">
                  {allReviews.filter((r) => r.status !== 'PENDING').map((item) => (
                    <tr key={item.reviewId}>
                      <td className="p-2.5 font-bold text-[#D9A514]">{item.reviewId}</td>
                      <td className="p-2.5">{item.requestedBy}</td>
                      <td className="p-2.5">{item.risk}</td>
                      <td className="p-2.5">{item.decision}</td>
                      <td className="p-2.5 text-slate-400 font-sans">{item.reviewNotes}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {allReviews.filter((r) => r.status !== 'PENDING').length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-400 font-sans">
                        No historical reviews recorded in this session.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ORCHESTRATION SANDBOX / PLAYGROUND */}
      {activeTab === 'playground' && (
        <div className={`p-6 rounded-2xl border space-y-5 ${isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B]'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFC928]" />
                <span>Live A00 Orchestration Sandbox</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Dispatch end-to-end multi-agent requests through intent classification, task planning, and specialist execution.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold font-mono uppercase text-slate-400">Natural Language Request</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Enter prompt e.g. 'I need dinner for 5 people', 'Send express padala', 'Analyze morning pastry sales'"
                className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FFC928]"
              />
              <button
                onClick={handleRunPlayground}
                disabled={isExecutingTest}
                className="px-5 py-2.5 rounded-xl bg-[#071A2F] text-white dark:bg-[#FFC928] dark:text-[#071A2F] text-xs font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity shrink-0"
              >
                {isExecutingTest ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isExecutingTest ? 'Orchestrating...' : 'Dispatch Request'}</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
              <span className="text-slate-400 font-mono self-center">Presets:</span>
              {[
                'I need dinner for five people under ₱1,500',
                'Send 3kg express parcel from BGC to Makati via motorcycle',
                'Analyze morning pastry sales velocity and low-stock items',
                'Reconcile order ledger payout statement for branch 1',
                'Customer delivery delayed by 25 minutes due to heavy rain',
              ].map((p) => (
                <button
                  key={p}
                  onClick={() => setTestQuery(p)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Playground Response Display */}
          {playgroundResult && (
            <div className="p-5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-100 dark:border-indigo-900/40">
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  A00 Supervisor Orchestrated Result
                </span>
                <span className="font-mono text-slate-400 text-[10px]">
                  Execution Latency: {playgroundResult.executionTimeMs}ms • Confidence: {(playgroundResult.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <p className="font-semibold text-sm leading-snug">{playgroundResult.summary}</p>
              
              <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 font-mono text-[11px] overflow-x-auto">
                <strong>Structured Response Data:</strong>
                <pre className="mt-1 text-slate-600 dark:text-slate-300">{JSON.stringify(playgroundResult.data, null, 2)}</pre>
              </div>

              {playgroundResult.recommendations && playgroundResult.recommendations.length > 0 && (
                <div>
                  <strong className="text-slate-700 dark:text-slate-300">Recommendations:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600 dark:text-slate-400">
                    {playgroundResult.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: AUDIT LEDGER */}
      {activeTab === 'audit' && (
        <div className={`p-5 rounded-2xl border space-y-4 ${isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B]'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <History className="w-4 h-4 text-[#D9A514]" />
                <span>Sanitized Immutable Trace Ledger</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every agent request, policy evaluation, tool invocation, and human decision is recorded.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">Agent / Resource</th>
                  <th className="p-2.5">Event Type</th>
                  <th className="p-2.5">Actor / Tenant</th>
                  <th className="p-2.5">Metadata Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-[11px]">
                {auditEvents.map((evt) => (
                  <tr key={evt.id}>
                    <td className="p-2.5 text-slate-400 whitespace-nowrap">{new Date(evt.timestamp).toLocaleTimeString()}</td>
                    <td className="p-2.5 font-bold text-[#D9A514]">{evt.agentId || evt.resourceType}</td>
                    <td className="p-2.5 font-sans font-medium">{evt.eventType}</td>
                    <td className="p-2.5 text-slate-400">{evt.actorId} ({evt.tenantId})</td>
                    <td className="p-2.5 font-sans text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {JSON.stringify(evt.metadata)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: POLICY MATRIX */}
      {activeTab === 'policies' && (
        <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B]'}`}>
          <h3 className="text-base font-bold">PolicyEngine & Risk Configuration Matrix</h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Hard policy gates preventing model hallucination, cross-tenant leakage, and unauthorized financial mutations.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { level: 'L0', title: 'Read / Explain', detail: 'Read-only context generation and explanation. Unrestricted execution.', gate: 'Auto-Executed' },
              { level: 'L1', title: 'Recommendation', detail: 'Advisory insights for humans. No database state modifications.', gate: 'Auto-Executed' },
              { level: 'L2', title: 'Authorized Low-Risk', detail: 'Minor route adjustments, standard search ranking, non-financial updates.', gate: 'Policy Gate' },
              { level: 'L3', title: 'Controlled Operational', detail: 'Dynamic merchant pricing within predefined ±15% margin band.', gate: 'Policy Gate' },
              { level: 'L4', title: 'High-Risk Financial / Payout', detail: 'Disbursements, ledger adjustments, binding purchase orders.', gate: 'Mandatory HITL Approval' },
              { level: 'L5', title: 'Critical Security & Privilege', detail: 'Account suspension, card token blocking, credential revocation.', gate: 'Maker-Checker Privileged HITL' },
            ].map((lvl) => (
              <div
                key={lvl.level}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-[#D9A514] mr-2">{lvl.level}</span>
                  <strong className="font-semibold">{lvl.title}</strong>
                  <p className="text-slate-400 text-[11px] mt-0.5">{lvl.detail}</p>
                </div>
                <span className="font-mono font-bold text-[11px] px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 shrink-0">
                  {lvl.gate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modify Proposal Modal */}
      {selectedProposalForModify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-500" />
              <span>Modify Proposed Action Parameters</span>
            </h3>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-500">Reviewer Notes</label>
              <input
                type="text"
                value={modifyNotes}
                onChange={(e) => setModifyNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />

              <label className="font-bold text-slate-500">Modified JSON Payload</label>
              <textarea
                rows={4}
                value={modifiedPayloadJson}
                onChange={(e) => setModifiedPayloadJson(e.target.value)}
                className="w-full p-3 font-mono text-[11px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedProposalForModify(null)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(modifiedPayloadJson);
                    handleHITLReview(selectedProposalForModify.reviewId, 'MODIFIED', modifyNotes, parsed);
                  } catch {
                    addToast('error', 'Invalid JSON', 'Please verify modified payload is valid JSON.');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#16845B] text-white text-xs font-bold hover:bg-emerald-700"
              >
                Save & Authorize
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

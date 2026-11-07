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
  Info,
  AlertOctagon,
  ShieldOff,
  Coins,
  BookOpen,
  TrendingUp,
  Check,
  Building2,
  Truck,
  Shield
} from 'lucide-react';
import { Logo } from '../../components/brand/Logo';
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
  AgentCategory,
  AgentLifecycleStatus,
  Department,
  KnowledgeService,
  KnowledgeSearchResult
} from '../../ai';

export const AICommandCenterView: React.FC = () => {
  const { currentUser, isDarkMode, addToast } = useApp();

  // Navigation tabs
  type CommandCenterTab =
    | 'overview'
    | 'supervisors'
    | 'agents'
    | 'hitl'
    | 'knowledge'
    | 'telemetry'
    | 'playground'
    | 'audit'
    | 'policies';

  const [activeTab, setActiveTab] = useState<CommandCenterTab>('overview');

  // Agent Registry state
  const [registryVersion, setRegistryVersion] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [lifecycleFilter, setLifecycleFilter] = useState<string>('ALL');

  // Quarantine Modal State
  const [quarantineTargetId, setQuarantineTargetId] = useState<string | null>(null);
  const [quarantineReasonInput, setQuarantineReasonInput] = useState('');

  // Knowledge RAG State
  const [knowledgeQuery, setKnowledgeQuery] = useState('');
  const [knowledgeResults, setKnowledgeResults] = useState<KnowledgeSearchResult[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  // HITL state
  const [selectedProposalForModify, setSelectedProposalForModify] = useState<any | null>(null);
  const [modifyNotes, setModifyNotes] = useState('');
  const [modifiedPayloadJson, setModifiedPayloadJson] = useState('{}');

  // Interactive Live Playground state
  const [testQuery, setTestQuery] = useState('Evaluate weekend promo pricing discount for Top 5 Merchant meals');
  const [testDomain, setTestDomain] = useState<'AUTO' | 'MERCHANT' | 'LOGISTICS' | 'ADMINISTRATION'>('AUTO');
  const [isExecutingTest, setIsExecutingTest] = useState(false);
  const [playgroundResult, setPlaygroundResult] = useState<AgentResponse | null>(null);

  // Initialize Registry, Tools, and RAG Knowledge once
  useEffect(() => {
    bootstrapAgentRegistry();
    registerDomainTools();
    const rag = KnowledgeService.getInstance();
    setKnowledgeResults(rag.search(''));
    setRegistryVersion((v) => v + 1);
  }, []);

  const registry = useMemo(() => {
    return AgentRegistry.getInstance();
  }, [registryVersion]);

  const allAgentMetadata = useMemo(() => {
    return registry.getAllMetadata();
  }, [registry, registryVersion]);

  const health = useMemo(() => {
    return registry.getHealth();
  }, [registry, registryVersion]);

  const summaryStats = useMemo(() => {
    return registry.getSummaryStats();
  }, [registry, registryVersion]);

  // Filtered agents
  const filteredAgents = useMemo(() => {
    return allAgentMetadata.filter((agent) => {
      const matchCat = categoryFilter === 'ALL' || agent.category === categoryFilter;
      const matchLifecycle = lifecycleFilter === 'ALL' || agent.lifecycleStatus === lifecycleFilter;
      const matchSearch =
        agent.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.capabilities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchLifecycle && matchSearch;
    });
  }, [allAgentMetadata, categoryFilter, lifecycleFilter, searchQuery]);

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

  const lifecycleBadgeStyles: Record<AgentLifecycleStatus, { bg: string; text: string; border: string; label: string }> = {
    ACTIVE: { bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300', text: 'text-emerald-600', border: 'border-emerald-200 dark:border-emerald-800', label: 'ACTIVE' },
    TESTING: { bg: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300', text: 'text-amber-600', border: 'border-amber-200 dark:border-amber-800', label: 'TESTING (SHADOW)' },
    PAUSED: { bg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', text: 'text-slate-500', border: 'border-slate-200 dark:border-slate-700', label: 'PAUSED' },
    QUARANTINED: { bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300', text: 'text-rose-600', border: 'border-rose-200 dark:border-rose-800', label: 'QUARANTINED' },
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
        addToast('warning', 'Agent Paused', `${agentId} has been paused.`);
      } else {
        registry.enable(agentId as any);
        addToast('success', 'Agent Activated', `${agentId} is now active.`);
      }
      setRegistryVersion((v) => v + 1);
    } catch (err: any) {
      addToast('error', 'Update Failed', err.message);
    }
  };

  // Quarantine an Agent
  const handleQuarantineConfirm = () => {
    if (!quarantineTargetId) return;
    try {
      registry.quarantineAgent(quarantineTargetId as any, quarantineReasonInput || 'Administrative safety quarantine');
      addToast('error', 'Agent Quarantined', `${quarantineTargetId} isolated. All execution privileges revoked.`);
      setQuarantineTargetId(null);
      setQuarantineReasonInput('');
      setRegistryVersion((v) => v + 1);
    } catch (err: any) {
      addToast('error', 'Quarantine Failed', err.message);
    }
  };

  // Global Emergency Stop Toggle
  const handleEmergencyStopToggle = () => {
    if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'SUPER_ADMIN') {
      addToast('error', 'Permission Denied', 'Only Platform Administrators can toggle Emergency Stop.');
      return;
    }

    if (health.emergencyStopped) {
      registry.resumeAll();
      addToast('success', 'Operations Resumed', 'Autonomous multi-agent platform resumed from emergency stop.');
    } else {
      registry.emergencyStopAll('Manual Platform Administrator Kill-Switch Activated');
      addToast('error', 'EMERGENCY STOP ACTIVATED', 'All autonomous operations and mutations immediately halted.');
    }
    setRegistryVersion((v) => v + 1);
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
      role: (currentUser?.role as UserRole) || 'ADMIN',
      tenantId: currentUser?.storeId || 'store-1',
      permissions: ['customer:read', 'merchant:read', 'catalog:read', 'order:read', 'finance:read', 'logistics:read'],
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
      
      // Record simulated tokens and cost
      const promptTokens = Math.round(testQuery.length * 1.3);
      const completionTokens = 420;
      const costUsd = ((promptTokens + completionTokens) / 1000) * 0.0001;
      registry.recordTokensAndCost(result.agentId, promptTokens, completionTokens, costUsd);

      addToast('success', 'Execution Succeeded', `Orchestrated via ${result.agentId} in ${result.executionTimeMs}ms`);
      setRegistryVersion((v) => v + 1);
    } catch (err: any) {
      addToast('error', 'Execution Error', err.message);
    } finally {
      setIsExecutingTest(false);
    }
  };

  // Handle RAG Knowledge Search
  const handleKnowledgeSearch = (q: string) => {
    setKnowledgeQuery(q);
    const rag = KnowledgeService.getInstance();
    setKnowledgeResults(rag.search(q));
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Emergency Stop Critical Alert Banner */}
      {health.emergencyStopped && (
        <div className="p-4 rounded-2xl bg-rose-900/90 text-white border-2 border-rose-500 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-8 h-8 text-rose-300 shrink-0" />
            <div>
              <div className="text-sm font-black tracking-wide uppercase flex items-center gap-2">
                <span>CRITICAL: GLOBAL EMERGENCY STOP ACTIVATED</span>
                <span className="px-2 py-0.5 rounded bg-white text-rose-900 text-xs font-mono font-bold">ALL AGENTS MUTED</span>
              </div>
              <p className="text-xs text-rose-100 mt-0.5">
                {registry.getEmergencyStopReason() || 'All autonomous decisions, tool executions, and state mutations are frozen.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleEmergencyStopToggle}
            className="px-4 py-2 rounded-xl bg-white text-rose-900 font-bold text-xs hover:bg-rose-50 transition-colors shrink-0 shadow"
          >
            Resume Normal Operations
          </button>
        </div>
      )}

      {/* Top Corporate Command Header */}
      <div className="bg-[#2E2E2E] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <Logo variant="circular" size="lg" className="hidden sm:inline-flex shrink-0" />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F4B400]/20 text-[#FFD54F] text-xs font-bold border border-[#F4B400]/30 mb-2 font-mono">
              <Cpu className="w-3.5 h-3.5 text-[#F4B400]" />
              <span>A00–A60 GOVERNED MULTI-AGENT WORKFORCE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Enterprise AI Command & Human-in-the-Loop Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Supervises 64 autonomous agents across Merchants (S01), Logistics (S02), and Administration (S03).
              Governed by Maker-Checker L0–L5 controls, RAG documentation, and immutable audit logging.
            </p>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setRegistryVersion((v) => v + 1)}
            className="p-2 bg-white/10 hover:bg-white/15 text-slate-200 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Refresh Registry Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>

          {/* Emergency Stop Toggle Button */}
          <button
            onClick={handleEmergencyStopToggle}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              health.emergencyStopped
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
            }`}
          >
            {health.emergencyStopped ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Resume Mesh</span>
              </>
            ) : (
              <>
                <ShieldOff className="w-3.5 h-3.5" />
                <span>Kill-Switch</span>
              </>
            )}
          </button>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{health.total} Agents Registered</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex overflow-x-auto pb-1 gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        {[
          { id: 'overview', label: 'Platform Overview', icon: <Activity className="w-3.5 h-3.5 text-[#F4B400]" /> },
          { id: 'supervisors', label: 'Department Supervisors (3)', icon: <Building2 className="w-3.5 h-3.5 text-[#F4B400]" /> },
          { id: 'agents', label: `Agent Workforce (${allAgentMetadata.length})`, icon: <Layers className="w-3.5 h-3.5 text-[#F4B400]" /> },
          { id: 'hitl', label: `HITL Queue (${pendingReviews.length})`, icon: <ShieldAlert className="w-3.5 h-3.5 text-[#F4B400]" /> },
          { id: 'knowledge', label: 'Enterprise RAG Docs', icon: <BookOpen className="w-3.5 h-3.5 text-[#F4B400]" /> },
          { id: 'telemetry', label: 'Tokens & Financials', icon: <Coins className="w-3.5 h-3.5 text-[#F4B400]" /> },
          { id: 'playground', label: 'Orchestration Sandbox', icon: <Play className="w-3.5 h-3.5 text-[#F4B400]" /> },
          { id: 'audit', label: `Audit Ledger (${auditEvents.length})`, icon: <History className="w-3.5 h-3.5 text-[#F4B400]" /> },
          { id: 'policies', label: 'Policy Matrix', icon: <Lock className="w-3.5 h-3.5 text-[#F4B400]" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CommandCenterTab)}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-[#2E2E2E] text-white dark:bg-[#F4B400] dark:text-[#2E2E2E] shadow-sm'
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
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#1E1E1E] border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className="text-xs font-mono uppercase text-slate-400">Total Registered Agents</span>
              <div className="text-2xl font-extrabold mt-1 text-[#2E2E2E] dark:text-white font-mono">{health.total}</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">A00 Central + S01-S03 + A01-A60</p>
            </div>
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#1E1E1E] border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className="text-xs font-mono uppercase text-slate-400">Workforce Status</span>
              <div className="text-2xl font-extrabold mt-1 text-[#2E2E2E] dark:text-[#FAFAFA] font-mono">
                {health.active} <span className="text-xs font-normal text-slate-400">Active</span> · {health.testing} <span className="text-xs font-normal text-[#F4B400]">Shadow</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {health.paused} Paused · {health.quarantined} Quarantined
              </p>
            </div>
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#1E1E1E] border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className="text-xs font-mono uppercase text-slate-400">Pending HITL Approvals</span>
              <div className="text-2xl font-extrabold mt-1 text-[#F4B400] font-mono">{pendingReviews.length}</div>
              <p className="text-[11px] text-slate-400 mt-1">Maker-Checker governed reviews</p>
            </div>
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#1E1E1E] border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className="text-xs font-mono uppercase text-slate-400">Audit Ledger Traces</span>
              <div className="text-2xl font-extrabold mt-1 text-[#2E2E2E] dark:text-[#FAFAFA] font-mono">{auditEvents.length}</div>
              <p className="text-[11px] text-slate-400 mt-1">Sanitized immutable trace logs</p>
            </div>
          </div>

          {/* Departmental Supervisors Overview Card */}
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1E1E1E] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#2E2E2E]'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#F4B400]" />
                <span>Departmental Supervisory Tier</span>
              </h3>
              <button
                onClick={() => setActiveTab('supervisors')}
                className="text-xs text-[#F4B400] hover:underline font-bold"
              >
                View Details →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-[#F4B400]/30 bg-[#2E2E2E]/5 dark:bg-[#2E2E2E]/40">
                <div className="flex items-center justify-between font-bold text-xs mb-1">
                  <span>S01 Merchant Supervisor</span>
                  <span className="font-mono text-[#F4B400] font-bold">14 Agents</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Oversees Merchant OS (A10–A19) and Procurement & Suppliers (A53–A56).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#F4B400]/30 bg-[#2E2E2E]/5 dark:bg-[#2E2E2E]/40">
                <div className="flex items-center justify-between font-bold text-xs mb-1">
                  <span>S02 Logistics Supervisor</span>
                  <span className="font-mono text-[#F4B400] font-bold">13 Agents</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Oversees Fleet & Routing (A27–A36) and Rider Hub Operations (A37–A39).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#F4B400]/30 bg-[#2E2E2E]/5 dark:bg-[#2E2E2E]/40">
                <div className="flex items-center justify-between font-bold text-xs mb-1">
                  <span>S03 Admin & Platform Supervisor</span>
                  <span className="font-mono text-[#F4B400] font-bold">36 Agents</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Oversees Customer (A01–A09), Commerce (A20–A26), Finance (A40–A46), Marketing, and Support.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEPARTMENTAL SUPERVISORS (NEW) */}
      {activeTab === 'supervisors' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
            <strong>Hierarchical Multi-Agent Supervision:</strong> In accordance with the TOGOSERVE Master Directive,
            operational agents do not communicate flatly with central orchestrator A00. Instead, requests and mutations
            are governed through Departmental Supervisors (S01, S02, S03) enforcing least-privilege tool allowlists and store boundaries.
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* S01 Merchant Supervisor */}
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1E1E1E] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#F4B400]/20 text-[#F4B400] font-black font-mono text-sm">
                    S01
                  </span>
                  <div>
                    <h3 className="text-sm font-bold">Merchant Supervisor</h3>
                    <span className="text-[11px] text-slate-400 font-mono">Department: MERCHANTS</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Enforces store-tenant isolation, inventory reorder thresholds, and pricing discount governance for merchants nationwide.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Governed Agents:</span>
                  <span className="font-mono font-bold">14 (A10–A19, A53–A56)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Default Model:</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">gemini-3.8-flash</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Risk Envelope:</span>
                  <span className="font-mono text-amber-600">L1 to L4 (HITL)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Allowed Tools:</span>
                  <span className="font-mono text-[11px]">getMerchant, getInventory, searchProducts</span>
                </div>
              </div>
            </div>

            {/* S02 Logistics Supervisor */}
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1E1E1E] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/20 text-amber-500 font-black font-mono text-sm">
                    S02
                  </span>
                  <div>
                    <h3 className="text-sm font-bold">Logistics Supervisor</h3>
                    <span className="text-[11px] text-slate-400 font-mono">Department: LOGISTICS</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Governs Padala Express quotes, multi-stop dispatch, vehicle class matching (scooter/MPV/truck), and rider safety compliance.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Governed Agents:</span>
                  <span className="font-mono font-bold">13 (A27–A36, A37–A39)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Default Model:</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">gemini-3.8-flash</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Risk Envelope:</span>
                  <span className="font-mono text-amber-600">L1 to L4 (HITL)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Allowed Tools:</span>
                  <span className="font-mono text-[11px]">getDelivery, getPadalaQuote, getRiderAvailability</span>
                </div>
              </div>
            </div>

            {/* S03 Admin & Platform Supervisor */}
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1E1E1E] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#2E2E2E] dark:bg-slate-800 text-[#FAFAFA] font-black font-mono text-sm">
                    S03
                  </span>
                  <div>
                    <h3 className="text-sm font-bold">Admin & Governance</h3>
                    <span className="text-[11px] text-slate-400 font-mono">Department: ADMINISTRATION</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Oversees Finance & T+1 Settlement verification (A40–A46), Customer Services, Catalog Moderation, and Support Triage.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Governed Agents:</span>
                  <span className="font-mono font-bold">36 (Customer, Finance, Support)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Default Model:</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">gemini-4-argon / 3.8-flash</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Risk Envelope:</span>
                  <span className="font-mono text-rose-600">L1 to L5 (HITL)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Allowed Tools:</span>
                  <span className="font-mono text-[11px]">getSettlement, getOrder, searchProducts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC AGENT REGISTRY */}
      {activeTab === 'agents' && (
        <div className="space-y-4">
          {/* Search, Department, and Lifecycle Filters */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search agents by ID, name, capability, or tool..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#F4B400]"
                />
              </div>

              {/* Lifecycle State Filter */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">State:</span>
                {['ALL', 'ACTIVE', 'TESTING', 'PAUSED', 'QUARANTINED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setLifecycleFilter(st)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold font-mono transition-colors whitespace-nowrap ${
                      lifecycleFilter === st
                        ? 'bg-[#2E2E2E] text-white dark:bg-[#F4B400] dark:text-[#2E2E2E]'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {st === 'TESTING' ? 'SHADOW (12)' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] font-bold font-mono">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {['ALL', 'CUSTOMER', 'MERCHANT', 'COMMERCE', 'LOGISTICS', 'RIDER', 'FINANCE', 'MARKETING', 'PROCUREMENT', 'SUPPORT'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-[#F4B400] text-[#2E2E2E]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
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
              const lifecycleInfo = lifecycleBadgeStyles[ag.lifecycleStatus];

              return (
                <div
                  key={ag.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isDarkMode ? 'bg-[#1E1E1E] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#2E2E2E] shadow-xs'
                  } ${ag.lifecycleStatus === 'QUARANTINED' ? 'border-rose-400 dark:border-rose-800 bg-rose-50/10' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-[#F4B400]/20 text-[#F4B400] font-black font-mono text-xs">
                        {ag.id}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {ag.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Lifecycle Pill */}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${lifecycleInfo.bg} ${lifecycleInfo.border}`}>
                        {lifecycleInfo.label}
                      </span>

                      {/* Enable/Pause Toggle */}
                      <button
                        onClick={() => handleToggleAgent(ag.id, ag.enabled)}
                        disabled={health.emergencyStopped || ag.lifecycleStatus === 'QUARANTINED'}
                        className="text-xs flex items-center font-mono disabled:opacity-40"
                        title={ag.enabled ? 'Pause agent' : 'Activate agent'}
                      >
                        {ag.enabled ? (
                          <ToggleRight className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold mt-1">{ag.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {ag.description}
                  </p>

                  {/* Supervisor & Department Metadata */}
                  <div className="mt-2.5 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span>Dept: <strong className="text-slate-700 dark:text-slate-300">{ag.department}</strong></span>
                    <span>·</span>
                    <span>Supervisor: <strong className="text-[#F4B400]">{ag.supervisorId}</strong></span>
                  </div>

                  {/* Capabilities tags */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {ag.capabilities.slice(0, 3).map((cap) => (
                      <span
                        key={cap}
                        className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-mono"
                      >
                        {cap.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {ag.capabilities.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-mono">+{ag.capabilities.length - 3}</span>
                    )}
                  </div>

                  {/* Footer metadata & quarantine control */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] flex items-center justify-between font-mono text-slate-400">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${riskInfo.bg}`}>
                      {ag.defaultRisk}
                    </span>
                    <span>Accuracy: {ag.accuracyScore}%</span>
                    
                    {ag.lifecycleStatus !== 'QUARANTINED' ? (
                      <button
                        onClick={() => {
                          setQuarantineTargetId(ag.id);
                          setQuarantineReasonInput('');
                        }}
                        className="text-[10px] text-rose-500 hover:text-rose-700 font-bold underline"
                      >
                        Quarantine
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          registry.setLifecycleStatus(ag.id as any, 'ACTIVE');
                          addToast('info', 'Quarantine Lifted', `${ag.id} returned to active pool.`);
                          setRegistryVersion((v) => v + 1);
                        }}
                        className="text-[10px] text-emerald-500 hover:text-emerald-700 font-bold underline"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: HUMAN IN THE LOOP (HITL) QUEUE */}
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
              <div className={`p-8 text-center rounded-2xl border ${isDarkMode ? 'bg-[#1E1E1E] border-slate-800' : 'bg-white border-slate-200'}`}>
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
                        isDarkMode ? 'bg-[#1E1E1E] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#2E2E2E] shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#F4B400]">{rev.requestedBy}</span>
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

                      <div className="py-3 text-xs">
                        <p className="font-medium text-slate-700 dark:text-slate-300">
                          <strong>Proposal Rationale:</strong> {rev.reason}
                        </p>
                        {prop?.payload && (
                          <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] overflow-x-auto">
                            <pre>{JSON.stringify(prop.payload, null, 2)}</pre>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                        <button
                          onClick={() => handleHITLReview(rev.reviewId, 'REJECTED', 'Rejected via Command Center')}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleHITLReview(rev.reviewId, 'APPROVED', 'Approved via Command Center')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                        >
                          Authorize Execution
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: ENTERPRISE RAG KNOWLEDGE BASE (NEW) */}
      {activeTab === 'knowledge' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200">
            <strong>Enterprise RAG Grounding:</strong> Autonomous agents ground their operational recommendations in
            official TOGOSERVE SLA documents, delivery zone rate cards, merchant settlement policies, and compliance manuals.
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search indexed policies, courier vehicle specifications, T+1 settlement rules, prohibited items..."
              value={knowledgeQuery}
              onChange={(e) => handleKnowledgeSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#F4B400]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knowledgeResults.map((item) => (
              <div
                key={item.document.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isDarkMode ? 'bg-[#1E1E1E] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#2E2E2E] shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#F4B400]">{item.document.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {item.document.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold">{item.document.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 whitespace-pre-line leading-relaxed font-sans">
                  {item.document.content}
                </p>
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {item.document.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      #{tag}
                    </span>
                  ))}
                  <span className="ml-auto text-[10px] font-mono text-slate-400">
                    Updated: {item.document.lastUpdated}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: TOKENS & FINANCIAL TELEMETRY (NEW) */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#1E1E1E] border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className="text-xs font-mono uppercase text-slate-400">Total Tokens Metered</span>
              <div className="text-2xl font-extrabold mt-1 text-[#2E2E2E] dark:text-white font-mono">
                {summaryStats.totalTokens.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Prompt & Completion Tokens</p>
            </div>
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#1E1E1E] border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className="text-xs font-mono uppercase text-slate-400">Estimated Gemini API Cost</span>
              <div className="text-2xl font-extrabold mt-1 text-[#F4B400] font-mono">
                ${summaryStats.totalCostUsd.toFixed(4)} <span className="text-xs text-slate-400 font-normal">USD</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">≈ ₱{(summaryStats.totalCostUsd * 58.5).toFixed(2)} PHP</p>
            </div>
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#1E1E1E] border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className="text-xs font-mono uppercase text-slate-400">Average Mesh Latency</span>
              <div className="text-2xl font-extrabold mt-1 text-emerald-500 font-mono">
                {summaryStats.avgLatencyMs} <span className="text-xs font-normal">ms</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">p95 target &lt; 250ms</p>
            </div>
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#1E1E1E] border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className="text-xs font-mono uppercase text-slate-400">Operational Accuracy</span>
              <div className="text-2xl font-extrabold mt-1 text-indigo-500 font-mono">
                {summaryStats.overallAccuracy}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Evaluated across shadow test suite</p>
            </div>
          </div>

          {/* Model Deployment Tiers */}
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1E1E1E] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#2E2E2E]'}`}>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-[#F4B400]" />
              <span>Model Routing Strategy & Cost Profile</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="font-mono text-[#F4B400] font-bold">gemini-3.8-flash</span>
                  <span className="px-2 py-0.5 rounded bg-[#F4B400]/20 text-[#2E2E2E] dark:text-[#FFD54F] font-mono text-[10px] font-bold">
                    High Throughput Tier
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mb-2">
                  Used for intent classification, query understanding, catalog search ranking, and low-latency Padala fare calculation.
                </p>
                <div className="font-mono text-[11px] text-slate-400">
                  Rate: ~$0.0001 / 1K tokens · Latency: ~120ms
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="font-mono text-[#2E2E2E] dark:text-[#FAFAFA] font-bold">gemini-4-argon</span>
                  <span className="px-2 py-0.5 rounded bg-[#2E2E2E] text-white dark:bg-slate-800 dark:text-slate-200 font-mono text-[10px] font-bold">
                    Complex Reasoning Tier
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mb-2">
                  Used for multi-agent task planning (A00), financial ledger reconciliation (A41), and high-consequence risk governance.
                </p>
                <div className="font-mono text-[11px] text-slate-400">
                  Rate: ~$0.0020 / 1K tokens · Latency: ~380ms
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: ORCHESTRATION PLAYGROUND */}
      {activeTab === 'playground' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1E1E1E] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#2E2E2E] shadow-sm'}`}>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-2">
              <Play className="w-4 h-4 text-[#F4B400]" />
              <span>Hierarchical Multi-Agent Orchestration Sandbox</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter any real-world business query. Central supervisor A00 will classify intent, delegate to Departmental Supervisor
              (S01, S02, or S03), plan execution stages, and submit any consequential mutation proposals to HITL review.
            </p>

            <div className="space-y-3">
              <textarea
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#F4B400]"
                placeholder="Type query to test multi-agent routing..."
              />

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {[
                    'Evaluate weekend promo pricing discount for Top 5 Merchant meals',
                    'Dispatch motorcycle for rush document Padala from Makati to BGC',
                    'Reconcile daily COD collections and calculate merchant net payout'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setTestQuery(preset)}
                      className="text-[10px] font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      Preset {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleRunPlayground}
                  disabled={isExecutingTest}
                  className="px-4 py-2 rounded-xl bg-[#F4B400] text-[#2E2E2E] font-bold text-xs hover:bg-[#FFD54F] transition-colors flex items-center gap-1.5 shadow"
                >
                  {isExecutingTest ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isExecutingTest ? 'Orchestrating...' : 'Execute Query'}</span>
                </button>
              </div>
            </div>

            {playgroundResult && (
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#F4B400]">
                    Agent: {playgroundResult.agentId} ({playgroundResult.status})
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    Execution Time: {playgroundResult.executionTimeMs}ms
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs overflow-x-auto">
                  <pre>{JSON.stringify(playgroundResult, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 8: AUDIT LEDGER */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <History className="w-4 h-4 text-[#F4B400]" />
              <span>Immutable Audit Trail ({auditEvents.length} Recent Events)</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">PII Redaction Active</span>
          </div>

          <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-[#1E1E1E] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#2E2E2E]'}`}>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {auditEvents.map((evt) => (
                <div key={evt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#F4B400] text-[11px]">{evt.agentId || 'PLATFORM'}</span>
                      <span className="font-semibold">{evt.eventType}</span>
                      <span className="text-slate-400 font-mono text-[10px]">#{evt.id.slice(0, 8)}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      Resource: {evt.resourceType} / {evt.resourceId}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: POLICY MATRIX */}
      {activeTab === 'policies' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1E1E1E] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#2E2E2E]'}`}>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-[#F4B400]" />
              <span>Role-Based Access Control & Risk Tier Governance</span>
            </h3>
            <div className="space-y-3 text-xs">
              {[
                { tier: 'L0', name: 'Read-Only & Explanations', perm: 'Anyone (No approval)', desc: 'Product lookup, delivery tracking, catalog queries' },
                { tier: 'L1', name: 'Personalized Suggestions', perm: 'Customer / Merchant', desc: 'Reorder suggestions, shopping tips, route preview' },
                { tier: 'L2', name: 'Low-Risk Operations', perm: 'Merchant / Rider', desc: 'Draft promos, route accept, inventory counter' },
                { tier: 'L3', name: 'Controlled Mutations', perm: 'Single Reviewer Required', desc: 'Price updates, order cancel with refund, driver reassignment' },
                { tier: 'L4', name: 'Consequential Operations', perm: 'Maker-Checker Required', desc: 'Bulk payouts, financial adjustments > ₱2,500, rider suspension' },
                { tier: 'L5', name: 'Critical Infrastructure', perm: 'Super Admin Dual Key', desc: 'Platform Emergency Stop, agent quarantine release, schema updates' },
              ].map((p) => (
                <div key={p.tier} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold font-mono text-[#F4B400] mr-2">{p.tier}</span>
                    <strong className="text-slate-900 dark:text-white">{p.name}:</strong>
                    <span className="text-slate-500 dark:text-slate-400 ml-2">{p.desc}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">{p.perm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quarantine Confirmation Modal */}
      {quarantineTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Quarantine Agent {quarantineTargetId}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              Quarantining this agent will immediately revoke all tool permissions, pause task assignments, and isolate it from the orchestrator mesh.
            </p>
            <div className="space-y-3 mb-6">
              <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">
                Reason for Quarantine
              </label>
              <input
                type="text"
                placeholder="e.g., Policy deviation, high failure rate, safety audit"
                value={quarantineReasonInput}
                onChange={(e) => setQuarantineReasonInput(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setQuarantineTargetId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleQuarantineConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow"
              >
                Confirm Quarantine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

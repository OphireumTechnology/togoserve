import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { AIRiskLevel, AIActionProposal } from '../../types';

export const AICommandCenterView: React.FC = () => {
  const { aiProposals, handleHITLDecision, currentUser, isDarkMode } = useApp();

  const [activeTab, setActiveTab] = useState<'hitl' | 'agents' | 'policies'>('hitl');
  const [selectedProposal, setSelectedProposal] = useState<AIActionProposal | null>(null);
  const [modifyNotes, setModifyNotes] = useState('');

  const pendingProposals = aiProposals.filter((p) => p.status === 'PENDING_REVIEW');
  const resolvedProposals = aiProposals.filter((p) => p.status !== 'PENDING_REVIEW');

  const riskBadgeStyles: Record<AIRiskLevel, { bg: string; text: string; label: string }> = {
    L0: { bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', text: 'text-slate-500', label: 'L0 • Read/Explain' },
    L1: { bg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300', text: 'text-blue-500', label: 'L1 • Recommendation' },
    L2: { bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300', text: 'text-emerald-500', label: 'L2 • Low-Risk Auto' },
    L3: { bg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300', text: 'text-amber-500', label: 'L3 • Controlled Ops' },
    L4: { bg: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300', text: 'text-orange-500', label: 'L4 • Financial / Account (HITL)' },
    L5: { bg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300', text: 'text-rose-500', label: 'L5 • Critical Security (HITL)' },
  };

  const agentDirectory = [
    { id: 'A00', name: 'A00 Platform Supervisor', domain: 'ORCHESTRATION', status: 'ACTIVE', models: 'Gemini 2.5 Pro / Flash', uptime: '99.98%' },
    { id: 'A12', name: 'A12 Dynamic Catalog Copilot', domain: 'MERCHANT', status: 'ACTIVE', models: 'Gemini 2.5 Flash', uptime: '99.94%' },
    { id: 'A21', name: 'A21 Logistics Route Batcher', domain: 'LOGISTICS', status: 'ACTIVE', models: 'Gemini 2.5 Flash', uptime: '99.99%' },
    { id: 'A31', name: 'A31 Finance Settlement Auditor', domain: 'FINANCE', status: 'STANDBY', models: 'Gemini 2.5 Pro (Deep Recon)', uptime: '99.95%' },
    { id: 'A44', name: 'A44 Transaction Risk Guard', domain: 'SECURITY', status: 'ACTIVE', models: 'Gemini 2.5 Flash', uptime: '100.0%' },
    { id: 'A50', name: 'A50 Policy & Ethics Gatekeeper', domain: 'GOVERNANCE', status: 'ACTIVE', models: 'Gemini 2.5 Pro', uptime: '100.0%' },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-[#071A2F] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>A00 Master AI Supervisor Orchestration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            AI Command & Human-in-the-Loop (HITL) Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Governed multi-agent operational network. Consequential financial and security actions
            strictly gated by explicit policy boundaries and reviewer approvals.
          </p>
        </div>

        <div className="flex bg-white/10 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('hitl')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'hitl'
                ? 'bg-[#FFC928] text-[#071A2F] shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            HITL Review Queue ({pendingProposals.length})
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'agents'
                ? 'bg-[#FFC928] text-[#071A2F] shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Specialist Agents (6)
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'policies'
                ? 'bg-[#FFC928] text-[#071A2F] shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Risk Matrix (L0-L5)
          </button>
        </div>
      </div>

      {/* TAB 1: HITL QUEUE */}
      {activeTab === 'hitl' && (
        <div className="space-y-6">
          {/* Pending Proposals Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#FFC928]" />
                <span>Pending Governance Queue ({pendingProposals.length} Action Proposals)</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Authorized Reviewer: {currentUser?.name} ({currentUser?.role})
              </span>
            </div>

            {pendingProposals.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold">All AI actions audited and verified</h3>
                <p className="text-xs text-slate-400 mt-1">
                  No automated actions currently require manual human review.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingProposals.map((prop) => {
                  const riskInfo = riskBadgeStyles[prop.riskLevel];
                  return (
                    <div
                      key={prop.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isDarkMode
                          ? 'bg-[#0B223D] border-slate-800 text-white'
                          : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#D9A514]">
                            {prop.agentId}
                          </span>
                          <span className="text-xs font-semibold">{prop.agentName}</span>
                          <span className="text-slate-400 text-xs">• {prop.actionType}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${riskInfo.bg}`}>
                            {riskInfo.label}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            Confidence: {(prop.confidenceScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      {/* Description & Impact */}
                      <div className="py-3 space-y-2 text-xs">
                        <p className="font-semibold text-sm leading-snug">{prop.description}</p>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                          <strong>Proposed Action Payload: </strong>
                          {JSON.stringify(prop.proposedChanges, null, 2)}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                          <strong>Risk Assessment: </strong> {prop.impactAnalysis}
                        </p>
                      </div>

                      {/* Human Action Buttons */}
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">
                          Triggered: {new Date(prop.timestamp).toLocaleTimeString()}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleHITLDecision(prop.id, 'REJECTED', 'Rejected by administrator')}
                            className="px-3.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject Action</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProposal(prop);
                              setModifyNotes('Reduce discount scope by 5%');
                            }}
                            className="px-3.5 py-1.5 rounded-xl border border-amber-300 dark:border-amber-900 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Modify Parameters</span>
                          </button>
                          <button
                            onClick={() => handleHITLDecision(prop.id, 'APPROVED', 'Authorized execution')}
                            className="px-4 py-1.5 rounded-xl bg-[#16845B] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Execute</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Historical Audit Trail */}
          <div
            className={`p-5 rounded-2xl border ${
              isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B]'
            }`}
          >
            <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-[#D9A514]" />
              <span>Consequential Governance Audit Trail (Immutable)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-2.5">Agent / ID</th>
                    <th className="p-2.5">Action Proposed</th>
                    <th className="p-2.5">Risk Level</th>
                    <th className="p-2.5">Reviewer Decision</th>
                    <th className="p-2.5">Audit Note</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-[11px]">
                  {resolvedProposals.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2.5 font-bold text-[#D9A514]">{item.agentId}</td>
                      <td className="p-2.5 font-sans font-medium">{item.actionType}</td>
                      <td className="p-2.5">{item.riskLevel}</td>
                      <td className="p-2.5">{item.reviewerId}</td>
                      <td className="p-2.5 text-slate-400 font-sans">{item.reviewComment}</td>
                      <td className="p-2.5 font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'APPROVED'
                              ? 'bg-emerald-500/20 text-emerald-500'
                              : 'bg-rose-500/20 text-rose-500'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AGENT DIRECTORY */}
      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentDirectory.map((ag) => (
            <div
              key={ag.id}
              className={`p-5 rounded-2xl border ${
                isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-[#D9A514]/20 text-[#D9A514] font-bold font-mono text-xs">
                  {ag.id}
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-500 font-mono">
                  {ag.status}
                </span>
              </div>
              <h4 className="text-sm font-bold">{ag.name}</h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Domain: {ag.domain}</p>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs space-y-1 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                <div>Model: {ag.models}</div>
                <div>Operational SLA: {ag.uptime}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: RISK POLICIES */}
      {activeTab === 'policies' && (
        <div
          className={`p-6 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B]'
          }`}
        >
          <h3 className="text-base font-bold">TOGOSERVE Autonomous Action Governance Matrix</h3>
          <p className="text-xs text-slate-400 max-w-xl">
            In accordance with Sections 38 & 39 of the Master Directive, no autonomous agent is
            granted direct database write privileges without policy validation.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { level: 'L0', title: 'Read / Explain', detail: 'Read-only context generation and explanation. Unrestricted execution.', gate: 'Auto-Executed' },
              { level: 'L1', title: 'Recommendation', detail: 'Advisory insights for humans. No database state modifications.', gate: 'Auto-Executed' },
              { level: 'L2', title: 'Authorized Low-Risk', detail: 'Minor route adjustments and customer push notifications within strict bounds.', gate: 'Policy Gate' },
              { level: 'L3', title: 'Controlled Operational', detail: 'Dynamic merchant pricing within predefined ±10% margin band.', gate: 'Policy Gate' },
              { level: 'L4', title: 'High-Risk Financial / Payout', detail: 'Disbursements, ledger adjustments, refund authorizations > ₱500.', gate: 'Mandatory HITL Approval' },
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
    </div>
  );
};

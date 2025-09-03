"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Activity,
  Info,
  Download,
  FileText,
} from "lucide-react";
import clsx from "clsx";

// ✅ Status Badge with consistent icons + hover
export function StatusBadge({
  status,
  className = "",
}: {
  status: "low" | "normal" | "high" | "unknown";
  className?: string;
}) {
  const configs = {
    low: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: <TrendingDown className="h-4 w-4" />,
      label: "Below Optimal",
    },
    normal: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: "Optimal",
    },
    high: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: <TrendingUp className="h-4 w-4" />,
      label: "Above Optimal",
    },
    unknown: {
      bg: "bg-slate-50",
      text: "text-slate-600",
      border: "border-slate-200",
      icon: <Minus className="h-4 w-4" />,
      label: "Not Determined",
    },
  };

  const config = configs[status];

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium",
        "transition-all duration-200 hover:shadow-sm hover:scale-105",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}

// Utility functions (unchanged)
function normalize(str: string): string {
  return (str ?? "")
    .replace(/\u2013|\u2014|–|—/g, "-")
    .replace(/[^\S\r\n]+/g, " ")
    .trim();
}

function parseRange(raw: string): [number | null, number | null] {
  if (!raw) return [null, null];
  const s = normalize(raw).replace(/[,]/g, "");
  let m = s.match(/(-?\d+(?:\.\d+)?)\s*(?:-|to|–|—)\s*(-?\d+(?:\.\d+)?)/i);
  if (m) return [parseFloat(m[1]), parseFloat(m[2])];
  return [null, null];
}

function extractNumber(raw: string): number | null {
  if (!raw) return null;
  const s = normalize(raw).replace(/,/g, "");
  const m = s.match(/-?\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

type Status = "low" | "normal" | "high" | "unknown";

function getStatus(valueStr: string, rangeStr: string): Status {
  const val = extractNumber(valueStr);
  if (val == null) return "unknown";
  const [lo, hi] = parseRange(rangeStr);
  if (lo == null || hi == null) return "unknown";
  if (val < lo) return "low";
  if (val > hi) return "high";
  return "normal";
}

function parseMarkdownTable(md: string): { headers: string[]; rows: string[][] } | null {
  if (!md?.trim()) return null;
  const lines = md.split("\n").map((l) => l.trim()).filter(Boolean);
  const tableLines: string[] = [];
  let inTable = false;
  for (const line of lines) {
    if (/^\|.*\|$/.test(line)) {
      tableLines.push(line);
      inTable = true;
    } else if (inTable) {
      break;
    }
  }
  if (tableLines.length < 2) return null;
  const [header, separator, ...bodyLines] = tableLines;
  if (!/^\|?[\s:-]+\|/.test(separator)) return null;
  const splitRow = (row: string) => row.slice(1, -1).split("|").map((c) => c.trim());
  const headers = splitRow(header);
  const rows = bodyLines.map(splitRow).filter((cells) => cells.length === headers.length);
  return { headers, rows };
}

// ✅ Main ReportTable Component
export function ReportTable({ markdown }: { markdown: string }) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const parsed = useMemo(() => parseMarkdownTable(markdown), [markdown]);

  const idx = useMemo(() => {
    if (!parsed) return { metric: -1, value: -1, range: -1, tells: -1, tip: -1 };
    const h = parsed.headers.map((x) => x.toLowerCase());
    return {
      metric: h.findIndex((x) => x.includes("metric")),
      value: h.findIndex((x) => x.includes("value")),
      range: h.findIndex((x) => x.includes("range")),
      tells: h.findIndex((x) => x.includes("tells")),
      tip: h.findIndex((x) => x.includes("tip")),
    };
  }, [parsed]);

  const rows = useMemo(() => {
    if (!parsed || parsed.rows.length === 0) return [];
    return parsed.rows.map((r, i) => {
      const value = r[idx.value] ?? "";
      const range = r[idx.range] ?? "";
      const status = getStatus(value, range);
      return {
        id: i,
        metric: r[idx.metric] ?? "",
        value,
        range,
        status,
        tells: r[idx.tells] ?? "",
        tip: r[idx.tip] ?? "",
      };
    });
  }, [parsed, idx]);

  const toggleRow = useCallback((id: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }, []);

  const stats = useMemo(() => {
    const total = rows.length;
    const optimal = rows.filter((r) => r.status === "normal").length;
    const attention = rows.filter((r) => r.status === "low" || r.status === "high").length;
    const unknown = rows.filter((r) => r.status === "unknown").length;
    return { total, optimal, attention, unknown };
  }, [rows]);

  if (!parsed || rows.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
        <div className="text-center space-y-2">
          <Activity className="mx-auto h-12 w-12 text-blue-400" />
          <h3 className="text-xl font-semibold text-gray-900">No Health Data Yet</h3>
          <p className="text-gray-500 max-w-md">
            Generate or upload your health report to visualize insights here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="text-center flex-1 space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Your Health Insights</h1>
            <p className="text-lg text-gray-600">
              A sleek, modern overview of your health metrics with actionable insights.
            </p>
          </div>
          <button className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium shadow-md hover:shadow-lg transition">
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Metrics", value: stats.total, color: "blue" },
            { label: "Optimal", value: stats.optimal, color: "emerald" },
            { label: "Needs Attention", value: stats.attention, color: "amber" },
            { label: "Unknown", value: stats.unknown, color: "slate" },
          ].map((stat, i) => (
            <Card
              key={i}
              className="backdrop-blur-md bg-white/70 border border-white/40 shadow-lg rounded-2xl transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-6 text-center">
                <div className={`text-3xl font-bold text-${stat.color}-600`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="backdrop-blur-md bg-white/70 border border-white/40 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/60 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600 w-[25%]">
                      Health Metric
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-600 w-[15%]">
                      Your Value
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-600 w-[15%]">
                      Healthy Range
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-600 w-[20%]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center w-[10%]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <tr
                        className={clsx(
                          "transition-colors duration-300 hover:bg-blue-50/30",
                          row.status === "normal"
                            ? "bg-emerald-50/30"
                            : row.status === "low"
                            ? "bg-amber-50/30"
                            : row.status === "high"
                            ? "bg-red-50/30"
                            : "bg-slate-50/30"
                        )}
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {row.metric}
                        </td>
                        <td
                          className={clsx(
                            "px-6 py-4 font-semibold text-center",
                            row.status === "normal"
                              ? "text-emerald-600"
                              : row.status === "low"
                              ? "text-amber-600"
                              : row.status === "high"
                              ? "text-red-600"
                              : "text-gray-600"
                          )}
                        >
                          {row.value}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600">
                          {row.range}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => toggleRow(row.id)}
                            className="p-1 rounded-full hover:bg-gray-200 transition bg-transparent"
                            aria-expanded={expandedRows.has(row.id)}
                          >
                            {expandedRows.has(row.id) ? (
                              <ChevronUp className="h-4 w-4 text-gray-500 " />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-500 " />
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedRows.has(row.id) && (
                        <tr className="animate-slideDown">
                          <td colSpan={6} className="px-6 py-6">
                            <div className="space-y-4">
                              {row.tells && (
                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    What This Means
                                  </h4>
                                  <p className="text-sm text-gray-700 leading-relaxed text-left">
                                    {row.tells}
                                  </p>
                                </div>
                              )}
                              {row.tip && (
                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                                  <h4 className="font-medium text-emerald-800 mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Pro Tip
                                  </h4>
                                  <p className="text-sm text-gray-700 leading-relaxed text-left">
                                    {row.tip}
                                  </p>
                                </div>
                              )}
                              {(row.status === "low" || row.status === "high") && (
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                                  <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                                    Recommendation
                                  </h4>
                                  <p className="text-sm text-amber-700 text-left leading-relaxed">
                                    Schedule a follow-up with your doctor to discuss this result and
                                    next steps.
                                  </p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Info className="h-4 w-4" />
            This is not medical advice. Consult a professional for personalized guidance.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReportTable;








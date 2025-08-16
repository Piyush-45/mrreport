"use client";

// components/ReportTable.tsx
import React, { useState, useMemo, useCallback } from 'react';
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
    Info
} from "lucide-react";
import clsx from "clsx";

// StatusBadge component (same as before, but with refined styling)
export function StatusBadge({
    status,
    className = ""
}: {
    status: "low" | "normal" | "high" | "unknown";
    className?: string;
}) {
    const configs = {
        low: {
            bg: "bg-amber-50/80",
            text: "text-amber-700",
            border: "border-amber-100",
            icon: <TrendingDown className="h-3.5 w-3.5" />,
            label: "Below Optimal"
        },
        normal: {
            bg: "bg-emerald-50/80",
            text: "text-emerald-700",
            border: "border-emerald-100",
            icon: <CheckCircle2 className="h-3.5 w-3.5" />,
            label: "Optimal"
        },
        high: {
            bg: "bg-red-50/80",
            text: "text-red-700",
            border: "border-red-100",
            icon: <TrendingUp className="h-3.5 w-3.5" />,
            label: "Above Optimal"
        },
        unknown: {
            bg: "bg-slate-50/80",
            text: "text-slate-600",
            border: "border-slate-100",
            icon: <Minus className="h-3.5 w-3.5" />,
            label: "Not Determined"
        }
    };

    const config = configs[status];

    return (
        <div className={clsx(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium",
            "transition-all duration-200 hover:shadow-sm hover:scale-105",
            config.bg, config.text, config.border, className
        )}>
            {config.icon}
            <span>{config.label}</span>
        </div>
    );
}

// Mini ProgressBar for table cells
// function MiniProgressBar({
//     valueStr,
//     rangeStr,
//     status
// }: {
//     valueStr: string;
//     rangeStr: string;
//     status: "low" | "normal" | "high" | "unknown";
// }) {
//     const getProgress = useCallback((valueStr: string, rangeStr: string) => {
//         const val = extractNumber(valueStr);
//         const [min, max] = parseRange(rangeStr);
//         if (val == null || min == null || max == null || !isFinite(min) || !isFinite(max)) {
//             return 50;
//         }
//         const rangeWidth = max - min;
//         if (rangeWidth <= 0) return 50;
//         const normalized = ((val - min) / rangeWidth) * 100;
//         return Math.min(Math.max(normalized, 10), 90); // Constrain for visual balance
//     }, []);

//     const percentage = getProgress(valueStr, rangeStr);

//     const barColors = {
//         low: "bg-amber-400",
//         normal: "bg-emerald-400",
//         high: "bg-red-400",
//         unknown: "bg-slate-300"
//     };

//     return (
//         <div className="relative w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//             <div
//                 className={clsx("h-full rounded-full transition-all duration-500", barColors[status])}
//                 style={{ width: `${percentage}%` }}
//             />
//         </div>
//     );
// }

// Utility functions (same as original, included for completeness)
export function normalize(str: string): string {
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
    m = s.match(/^[≤<=<]\s*(-?\d+(?:\.\d+)?)/);
    if (m) return [Number.NEGATIVE_INFINITY, parseFloat(m[1])];
    m = s.match(/^[≥>=>]\s*(-?\d+(?:\.\d+)?)/);
    if (m) return [parseFloat(m[1]), Number.POSITIVE_INFINITY];
    m = s.match(/(-?\d+(?:\.\d+)?)\s*[±]\s*(-?\d+(?:\.\d+)?)/);
    if (m) {
        const c = parseFloat(m[1]);
        const d = parseFloat(m[2]);
        return [c - d, c + d];
    }
    m = s.match(/^(-?\d+(?:\.\d+)?)$/);
    if (m) return [parseFloat(m[1]), parseFloat(m[1])];
    return [null, null];
}

function extractNumber(raw: string): number | null {
    if (!raw) return null;
    const s = normalize(raw).replace(/,/g, "");
    const m = s.match(/-?\d+(?:\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
}

// type Status = "low" | "normal" | "high" | "unknown";

type Status = "low" | "normal" | "high" | "unknown";

function getStatus(valueStr: string, rangeStr: string): Status {
    const val = extractNumber(valueStr);
    if (val == null) return "unknown";

    const s = normalize(rangeStr).replace(/,/g, "");

    // Explicit operators first
    const mLe = s.match(/^(?:≤|<=|<)\s*(-?\d+(?:\.\d+)?)/);
    if (mLe) return val <= parseFloat(mLe[1]) ? "normal" : "high";

    const mGe = s.match(/^(?:≥|>=|>)\s*(-?\d+(?:\.\d+)?)/);
    if (mGe) return val >= parseFloat(mGe[1]) ? "normal" : "low";

    // Fallback to parsed range
    const [lo, hi] = parseRange(rangeStr);
    if (lo == null || hi == null) return "unknown";

    if (lo === Number.NEGATIVE_INFINITY && isFinite(hi)) {
        // Only an upper bound, e.g. "< 100"
        return val <= hi ? "normal" : "high";
    }
    if (isFinite(lo) && hi === Number.POSITIVE_INFINITY) {
        // Only a lower bound, e.g. ">= 4"
        return val >= lo ? "normal" : "low";
    }

    if (isFinite(lo) && isFinite(hi)) {
        if (lo === hi) return val === lo ? "normal" : (val < lo ? "low" : "high");
        if (val < lo) return "low";
        if (val > hi) return "high";
        return "normal";
    }

    return "unknown";
}


function parseMarkdownTable(md: string): { headers: string[]; rows: string[][] } | null {
    if (!md?.trim()) return null;
    const lines = md.split("\n").map(l => l.trim()).filter(Boolean);
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
    const splitRow = (row: string) => row.slice(1, -1).split("|").map(c => c.trim());
    const headers = splitRow(header);
    const rows = bodyLines.map(splitRow).filter(cells => cells.length === headers.length);
    return { headers, rows };
}

// Main Component
export function ReportTable({ markdown }: { markdown: string }) {
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const parsed = useMemo(() => parseMarkdownTable(markdown), [markdown]);

    const idx = useMemo(() => {
        if (!parsed) return { metric: -1, value: -1, range: -1, tells: -1, tip: -1 };
        const h = parsed.headers.map((x) => x.toLowerCase());
        return {
            metric: h.findIndex((x) => x.includes("health metric") || x.includes("metric")),
            value: h.findIndex((x) => x.includes("your value") || x.includes("value")),
            range: h.findIndex((x) => x.includes("healthy range") || x.includes("range")),
            tells: h.findIndex((x) => x.includes("what it tells") || x.includes("tells")),
            tip: h.findIndex((x) => x.includes("pro tip") || x.includes("tip")),
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
                tip: r[idx.tip] ?? ""
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
        const optimal = rows.filter(r => r.status === "normal").length;
        const attention = rows.filter(r => r.status === "low" || r.status === "high").length;
        const unknown = rows.filter(r => r.status === "unknown").length;
        return { total, optimal, attention, unknown };
    }, [rows]);

    if (!parsed || rows.length === 0) {
        return (
            <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                <div className="text-center space-y-2">
                    <Activity className="mx-auto h-12 w-12 text-blue-400" />
                    <h3 className="text-xl font-semibold text-gray-900">No Health Data Yet</h3>
                    <p className="text-gray-500 max-w-md">Generate or upload your health report to visualize insights here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Your Health Insights</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">A sleek, modern overview of your health metrics with actionable insights.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Metrics", value: stats.total, color: "blue" },
                        { label: "Optimal", value: stats.optimal, color: "emerald" },
                        { label: "Needs Attention", value: stats.attention, color: "amber" },
                        { label: "Unknown", value: stats.unknown, color: "slate" }
                    ].map((stat, i) => (
                        <Card key={i} className="backdrop-blur-md bg-white/30 border border-white/20 shadow-lg rounded-2xl transition-all duration-300 hover:scale-105">
                            <CardContent className="p-6 text-center">
                                <div className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Table */}
                <Card className="backdrop-blur-md bg-white/30 border border-white/20 shadow-xl rounded-2xl overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-white/40 sticky top-0 z-10">
                                    <tr className="border-b border-black">
                                        <th className="px-4 py-3 text-center font-semibold text-[18px]  text-gray-600 w-[25%]">Health Metric</th>
                                        <th className="px-4 py-3 text-center font-semibold text-[18px]  text-gray-600 w-[15%]">Your Value</th>
                                        <th className="px-4 py-3 text-center font-semibold text-[18px]  text-gray-600 w-[15%]">Healthy Range</th>
                                        {/* <th className="px-4 py-3 text-center font-semibold text-[18px]  text-gray-600 w-[20%]">Progress</th> */}
                                        <th className="px-4 py-3 text-center font-semibold text-[18px]  text-gray-600 w-[15%]">Status</th>
                                        <th className="px-4 py-3 text-center font-semibold text-[18px]  text-gray-600 w-[10%]"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/10">
                                    {rows.map((row) => (
                                        <React.Fragment key={row.id}>
                                            <tr
                                                className={clsx(
                                                    "transition-colors duration-300 hover:bg-white/20",
                                                    row.status === "normal" ? "bg-emerald-50/20" :
                                                        row.status === "low" ? "bg-amber-50/20" :
                                                            row.status === "high" ? "bg-red-50/20" : "bg-slate-50/20"
                                                )}
                                            >
                                                <td className="px-4 py-3 font-medium 
                                                 text-gray-900">{row.metric}</td>
                                                <td className={clsx(
                                                    "px-4 py-3 font-semibold",
                                                    row.status === "normal" ? "text-emerald-600" :
                                                        row.status === "low" ? "text-amber-600" :
                                                            row.status === "high" ? "text-red-600" : "text-gray-600"
                                                )}>
                                                    {row.value}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{row.range}</td>
                                                {/* <td className="px-4 py-3">
                                                    <MiniProgressBar valueStr={row.value} rangeStr={row.range} status={row.status} />
                                                </td> */}
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={row.status} />
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        onClick={() => toggleRow(row.id)}
                                                        className="p-1 rounded-full hover:bg-white/30 transition-colors bg-transparent"
                                                        aria-expanded={expandedRows.has(row.id)}
                                                    >
                                                        {expandedRows.has(row.id) ? (
                                                            <ChevronUp className="h-4 w-4 text-gray-500" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4 text-gray-500" />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedRows.has(row.id) && (
                                                <tr className="bg-white/10">
                                                    <td colSpan={6} className="px-4 py-4">
                                                        <div className="space-y-2">
                                                            <div className="p-4 rounded-xl bg-white/20">
                                                                <h4 className="font-medium text-gray-800 mb-2  flex items-center gap-2">
                                                                    <AlertCircle className="h-4 w-4 text-blue-500" />
                                                                    What This Means
                                                                </h4>
                                                                <p className="text-sm text-gray-700 leading-relaxed text-left">{row.tells}</p>
                                                            </div>
                                                            <div className="p-4 rounded-xl bg-white/20">
                                                                <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                                    Pro Tip
                                                                </h4>
                                                                <p className="text-sm text-gray-700 leading-relaxed text-left">{row.tip}</p>
                                                            </div>
                                                            {(row.status === 'low' || row.status === 'high') && (
                                                                <div className="p-4 rounded-xl bg-amber-50/20">
                                                                    <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                                                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                                        Recommendation
                                                                    </h4>
                                                                    <p className="text-sm text-amber-700  text-left leading-relaxed">
                                                                        Schedule a follow-up with your doctor to discuss this result and potential next steps.
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












// ----------- perfectly fine veriosn ---------
// "use client";

// components/ReportTable.tsx
// import React, { useState, useMemo, useCallback } from 'react';
// import { Card, CardContent } from "@/components/ui/card";
// import {
//     CheckCircle2,
//     AlertTriangle,
//     AlertCircle,
//     TrendingUp,
//     TrendingDown,
//     Minus,
//     ChevronDown,
//     ChevronUp,
//     Activity,
//     Info
// } from "lucide-react";
// import clsx from "clsx";

// // StatusBadge component (same as before, but with refined styling)
// function StatusBadge({
//     status,
//     className = ""
// }: {
//     status: "low" | "normal" | "high" | "unknown";
//     className?: string;
// }) {
//     const configs = {
//         low: {
//             bg: "bg-amber-50/80",
//             text: "text-amber-700",
//             border: "border-amber-100",
//             icon: <TrendingDown className="h-3.5 w-3.5" />,
//             label: "Below Optimal"
//         },
//         normal: {
//             bg: "bg-emerald-50/80",
//             text: "text-emerald-700",
//             border: "border-emerald-100",
//             icon: <CheckCircle2 className="h-3.5 w-3.5" />,
//             label: "Optimal"
//         },
//         high: {
//             bg: "bg-red-50/80",
//             text: "text-red-700",
//             border: "border-red-100",
//             icon: <TrendingUp className="h-3.5 w-3.5" />,
//             label: "Above Optimal"
//         },
//         unknown: {
//             bg: "bg-slate-50/80",
//             text: "text-slate-600",
//             border: "border-slate-100",
//             icon: <Minus className="h-3.5 w-3.5" />,
//             label: "Not Determined"
//         }
//     };

//     const config = configs[status];

//     return (
//         <div className={clsx(
//             "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium",
//             "transition-all duration-200 hover:shadow-sm hover:scale-105",
//             config.bg, config.text, config.border, className
//         )}>
//             {config.icon}
//             <span>{config.label}</span>
//         </div>
//     );
// }

// // Mini ProgressBar for table cells
// function MiniProgressBar({
//     valueStr,
//     rangeStr,
//     status
// }: {
//     valueStr: string;
//     rangeStr: string;
//     status: "low" | "normal" | "high" | "unknown";
// }) {
//     const getProgress = useCallback((valueStr: string, rangeStr: string) => {
//         const val = extractNumber(valueStr);
//         const [min, max] = parseRange(rangeStr);
//         if (val == null || min == null || max == null || !isFinite(min) || !isFinite(max)) {
//             return 50;
//         }
//         const rangeWidth = max - min;
//         if (rangeWidth <= 0) return 50;
//         const normalized = ((val - min) / rangeWidth) * 100;
//         return Math.min(Math.max(normalized, 10), 90); // Constrain for visual balance
//     }, []);

//     const percentage = getProgress(valueStr, rangeStr);

//     const barColors = {
//         low: "bg-amber-400",
//         normal: "bg-emerald-400",
//         high: "bg-red-400",
//         unknown: "bg-slate-300"
//     };

//     return (
//         <div className="relative w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//             <div
//                 className={clsx("h-full rounded-full transition-all duration-500", barColors[status])}
//                 style={{ width: `${percentage}%` }}
//             />
//         </div>
//     );
// }

// // Utility functions (same as original, included for completeness)
// function normalize(str: string): string {
//     return (str ?? "")
//         .replace(/\u2013|\u2014|–|—/g, "-")
//         .replace(/[^\S\r\n]+/g, " ")
//         .trim();
// }

// function parseRange(raw: string): [number | null, number | null] {
//     if (!raw) return [null, null];
//     const s = normalize(raw).replace(/[,]/g, "");
//     let m = s.match(/(-?\d+(?:\.\d+)?)\s*(?:-|to|–|—)\s*(-?\d+(?:\.\d+)?)/i);
//     if (m) return [parseFloat(m[1]), parseFloat(m[2])];
//     m = s.match(/^[≤<=<]\s*(-?\d+(?:\.\d+)?)/);
//     if (m) return [Number.NEGATIVE_INFINITY, parseFloat(m[1])];
//     m = s.match(/^[≥>=>]\s*(-?\d+(?:\.\d+)?)/);
//     if (m) return [parseFloat(m[1]), Number.POSITIVE_INFINITY];
//     m = s.match(/(-?\d+(?:\.\d+)?)\s*[±]\s*(-?\d+(?:\.\d+)?)/);
//     if (m) {
//         const c = parseFloat(m[1]);
//         const d = parseFloat(m[2]);
//         return [c - d, c + d];
//     }
//     m = s.match(/^(-?\d+(?:\.\d+)?)$/);
//     if (m) return [parseFloat(m[1]), parseFloat(m[1])];
//     return [null, null];
// }

// function extractNumber(raw: string): number | null {
//     if (!raw) return null;
//     const s = normalize(raw).replace(/,/g, "");
//     const m = s.match(/-?\d+(?:\.\d+)?/);
//     return m ? parseFloat(m[0]) : null;
// }

// type Status = "low" | "normal" | "high" | "unknown";

// function getStatus(valueStr: string, rangeStr: string): Status {
//     const [lo, hi] = parseRange(rangeStr);
//     const val = extractNumber(valueStr);
//     if (val == null || lo == null || hi == null || !isFinite(lo) || !isFinite(hi)) return "unknown";
//     if (val < lo) return "low";
//     if (val > hi) return "high";
//     return "normal";
// }

// function parseMarkdownTable(md: string): { headers: string[]; rows: string[][] } | null {
//     if (!md?.trim()) return null;
//     const lines = md.split("\n").map(l => l.trim()).filter(Boolean);
//     const tableLines: string[] = [];
//     let inTable = false;
//     for (const line of lines) {
//         if (/^\|.*\|$/.test(line)) {
//             tableLines.push(line);
//             inTable = true;
//         } else if (inTable) {
//             break;
//         }
//     }
//     if (tableLines.length < 2) return null;
//     const [header, separator, ...bodyLines] = tableLines;
//     if (!/^\|?[\s:-]+\|/.test(separator)) return null;
//     const splitRow = (row: string) => row.slice(1, -1).split("|").map(c => c.trim());
//     const headers = splitRow(header);
//     const rows = bodyLines.map(splitRow).filter(cells => cells.length === headers.length);
//     return { headers, rows };
// }

// // Main Component
// export function ReportTable({ markdown }: { markdown: string }) {
//     const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

//     const parsed = useMemo(() => parseMarkdownTable(markdown), [markdown]);

//     const idx = useMemo(() => {
//         if (!parsed) return { metric: -1, value: -1, range: -1, tells: -1, tip: -1 };
//         const h = parsed.headers.map((x) => x.toLowerCase());
//         return {
//             metric: h.findIndex((x) => x.includes("health metric") || x.includes("metric")),
//             value: h.findIndex((x) => x.includes("your value") || x.includes("value")),
//             range: h.findIndex((x) => x.includes("healthy range") || x.includes("range")),
//             tells: h.findIndex((x) => x.includes("what it tells") || x.includes("tells")),
//             tip: h.findIndex((x) => x.includes("pro tip") || x.includes("tip")),
//         };
//     }, [parsed]);

//     const rows = useMemo(() => {
//         if (!parsed || parsed.rows.length === 0) return [];
//         return parsed.rows.map((r, i) => {
//             const value = r[idx.value] ?? "";
//             const range = r[idx.range] ?? "";
//             const status = getStatus(value, range);
//             return {
//                 id: i,
//                 metric: r[idx.metric] ?? "",
//                 value,
//                 range,
//                 status,
//                 tells: r[idx.tells] ?? "",
//                 tip: r[idx.tip] ?? ""
//             };
//         });
//     }, [parsed, idx]);

//     const toggleRow = useCallback((id: number) => {
//         setExpandedRows((prev) => {
//             const newSet = new Set(prev);
//             if (newSet.has(id)) newSet.delete(id);
//             else newSet.add(id);
//             return newSet;
//         });
//     }, []);

//     const stats = useMemo(() => {
//         const total = rows.length;
//         const optimal = rows.filter(r => r.status === "normal").length;
//         const attention = rows.filter(r => r.status === "low" || r.status === "high").length;
//         const unknown = rows.filter(r => r.status === "unknown").length;
//         return { total, optimal, attention, unknown };
//     }, [rows]);

//     if (!parsed || rows.length === 0) {
//         return (
//             <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
//                 <div className="text-center space-y-2">
//                     <Activity className="mx-auto h-12 w-12 text-blue-400" />
//                     <h3 className="text-xl font-semibold text-gray-900">No Health Data Yet</h3>
//                     <p className="text-gray-500 max-w-md">Generate or upload your health report to visualize insights here.</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
//             <div className="max-w-6xl mx-auto space-y-12">
//                 {/* Header */}
//                 <div className="text-center space-y-4">
//                     <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Your Health Insights</h1>
//                     <p className="text-lg text-gray-600 max-w-2xl mx-auto">A sleek, modern overview of your health metrics with actionable insights.</p>
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                     {[
//                         { label: "Total Metrics", value: stats.total, color: "blue" },
//                         { label: "Optimal", value: stats.optimal, color: "emerald" },
//                         { label: "Needs Attention", value: stats.attention, color: "amber" },
//                         { label: "Unknown", value: stats.unknown, color: "slate" }
//                     ].map((stat, i) => (
//                         <Card key={i} className="backdrop-blur-md bg-white/30 border border-white/20 shadow-lg rounded-2xl transition-all duration-300 hover:scale-105">
//                             <CardContent className="p-6 text-center">
//                                 <div className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</div>
//                                 <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </div>

//                 {/* Table */}
//                 <Card className="backdrop-blur-md bg-white/30 border border-white/20 shadow-xl rounded-2xl overflow-hidden">
//                     <CardContent className="p-0">
//                         <div className="overflow-x-auto">
//                             <table className="w-full text-sm">
//                                 <thead className="bg-white/40 sticky top-0 z-10">
//                                     <tr className="border-b border-black">
//                                         <th className="px-4 py-3 text-center font-semibold text-[18px]  text-gray-600 w-[25%]">Health Metric</th>
//                                         <th className="px-4 py-3 text-center font-semibold text-[18px]  text-gray-600 w-[15%]">Your Value</th>
//                                         <th className="px-4 py-3 text-center font-semibold text-[18px]  text-gray-600 w-[15%]">Healthy Range</th>
//                                         <th className="px-4 py-3 text-center font-semibold text-[18px]  text-gray-600 w-[20%]">Progress</th>
//                                         <th className="px-4 py-3 text-center font-semibold text-[18px]  text-gray-600 w-[15%]">Status</th>
//                                         <th className="px-4 py-3 text-center font-semibold text-[18px]  text-gray-600 w-[10%]"></th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-black/10">
//                                     {rows.map((row) => (
//                                         <React.Fragment key={row.id}>
//                                             <tr
//                                                 className={clsx(
//                                                     "transition-colors duration-300 hover:bg-white/20",
//                                                     row.status === "normal" ? "bg-emerald-50/20" :
//                                                         row.status === "low" ? "bg-amber-50/20" :
//                                                             row.status === "high" ? "bg-red-50/20" : "bg-slate-50/20"
//                                                 )}
//                                             >
//                                                 <td className="px-4 py-3 font-medium 
//                                                  text-gray-900">{row.metric}</td>
//                                                 <td className={clsx(
//                                                     "px-4 py-3 font-semibold",
//                                                     row.status === "normal" ? "text-emerald-600" :
//                                                         row.status === "low" ? "text-amber-600" :
//                                                             row.status === "high" ? "text-red-600" : "text-gray-600"
//                                                 )}>
//                                                     {row.value}
//                                                 </td>
//                                                 <td className="px-4 py-3 text-gray-600">{row.range}</td>
//                                                 <td className="px-4 py-3">
//                                                     <MiniProgressBar valueStr={row.value} rangeStr={row.range} status={row.status} />
//                                                 </td>
//                                                 <td className="px-4 py-3">
//                                                     <StatusBadge status={row.status} />
//                                                 </td>
//                                                 <td className="px-4 py-3 text-right">
//                                                     <button
//                                                         onClick={() => toggleRow(row.id)}
//                                                         className="p-1 rounded-full hover:bg-white/30 transition-colors bg-transparent"
//                                                         aria-expanded={expandedRows.has(row.id)}
//                                                     >
//                                                         {expandedRows.has(row.id) ? (
//                                                             <ChevronUp className="h-4 w-4 text-gray-500" />
//                                                         ) : (
//                                                             <ChevronDown className="h-4 w-4 text-gray-500" />
//                                                         )}
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                             {expandedRows.has(row.id) && (
//                                                 <tr className="bg-white/10">
//                                                     <td colSpan={6} className="px-4 py-4">
//                                                         <div className="space-y-2">
//                                                             <div className="p-4 rounded-xl bg-white/20">
//                                                                 <h4 className="font-medium text-gray-800 mb-2  flex items-center gap-2">
//                                                                     <AlertCircle className="h-4 w-4 text-blue-500" />
//                                                                     What This Means
//                                                                 </h4>
//                                                                 <p className="text-sm text-gray-700 leading-relaxed text-left">{row.tells}</p>
//                                                             </div>
//                                                             <div className="p-4 rounded-xl bg-white/20">
//                                                                 <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
//                                                                     <CheckCircle2 className="h-4 w-4 text-emerald-500" />
//                                                                     Pro Tip
//                                                                 </h4>
//                                                                 <p className="text-sm text-gray-700 leading-relaxed text-left">{row.tip}</p>
//                                                             </div>
//                                                             {(row.status === 'low' || row.status === 'high') && (
//                                                                 <div className="p-4 rounded-xl bg-amber-50/20">
//                                                                     <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
//                                                                         <AlertTriangle className="h-4 w-4 text-amber-500" />
//                                                                         Recommendation
//                                                                     </h4>
//                                                                     <p className="text-sm text-amber-700 leading-relaxed">
//                                                                         Schedule a follow-up with your doctor to discuss this result and potential next steps.
//                                                                     </p>
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             )}
//                                         </React.Fragment>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* Footer Note */}
//                 <div className="text-center mt-12">
//                     <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
//                         <Info className="h-4 w-4" />
//                         This is not medical advice. Consult a professional for personalized guidance.
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ReportTable;

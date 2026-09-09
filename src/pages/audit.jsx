import { useEffect, useState } from "react";
import {
    Activity,
    AlertCircle,
    Calendar,
    CheckCircle2,
    ClipboardList,
    Clock,
    FileText,
    Hash,
    RefreshCw,
    ShieldCheck,
    User,
} from "lucide-react";

import api from "../services/api";
import BackButton from "../components/BackButton";

function Audit() {
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const fetchAuditLogs = async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await api.get("/audit", {
                params: {
                    page: 1,
                    limit: 20,
                },
            });

            setLogs(response.data.results || []);
            setTotal(response.data.total || 0);
        } catch (err) {
            setError(
                err.response?.data?.error?.message ||
                    "Failed to load audit trail"
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    const formatAction = (action) => {
        if (!action) return "Unknown Action";

        return action
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const getActionStyle = (action) => {
        const value = action?.toLowerCase() || "";

        if (value.includes("upload") || value.includes("created")) {
            return {
                container: "bg-emerald-50 text-emerald-700 border-emerald-200",
                icon: "text-emerald-600",
            };
        }

        if (value.includes("download") || value.includes("view")) {
            return {
                container: "bg-blue-50 text-blue-700 border-blue-200",
                icon: "text-blue-600",
            };
        }

        if (value.includes("delete") || value.includes("failed")) {
            return {
                container: "bg-red-50 text-red-700 border-red-200",
                icon: "text-red-600",
            };
        }

        if (value.includes("anchor") || value.includes("verify")) {
            return {
                container: "bg-violet-50 text-violet-700 border-violet-200",
                icon: "text-violet-600",
            };
        }

        return {
            container: "bg-slate-50 text-slate-600 border-slate-200",
            icon: "text-slate-500",
        };
    };

    const getActionIcon = (action) => {
        const value = action?.toLowerCase() || "";

        if (value.includes("upload") || value.includes("created")) {
            return CheckCircle2;
        }

        if (value.includes("download") || value.includes("view")) {
            return FileText;
        }

        if (value.includes("anchor") || value.includes("verify")) {
            return ShieldCheck;
        }

        return Activity;
    };

    return (
        <div className="mx-auto max-w-6xl space-y-6">

            {/* Back */}
            <BackButton
                to="/dashboard"
                label="Back to Dashboard"
            />

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                        <ClipboardList size={24} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Audit Trail
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Monitor and review activity across the evidence system
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => fetchAuditLogs(true)}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RefreshCw
                        size={17}
                        className={refreshing ? "animate-spin" : ""}
                    />

                    {refreshing ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Total Events
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {total}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Recorded audit events
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                            <Activity
                                size={21}
                                className="text-blue-600"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Security Status
                            </p>

                            <p className="mt-2 text-lg font-bold text-emerald-700">
                                Audit Active
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Activity tracking enabled
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                            <ShieldCheck
                                size={21}
                                className="text-emerald-600"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                    <AlertCircle
                        size={19}
                        className="mt-0.5 shrink-0"
                    />

                    <div>
                        <p className="font-semibold">
                            Unable to load audit trail
                        </p>

                        <p className="mt-1">
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {/* Audit Logs */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Activity Log
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Recent actions performed within the system
                            </p>
                        </div>

                        <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 sm:inline-flex">
                            {logs.length} shown
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4 p-6">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="animate-pulse rounded-xl border border-slate-100 p-5"
                            >
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-200" />

                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 w-40 rounded bg-slate-200" />
                                        <div className="h-3 w-64 rounded bg-slate-100" />
                                        <div className="h-3 w-48 rounded bg-slate-100" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : logs.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                            <ClipboardList
                                size={26}
                                className="text-slate-400"
                            />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-800">
                            No audit activity
                        </h3>

                        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                            Audit events will appear here as users interact
                            with evidence and cases.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {logs.map((log) => {
                            const style = getActionStyle(log.action);
                            const ActionIcon = getActionIcon(log.action);

                            return (
                                <div
                                    key={log.id}
                                    className="p-6 transition hover:bg-slate-50/70"
                                >
                                    <div className="flex items-start gap-4">

                                        {/* Icon */}
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${style.container}`}
                                        >
                                            <ActionIcon
                                                size={18}
                                                className={style.icon}
                                            />
                                        </div>

                                        {/* Main Content */}
                                        <div className="min-w-0 flex-1">

                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="font-semibold text-slate-800">
                                                            {formatAction(
                                                                log.action
                                                            )}
                                                        </h3>

                                                        <span
                                                            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${style.container}`}
                                                        >
                                                            {log.action}
                                                        </span>
                                                    </div>

                                                    {log.details && (
                                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                                            {log.details}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-400">
                                                    <Clock size={14} />

                                                    {log.timestamp
                                                        ? new Date(
                                                              log.timestamp
                                                          ).toLocaleString()
                                                        : "Unknown time"}
                                                </div>
                                            </div>

                                            {/* Metadata */}
                                            <div className="mt-4 flex flex-wrap gap-2">

                                                {log.user_name && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600">
                                                        <User size={13} />
                                                        {log.user_name}
                                                    </span>
                                                )}

                                                {log.document_id && (
                                                    <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600">
                                                        <FileText size={13} />
                                                        <span className="truncate">
                                                            Document:{" "}
                                                            {log.document_id}
                                                        </span>
                                                    </span>
                                                )}

                                                {log.case_id && (
                                                    <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600">
                                                        <Hash size={13} />
                                                        <span className="truncate">
                                                            Case:{" "}
                                                            {log.case_id}
                                                        </span>
                                                    </span>
                                                )}

                                                {log.timestamp && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-500">
                                                        <Calendar size={13} />
                                                        {new Date(
                                                            log.timestamp
                                                        ).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Audit ID */}
                                            <p className="mt-4 break-all font-mono text-[11px] text-slate-400">
                                                Audit ID: {log.id}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Audit;
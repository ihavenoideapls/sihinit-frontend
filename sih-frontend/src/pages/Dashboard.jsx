
import { useNavigate } from "react-router-dom";
import {
    FolderOpen,
    FileText,
    Search,
    Activity,
    ArrowRight,
    ShieldCheck,
    LogOut,
} from "lucide-react";

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    const features = [
        {
            title: "Cases",
            description:
                "Create, manage and monitor investigation cases.",
            icon: FolderOpen,
            path: "/cases",
        },
        {
            title: "Documents",
            description:
                "Upload, manage and track digital evidence.",
            icon: FileText,
            path: "/documents",
        },
        {
            title: "Search Evidence",
            description:
                "Quickly find evidence across the system.",
            icon: Search,
            path: "/search",
        },
        {
            title: "Audit Trail",
            description:
                "Review activity and maintain evidence accountability.",
            icon: Activity,
            path: "/audit",
        },
    ];

    return (
        <div className="mx-auto max-w-7xl">

            {/* ================================
                WELCOME
            ================================= */}

            <section className="mb-8 overflow-hidden rounded-2xl bg-slate-900 p-8 text-white shadow-sm">

                <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">

                    <div>
                        <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
                            <ShieldCheck size={18} />
                            Secure Evidence Management
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight">
                            Welcome back,{" "}
                            {user?.name || "User"}
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                            Manage investigation cases, digital evidence,
                            document versions and system activity from one
                            secure workspace.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-4">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 font-semibold">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div>
                            <p className="text-sm font-semibold">
                                {user?.name || "User"}
                            </p>

                            <p className="text-xs capitalize text-slate-400">
                                {user?.role || "User"}
                            </p>
                        </div>

                    </div>

                </div>

            </section>

            {/* ================================
                SYSTEM STATUS
            ================================= */}

            <section className="mb-8 grid gap-4 sm:grid-cols-3">

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">
                            System Status
                        </span>

                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </div>

                    <p className="text-lg font-semibold text-slate-900">
                        Operational
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        All services running normally
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">
                            Your Role
                        </span>

                        <ShieldCheck
                            size={18}
                            className="text-slate-400"
                        />
                    </div>

                    <p className="text-lg font-semibold capitalize text-slate-900">
                        {user?.role || "User"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        Access level assigned to your account
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">
                            Security
                        </span>

                        <ShieldCheck
                            size={18}
                            className="text-slate-400"
                        />
                    </div>

                    <p className="text-lg font-semibold text-slate-900">
                        Protected
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        Authenticated session active
                    </p>
                </div>

            </section>

            {/* ================================
                WORKSPACE
            ================================= */}

            <section>

                <div className="mb-5">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Workspace
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Access the tools you need to manage evidence.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <button
                                key={feature.path}
                                onClick={() =>
                                    navigate(feature.path)
                                }
                                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white">
                                        <Icon size={21} />
                                    </div>

                                    <ArrowRight
                                        size={19}
                                        className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700"
                                    />

                                </div>

                                <h3 className="mt-5 text-base font-semibold text-slate-900">
                                    {feature.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {feature.description}
                                </p>

                            </button>
                        );
                    })}

                </div>

            </section>

            {/* ================================
                LOGOUT
            ================================= */}

            <div className="mt-10 flex justify-end border-t border-slate-200 pt-6">

                <button
                    onClick={logout}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                >
                    <LogOut size={17} />
                    Logout
                </button>

            </div>

        </div>
    );
}

export default Dashboard;


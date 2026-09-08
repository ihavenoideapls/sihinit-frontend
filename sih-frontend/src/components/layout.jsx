import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    FolderOpen,
    FileText,
    Search,
    ClipboardList,
    LogOut,
    ShieldCheck,
} from "lucide-react";

function Layout({ children }) {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    const navigation = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Cases",
            path: "/cases",
            icon: FolderOpen,
        },
        {
            name: "Documents",
            path: "/documents",
            icon: FileText,
        },
        {
            name: "Search",
            path: "/search",
            icon: Search,
        },
        {
            name: "Audit Trail",
            path: "/audit",
            icon: ClipboardList,
        },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">

            {/* SIDEBAR */}

            <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white">

                {/* LOGO */}

                <div className="flex h-20 items-center border-b border-slate-200 px-6">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <ShieldCheck size={22} />
                    </div>

                    <div className="ml-3">
                        <h1 className="text-sm font-bold text-slate-900">
                            EvidenceVault
                        </h1>

                        <p className="text-xs text-slate-400">
                            Secure Evidence System
                        </p>
                    </div>

                </div>

                {/* NAVIGATION */}

                <nav className="flex-1 space-y-1 px-3 py-6">

                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Workspace
                    </p>

                    {navigation.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                <Icon
                                    size={18}
                                    strokeWidth={1.8}
                                    className="text-slate-400 transition group-hover:text-slate-700"
                                />

                                {item.name}
                            </button>
                        );
                    })}

                </nav>

                {/* USER */}

                <div className="border-t border-slate-200 p-4">

                    {user && (
                        <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-800">
                                    {user.name}
                                </p>

                                <p className="truncate text-xs capitalize text-slate-400">
                                    {user.role}
                                </p>
                            </div>

                        </div>
                    )}

                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut size={18} />

                        Logout
                    </button>

                </div>

            </aside>

            {/* MAIN */}

            <div className="ml-64 flex min-h-screen flex-1 flex-col">

                {/* TOP BAR */}

                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-8 backdrop-blur">

                    <div>
                        <p className="text-sm font-medium text-slate-500">
                            Secure Evidence Management
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        System Operational
                    </div>

                </header>

                {/* PAGE */}

                <main className="flex-1 p-8">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default Layout;
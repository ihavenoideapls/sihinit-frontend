
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ShieldCheck,
    LockKeyhole,
    Mail,
    ArrowRight,
    AlertCircle,
} from "lucide-react";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.error?.message ||
                "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">

            {/* =================================
                LEFT SIDE
            ================================= */}

            <div className="relative hidden overflow-hidden bg-slate-900 lg:flex lg:w-1/2">

                {/* Decorative background */}

                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-slate-800" />

                <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-slate-800" />

                <div className="relative z-10 flex w-full flex-col justify-between p-12">

                    {/* LOGO */}

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-900">
                            <ShieldCheck size={24} />
                        </div>

                        <div>
                            <p className="font-bold text-white">
                                EvidenceVault
                            </p>

                            <p className="text-xs text-slate-400">
                                Secure Evidence Management
                            </p>
                        </div>

                    </div>

                    {/* HERO */}

                    <div className="max-w-lg">

                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs font-medium text-slate-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Secure System
                        </div>

                        <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">
                            Digital evidence,
                            <br />
                            handled securely.
                        </h1>

                        <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                            Manage investigation cases, preserve digital
                            evidence, track document versions and maintain
                            a complete audit trail from one secure workspace.
                        </p>

                    </div>

                    {/* FOOTER */}

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <LockKeyhole size={14} />
                        Protected access · Authorized personnel only
                    </div>

                </div>
            </div>

            {/* =================================
                RIGHT SIDE
            ================================= */}

            <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">

                <div className="w-full max-w-md">

                    {/* MOBILE LOGO */}

                    <div className="mb-10 flex items-center gap-3 lg:hidden">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <ShieldCheck size={21} />
                        </div>

                        <div>
                            <p className="font-bold text-slate-900">
                                EvidenceVault
                            </p>

                            <p className="text-xs text-slate-400">
                                Secure Evidence Management
                            </p>
                        </div>

                    </div>

                    {/* LOGIN HEADER */}

                    <div className="mb-8">

                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            Welcome back
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Sign in to access your evidence management
                            workspace.
                        </p>

                    </div>

                    {/* ERROR */}

                    {error && (
                        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                            <AlertCircle
                                size={18}
                                className="mt-0.5 shrink-0"
                            />

                            <p>{error}</p>

                        </div>
                    )}

                    {/* FORM */}

                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >

                        {/* EMAIL */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Email address
                            </label>

                            <div className="relative">

                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                    autoComplete="email"
                                    className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                                />

                            </div>

                        </div>

                        {/* PASSWORD */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Password
                            </label>

                            <div className="relative">

                                <LockKeyhole
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    autoComplete="current-password"
                                    className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                                />

                            </div>

                        </div>

                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-white" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in

                                    <ArrowRight
                                        size={17}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </>
                            )}

                        </button>

                    </form>

                    {/* SECURITY INFO */}

                    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4">

                        <div className="flex gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                <ShieldCheck size={18} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-800">
                                    Secure access
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Your session is protected using
                                    authenticated access controls.
                                </p>
                            </div>

                        </div>

                    </div>

                    <p className="mt-8 text-center text-xs text-slate-400">
                        EvidenceVault · Secure Evidence Management System
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;


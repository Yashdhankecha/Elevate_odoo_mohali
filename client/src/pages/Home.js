import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Briefcase,
    Users,
    Building2,
    TrendingUp,
    ArrowRight,
    LayoutDashboard,
    FileSpreadsheet,
    ShieldCheck,
    Bell,
    CheckCircle2,
    Sparkles,
    Globe,
    Zap
} from 'lucide-react';

const Home = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">

            {/* HERO SECTION */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl mx-auto">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                        <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                    </div>
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in-up">
                        <Sparkles className="w-3 h-3" />
                        <span>Reimagining Placements</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight animate-fade-in-up animation-delay-100">
                        The Operating System for <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                            Campus Placements
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed animate-fade-in-up animation-delay-200">
                        Streamline your entire placement drive. Connect students, colleges, and top-tier companies on a single, unified platform designed for success.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
                        <Link
                            to="/signup"
                            className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all hover:-translate-y-1 shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all hover:border-slate-300 flex items-center justify-center"
                        >
                            View Demo
                        </Link>
                    </div>

                    {/* Dashboard Preview Mockup */}
                    <div className="mt-20 relative max-w-5xl mx-auto animate-fade-in-up animation-delay-500">
                        <div className="relative rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-xl p-2 shadow-2xl shadow-indigo-500/10">
                            <div className="absolute inset-x-0 -top-20 h-20 bg-gradient-to-b from-transparent to-white/20"></div>
                            <div className="rounded-xl overflow-hidden bg-slate-50 border border-slate-200 aspect-[16/9] relative">
                                {/* Abstract Dashboard UI Representation */}
                                <div className="absolute inset-0 flex">
                                    {/* Sidebar */}
                                    <div className="w-64 border-r border-slate-200 bg-white p-4 hidden md:block">
                                        <div className="h-8 w-8 bg-indigo-600 rounded-lg mb-8"></div>
                                        <div className="space-y-3">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className="h-8 w-full bg-slate-100 rounded-lg"></div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Main Content */}
                                    <div className="flex-1 bg-slate-50 p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="h-8 w-32 bg-white rounded-lg border border-slate-200"></div>
                                            <div className="flex gap-2">
                                                <div className="h-8 w-8 bg-white rounded-lg border border-slate-200"></div>
                                                <div className="h-8 w-8 bg-indigo-600 rounded-lg"></div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-6 mb-6">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-32 bg-white rounded-xl border border-slate-200 p-4">
                                                    <div className="h-10 w-10 bg-indigo-50 rounded-lg mb-2"></div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="h-64 bg-white rounded-xl border border-slate-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOGO CLOUD */}
            <div className="py-10 border-y border-slate-100 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">Trusted by leading institutions</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder Company Logos - Using text for simplicity, replace with SVGs */}
                        <span className="text-xl font-bold font-serif">ACME Corp</span>
                        <span className="text-xl font-bold font-mono">GlobalTech</span>
                        <span className="text-xl font-bold">InfiniteLoop</span>
                        <span className="text-xl font-bold italic">Horizon</span>
                        <span className="text-xl font-bold font-serif">Vertex</span>
                    </div>
                </div>
            </div>

            {/* BENTO GRID FEATURES */}
            <div className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                            Everything you need to <br />
                            <span className="text-indigo-600">manage placements</span>
                        </h2>
                        <p className="text-lg text-slate-600">
                            A powerful suite of tools built to handle every aspect of the recruitment lifecycle, from application to offer letter.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Feature 1 - Large */}
                        <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-8 lg:p-10 hover:border-indigo-200 transition-colors group relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                    <LayoutDashboard className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Centralized Command Center</h3>
                                <p className="text-slate-600 max-w-md">Track every application, interview schedule, and offer status from a single, intuitive dashboard. No more spreadsheets.</p>
                            </div>
                            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-900 text-white rounded-3xl p-8 lg:p-10 flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                                    <Zap className="w-6 h-6 text-yellow-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Instant Updates</h3>
                                <p className="text-slate-300">Real-time notifications for students and TPOs. Never miss an opportunity.</p>
                            </div>
                            <div className="mt-8 flex items-center gap-2 text-sm font-medium text-slate-400 group-hover:text-white transition-colors">
                                Learn more <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 lg:p-10 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                                <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Automated Resume Parsing</h3>
                            <p className="text-slate-600">AI-driven resume analysis to match the right candidates with the right roles instantly.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 lg:p-10 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6">
                                <ShieldCheck className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Profiles</h3>
                            <p className="text-slate-600">Ensuring authenticity with verified student and company profiles for a secure network.</p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-3xl p-8 lg:p-10 hover:shadow-xl hover:shadow-indigo-500/20 transition-all group">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Campus Wide Network</h3>
                            <p className="text-indigo-100">Connect seamlessly across departments and campuses for unified placement drives.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* METRICS / STATS */}
            <div className="py-24 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                        {[
                            { label: 'Active Students', value: '10k+', icon: Users },
                            { label: 'Partner Companies', value: '500+', icon: Building2 },
                            { label: 'Successful Hires', value: '85%', icon: CheckCircle2 },
                            { label: 'Avg Package (LPA)', value: '12', icon: TrendingUp },
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="flex justify-center mb-4 text-indigo-600">
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <div className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2 tracking-tight">{stat.value}</div>
                                <div className="text-slate-500 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA SECTION */}
            <div className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Ready to transform specific <br />
                        <span className="text-indigo-600">campus placements?</span>
                    </h2>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                        Join the platform that is redefining how colleges and companies connect. Start your journey with Elevate today.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/signup" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all hover:-translate-y-1 shadow-lg shadow-indigo-200">
                            Get Started Now
                        </Link>
                        <Link to="/contact" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors">
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="bg-slate-900 text-slate-400 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-slate-800 pb-12">
                        <div className="md:col-span-5">
                            <Link to="/" className="inline-flex items-center gap-2 mb-6 text-white text-xl font-bold">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">🚀</div>
                                Elevate
                            </Link>
                            <p className="text-slate-400 leading-relaxed max-w-md">
                                The complete placement solution for modern educational institutions. Bridging the gap between talent and opportunity.
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <h4 className="text-white font-bold mb-4">Product</h4>
                            <ul className="space-y-3">
                                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Features</Link></li>
                                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Solutions</Link></li>
                                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
                            </ul>
                        </div>
                        <div className="md:col-span-2">
                            <h4 className="text-white font-bold mb-4">Company</h4>
                            <ul className="space-y-3">
                                <li><Link to="#" className="hover:text-indigo-400 transition-colors">About</Link></li>
                                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Blog</Link></li>
                                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Careers</Link></li>
                            </ul>
                        </div>
                        <div className="md:col-span-3">
                            <h4 className="text-white font-bold mb-4">Legal</h4>
                            <ul className="space-y-3">
                                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p>&copy; {new Date().getFullYear()} Elevate Inc. All rights reserved.</p>
                        <div className="flex gap-6">
                            {/* Social Icons Placeholder */}
                            <div className="w-6 h-6 bg-slate-800 rounded hover:bg-indigo-600 transition-colors cursor-pointer"></div>
                            <div className="w-6 h-6 bg-slate-800 rounded hover:bg-indigo-600 transition-colors cursor-pointer"></div>
                            <div className="w-6 h-6 bg-slate-800 rounded hover:bg-indigo-600 transition-colors cursor-pointer"></div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Rocket,
    Users,
    Building,
    TrendingUp,
    Award,
    ArrowRight,
    Monitor,
    UserCheck,
    FileText
} from 'lucide-react';

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 overscroll-none overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 z-0"></div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-100 opacity-50 blur-3xl"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6 tracking-wide uppercase">
                                Next Gen Placement Tracking
                            </span>
                            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-8">
                                Elevate Your Career <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    To New Heights
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Connect with top companies, track your applications, and streamline your placement journey with CGC Mohali's premier placement portal.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center">
                                    Get Started Now
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                                <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-slate-800 font-bold border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center">
                                    Login
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image/Mockup Placeholder */}
                        <div className={`mt-20 relative mx-auto max-w-5xl transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-[16/9] group">
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 z-0"></div>
                                {/* Decorative UI Elements simulating dashboard */}
                                <div className="relative z-10 p-4 md:p-8 h-full flex flex-col">
                                    <div className="flex items-center space-x-2 mb-6">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="flex-1 grid grid-cols-12 gap-6">
                                        {/* Sidebar */}
                                        <div className="hidden md:block col-span-2 bg-slate-800/50 rounded-lg h-full animate-pulse"></div>
                                        {/* Main Content */}
                                        <div className="col-span-12 md:col-span-10 flex flex-col space-y-6">
                                            <div className="h-32 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-white/10 p-6 flex items-center justify-between">
                                                <div className="space-y-2">
                                                    <div className="h-4 w-32 bg-white/20 rounded"></div>
                                                    <div className="h-8 w-48 bg-white/30 rounded"></div>
                                                </div>
                                                <div className="h-12 w-12 rounded-full bg-blue-500/30"></div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-6">
                                                <div className="h-40 bg-white/5 rounded-xl border border-white/10"></div>
                                                <div className="h-40 bg-white/5 rounded-xl border border-white/10"></div>
                                                <div className="h-40 bg-white/5 rounded-xl border border-white/10"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Overlay on Hover */}
                                <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors duration-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white py-12 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: 'Total Placements', value: '2.5k+', icon: <Users className="w-6 h-6 text-blue-600" /> },
                            { label: 'Average Package', value: '8 LPA', icon: <TrendingUp className="w-6 h-6 text-green-600" /> },
                            { label: 'Partner Companies', value: '500+', icon: <Building className="w-6 h-6 text-indigo-600" /> },
                            { label: 'Success Rate', value: '94%', icon: <Award className="w-6 h-6 text-yellow-600" /> },
                        ].map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300">
                                <div className="mb-3 p-3 bg-white rounded-full shadow-sm">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Why Choose Elevate?</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to succeed
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                            Our platform offers comprehensive tools designed to streamline the entire recruitment lifecycle.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                title: 'Live Tracking',
                                desc: 'Real-time updates on your application status, interview schedules, and results.',
                                icon: <Monitor className="w-8 h-8 text-white" />,
                                color: 'bg-blue-500'
                            },
                            {
                                title: 'Resume Builder',
                                desc: 'Create professional, ATS-friendly resumes with our built-in dynamic resume builder tool.',
                                icon: <FileText className="w-8 h-8 text-white" />,
                                color: 'bg-indigo-500'
                            },
                            {
                                title: 'Company Insights',
                                desc: 'Detailed profiles of visiting companies, including updated eligibility criteria and hiring trends.',
                                icon: <Building className="w-8 h-8 text-white" />,
                                color: 'bg-purple-500'
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                                <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed mb-4">{feature.desc}</p>
                                <Link to="/signup" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                                    Learn more <ArrowRight className="ml-1 w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Types Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
                                Tailored for every stakeholder
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Whether you're a student aspiring for a dream job, a company looking for top talent, or a TPO managing the process, Elevate has you covered.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { title: 'For Students', desc: 'One-click apply, personalized dashboard, and skill assessment tools.' },
                                    { title: 'For Recruiters', desc: 'Efficient candidate filtering, interview scheduling, and offer management.' },
                                    { title: 'For TPOs', desc: 'Comprehensive analytics, batch management, and automated notifications.' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                                                <UserCheck className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg leading-6 font-medium text-gray-900">{item.title}</h4>
                                            <p className="mt-2 text-base text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-50 rounded-3xl transform rotate-3"></div>
                            <div className="relative bg-white border border-gray-100 rounded-3xl shadow-xl p-8">
                                <div className="bg-slate-50 rounded-xl p-6 mb-6 border border-slate-100">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">JD</div>
                                        <div>
                                            <div className="font-bold text-slate-800">John Doe</div>
                                            <div className="text-sm text-slate-500">Student • Batch 2024</div>
                                        </div>
                                        <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">Placed</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-200 rounded mb-2">
                                        <div className="h-2 bg-blue-500 w-3/4 rounded"></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Profile Completion</span>
                                        <span>75%</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-bold text-slate-700">Recent Applications</span>
                                        <span className="text-blue-600 text-sm font-semibold">View All</span>
                                    </div>
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                                                <div className="h-8 w-8 bg-gray-100 rounded mr-3"></div>
                                                <div className="flex-1">
                                                    <div className="h-3 w-24 bg-gray-200 rounded mb-1"></div>
                                                    <div className="h-2 w-16 bg-gray-100 rounded"></div>
                                                </div>
                                                <div className="h-6 w-16 bg-blue-50 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-700">
                <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="block">Ready to dive in?</span>
                        <span className="block text-blue-200">Start your journey today.</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-blue-100">
                        Join thousands of students and top companies on the most advanced placement platform in the region.
                    </p>
                    <Link
                        to="/signup"
                        className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto transition-colors"
                    >
                        Sign up for free
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <Rocket className="h-6 w-6 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">Elevate</span>
                        </div>
                        <div className="flex space-x-6 text-gray-500 hover:text-gray-900 cursor-pointer">
                            <span>About</span>
                            <span>Features</span>
                            <span>Contact</span>
                            <span>Privacy</span>
                            <span>Terms</span>
                        </div>
                        <div className="mt-4 md:mt-0 text-gray-400 text-sm">
                            &copy; 2024 Elevate, CGC Mohali. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;

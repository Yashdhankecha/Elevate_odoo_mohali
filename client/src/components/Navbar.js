import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaGraduationCap, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50 group-hover:shadow-blue-300/50 transition-all duration-300 transform group-hover:rotate-3">
                            <FaGraduationCap className="text-white text-lg" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                            Elevate
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                            Home
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                                >
                                    <FaSignOutAlt size={14} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all duration-300"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100 space-y-2 animate-fade-in">
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl">
                            Home
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl">
                                    Dashboard
                                </Link>
                                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl">
                                    Login
                                </Link>
                                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-center">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

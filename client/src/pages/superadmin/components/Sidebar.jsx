import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  ShieldCheck, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Database,
  Lock,
  History,
  Activity,
  UserPlus,
  Layers,
  ShieldAlert,
  Terminal,
  X
} from 'lucide-react';

const Sidebar = ({ 
  activeSection, 
  setActiveSection, 
  isCollapsed, 
  setSidebarCollapsed,
  isMobileOpen,
  setIsMobileOpen 
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'management', label: 'Manage All Users', icon: Users },
    { id: 'tpo-approval', label: 'TPO Approvals', icon: ShieldCheck },
    { id: 'company-approval', label: 'Company Approvals', icon: Building2 },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      {/* Brand Header */}
      <div className={`p-8 border-b border-slate-50 flex items-center justify-between ${isCollapsed ? 'px-6' : ''}`}>
        <div className="flex items-center gap-4 transition-all duration-300">
          <div className="w-12 h-12 bg-blue-600 rounded-[1.2rem] flex items-center justify-center shadow-2xl shadow-blue-200 border-b-2 border-blue-700">
            <ShieldCheck className="text-white w-6 h-6" strokeWidth={2.5} />
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none text-blue-600">ELEVATE</h1>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1">Super Admin</p>
            </div>
          )}
        </div>
        
        {isMobileOpen && (
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-900">
            <X size={20} />
          </button>
        )}

        {!isMobileOpen && (
          <button
            onClick={() => setSidebarCollapsed(!isCollapsed)}
            className={`absolute -right-3 top-10 w-8 h-8 hidden lg:flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-lg active:scale-90 ${isCollapsed ? 'hidden' : ''}`}
          >
            <ChevronLeft size={16} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                if (isMobileOpen) setIsMobileOpen(false);
              }}
              className={`
                w-full flex items-center gap-4 px-4 py-4 rounded-[1.2rem] font-bold text-[13px] transition-all duration-500 group relative
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }
                ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}
              `}
              title={isCollapsed && !isMobileOpen ? item.label : ''}
            >
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500
                ${isActive ? 'bg-white/10 scale-110' : 'bg-slate-50 group-hover:bg-white group-hover:shadow-lg'}
              `}>
                <Icon size={18} strokeWidth={isActive ? 3 : 2} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'} />
              </div>
              {(!isCollapsed || isMobileOpen) && <span className="flex-1 text-left truncate">{item.label}</span>}
              {isActive && (!isCollapsed || isMobileOpen) && (
                 <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>


      {/* Logout Button */}
      <div className={`p-6 border-t border-slate-50 ${isCollapsed && !isMobileOpen ? 'px-6' : ''}`}>
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center gap-4 px-4 py-4 rounded-[1.2rem] font-bold text-[13px] text-rose-500 hover:bg-rose-50 transition-all active:scale-95 group ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
             <LogOut size={16} strokeWidth={3} />
          </div>
          {(!isCollapsed || isMobileOpen) && <span className="flex-1 text-left">Log out</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-white border-r border-slate-100 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.03)] z-[70] transition-all duration-500 ease-in-out
        ${isCollapsed ? 'w-24' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0 w-80' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;

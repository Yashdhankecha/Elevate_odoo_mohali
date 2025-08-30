import React from 'react';
import { 
  Users, 
  Building2, 
  BookOpen, 
  Settings, 
  BarChart3,
  Shield,
  Database,
  Globe,
  Plus,
  Activity,
  Server,
  TrendingUp
} from 'lucide-react';

const SuperadminDashboard = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-full py-8 px-2 md:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <SystemOverviewCard />
        <UserManagementCard />
        <InstitutionManagementCard />
        <SystemSettingsCard />
        <SecurityCard />
      </div>
    </div>
  );
};

// System Overview Card
const SystemOverviewCard = () => {
  const stats = [
    { label: 'Total Users', value: '12,847', change: '+8%', icon: Users, color: 'bg-blue-500' },
    { label: 'Active Institutions', value: '156', change: '+12%', icon: BookOpen, color: 'bg-green-500' },
    { label: 'System Health', value: '99.8%', change: '+0.2%', icon: Activity, color: 'bg-purple-500' },
    { label: 'Data Storage', value: '2.4TB', change: '+15%', icon: Database, color: 'bg-orange-500' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-500" /> System Overview
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="border rounded-xl p-4 flex flex-col hover:shadow-lg transition bg-gradient-to-br from-gray-50 to-white">
              <div className="flex items-center justify-between mb-2">
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-green-600 text-xs font-medium">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// User Management Card
const UserManagementCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Users className="w-6 h-6 text-green-500" /> User Management
      </h2>
      <button className="bg-gradient-to-r from-green-600 to-green-400 text-white px-4 py-2 rounded-lg shadow hover:from-green-700 hover:to-green-500 transition text-sm font-medium flex items-center gap-2">
        <Plus className="w-4 h-4" /> Add User
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { role: 'Students', count: '8,945', percentage: '69%', color: 'bg-blue-500' },
        { role: 'TPOs', count: '156', percentage: '12%', color: 'bg-green-500' },
        { role: 'Companies', count: '289', percentage: '14%', color: 'bg-purple-500' },
        { role: 'Admins', count: '12', percentage: '5%', color: 'bg-orange-500' }
      ].map((userType, i) => (
        <div key={i} className="border rounded-xl p-4 hover:shadow-lg transition bg-gradient-to-br from-gray-50 to-white">
          <div className="flex items-center justify-between mb-2">
            <div className={`${userType.color} p-2 rounded-lg`}>
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-gray-500">{userType.percentage}</span>
          </div>
          <div className="text-xl font-bold">{userType.count}</div>
          <div className="text-sm text-gray-600">{userType.role}</div>
        </div>
      ))}
    </div>
  </div>
);

// Institution Management Card
const InstitutionManagementCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-purple-500" /> Institution Management
      </h2>
      <button className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-4 py-2 rounded-lg shadow hover:from-purple-700 hover:to-purple-500 transition text-sm font-medium flex items-center gap-2">
        <Plus className="w-4 h-4" /> Add Institution
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { name: 'IIT Delhi', type: 'Engineering', students: 3456, status: 'Active', subscription: 'Premium' },
        { name: 'NIT Bangalore', type: 'Engineering', students: 2845, status: 'Active', subscription: 'Standard' },
        { name: 'BITS Pilani', type: 'Engineering', students: 2234, status: 'Active', subscription: 'Premium' }
      ].map((institution, i) => (
        <div key={i} className="border rounded-xl p-4 hover:shadow-lg transition bg-gradient-to-br from-gray-50 to-white">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-sm">{institution.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs ${
              institution.subscription === 'Premium' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {institution.subscription}
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-1">{institution.type}</div>
          <div className="text-xs text-gray-500 mb-3">{institution.students} students</div>
          <div className="flex gap-2">
            <button className="flex-1 text-xs bg-blue-50 text-blue-600 py-1 rounded hover:bg-blue-100">
              Manage
            </button>
            <button className="flex-1 text-xs bg-gray-50 text-gray-600 py-1 rounded hover:bg-gray-100">
              Settings
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// System Settings Card
const SystemSettingsCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Settings className="w-6 h-6 text-indigo-500" /> System Settings
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { 
          category: 'Security', 
          items: ['Two-Factor Auth', 'Session Management', 'API Limits', 'Encryption'],
          icon: Shield
        },
        { 
          category: 'Configuration', 
          items: ['Database', 'Email Config', 'File Storage', 'Backups'],
          icon: Server
        },
        { 
          category: 'Global', 
          items: ['Time Zone', 'Language', 'Date Format', 'Currency'],
          icon: Globe
        }
      ].map((section, i) => {
        const Icon = section.icon;
        return (
          <div key={i} className="border rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white">
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold text-sm">{section.category}</h3>
            </div>
            <div className="space-y-2">
              {section.items.map((item, j) => (
                <div key={j} className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">{item}</span>
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// Security Card
const SecurityCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Shield className="w-6 h-6 text-red-500" /> Security & Monitoring
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {[
        { title: 'System Logs', count: '2,847', description: 'Recent entries', status: 'Normal' },
        { title: 'Security Alerts', count: '3', description: 'Active warnings', status: 'Warning' },
        { title: 'Last Backup', count: '2h ago', description: 'Successful backup', status: 'Success' }
      ].map((item, i) => (
        <div key={i} className="border rounded-xl p-4 hover:shadow-lg transition bg-gradient-to-br from-gray-50 to-white">
          <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
          <div className="text-xl font-bold mb-1">{item.count}</div>
          <p className="text-xs text-gray-600 mb-3">{item.description}</p>
          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
            item.status === 'Success' ? 'bg-green-100 text-green-700' :
            item.status === 'Warning' ? 'bg-yellow-100 text-yellow-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {item.status}
          </span>
        </div>
      ))}
    </div>

    <div className="border rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white">
      <h3 className="font-semibold mb-3">Recent Security Events</h3>
      <div className="space-y-2">
        {[
          { event: 'Failed login attempt', info: 'IP: 192.168.1.100', time: '5 min ago', severity: 'Medium' },
          { event: 'Admin access granted', info: 'User: system_admin', time: '1 hour ago', severity: 'High' },
          { event: 'Database backup completed', info: 'Size: 2.4GB', time: '2 hours ago', severity: 'Low' }
        ].map((event, i) => (
          <div key={i} className="flex justify-between items-center p-2 bg-white rounded border">
            <div>
              <div className="font-medium text-sm">{event.event}</div>
              <div className="text-xs text-gray-500">{event.info}</div>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 rounded-full text-xs ${
                event.severity === 'High' ? 'bg-red-100 text-red-700' :
                event.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {event.severity}
              </span>
              <div className="text-xs text-gray-400 mt-1">{event.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SuperadminDashboard;

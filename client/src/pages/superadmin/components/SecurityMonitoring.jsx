import React, { useState } from 'react';
import { 
  FaShieldAlt, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaClock,
  FaEye,
  FaDownload,
  FaFilter,
  FaSearch,
  FaServer,
  FaDatabase,
  FaNetworkWired,
  FaUserShield,
  FaLock,
  FaUnlock,
  FaTimes
} from 'react-icons/fa';

const SecurityMonitoring = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const securityEvents = [
    {
      id: 1,
      event: 'Failed login attempt',
      description: 'Multiple failed login attempts detected from IP 192.168.1.100',
      severity: 'medium',
      type: 'authentication',
      timestamp: '2024-12-15 14:30:25',
      ip: '192.168.1.100',
      user: 'unknown',
      status: 'resolved'
    },
    {
      id: 2,
      event: 'Admin access granted',
      description: 'Super admin access granted to user john.smith@iitdelhi.ac.in',
      severity: 'high',
      type: 'authorization',
      timestamp: '2024-12-15 13:45:12',
      ip: '192.168.1.50',
      user: 'john.smith@iitdelhi.ac.in',
      status: 'active'
    },
    {
      id: 3,
      event: 'Database backup completed',
      description: 'Automated database backup completed successfully',
      severity: 'low',
      type: 'system',
      timestamp: '2024-12-15 12:00:00',
      ip: 'system',
      user: 'system',
      status: 'completed'
    },
    {
      id: 4,
      event: 'Suspicious activity detected',
      description: 'Unusual data access pattern detected from company account',
      severity: 'high',
      type: 'monitoring',
      timestamp: '2024-12-15 11:20:33',
      ip: '203.45.67.89',
      user: 'techcorp_hr',
      status: 'investigating'
    },
    {
      id: 5,
      event: 'SSL certificate renewed',
      description: 'SSL certificate automatically renewed for elevate.com',
      severity: 'low',
      type: 'system',
      timestamp: '2024-12-15 10:15:45',
      ip: 'system',
      user: 'system',
      status: 'completed'
    }
  ];

  const systemMetrics = [
    {
      title: 'System Health',
      value: '99.8%',
      status: 'excellent',
      icon: FaServer,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Active Sessions',
      value: '1,247',
      status: 'normal',
      icon: FaNetworkWired,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Database Performance',
      value: '98.5%',
      status: 'good',
      icon: FaDatabase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Security Score',
      value: '95/100',
      status: 'excellent',
      icon: FaShieldAlt,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  const severities = ['All', 'Low', 'Medium', 'High', 'Critical'];
  const types = ['All', 'Authentication', 'Authorization', 'System', 'Monitoring'];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'authentication': return <FaLock className="w-4 h-4" />;
      case 'authorization': return <FaUserShield className="w-4 h-4" />;
      case 'system': return <FaServer className="w-4 h-4" />;
      case 'monitoring': return <FaEye className="w-4 h-4" />;
      default: return <FaShieldAlt className="w-4 h-4" />;
    }
  };

  const filteredEvents = securityEvents.filter(event => {
    const matchesSearch = event.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'All' || event.severity === filterSeverity.toLowerCase();
    const matchesType = filterType === 'All' || event.type === filterType.toLowerCase();
    
    return matchesSearch && matchesSeverity && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaShieldAlt className="text-red-600" />
            Security Monitoring
          </h2>
          <p className="text-gray-600">Monitor system security, logs, and security events</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <FaDownload className="w-4 h-4" />
            Export Logs
          </button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${metric.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <span className="text-sm font-medium text-green-600">{metric.status}</span>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.title}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search security events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {severities.map(severity => (
                <option key={severity} value={severity}>{severity}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <FaFilter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Security Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Security Events</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User/IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{event.event}</div>
                      <div className="text-sm text-gray-500">{event.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(event.type)}
                      <span className="text-sm text-gray-900 capitalize">{event.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
                      {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{event.user}</div>
                      <div className="text-sm text-gray-500">{event.ip}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaExclamationTriangle className="text-orange-600" />
            Active Security Alerts
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div>
                <div className="font-medium text-orange-800">Suspicious Activity Detected</div>
                <div className="text-sm text-orange-600">Unusual data access pattern from company account</div>
              </div>
              <span className="text-xs text-orange-600">2 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div>
                <div className="font-medium text-yellow-800">Multiple Failed Logins</div>
                <div className="text-sm text-yellow-600">5 failed attempts from IP 192.168.1.100</div>
              </div>
              <span className="text-xs text-yellow-600">15 min ago</span>
            </div>
          </div>
        </div>

        {/* Security Recommendations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-green-600" />
            Security Recommendations
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <FaCheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-800">SSL Certificate Updated</div>
                <div className="text-sm text-green-600">SSL certificate renewed successfully</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <FaShieldAlt className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-800">Database Backup Completed</div>
                <div className="text-sm text-blue-600">Latest backup completed successfully</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <FaUserShield className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <div className="font-medium text-purple-800">Admin Access Granted</div>
                <div className="text-sm text-purple-600">New admin access granted to verified user</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitoring;

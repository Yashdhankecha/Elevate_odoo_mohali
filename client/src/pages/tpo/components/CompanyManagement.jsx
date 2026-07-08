import React, { useState, useEffect } from 'react';
import {
  Building2, Search, Globe, Mail, Phone, MapPin, Briefcase,
  ChevronDown, ChevronUp, Star, Award, Calendar, ExternalLink,
  RefreshCw, Users, TrendingUp, CheckCircle2, Clock
} from 'lucide-react';
import tpoApi from '../../../services/tpoApi';

const CompanyManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchPartnerCompanies();
  }, []);

  const fetchPartnerCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tpoApi.getPartnerCompanies();
      setCompanies(data?.companies || []);
    } catch (err) {
      console.error('Error fetching partner companies:', err);
      setError(err?.message || 'Failed to load partner companies');
    } finally {
      setLoading(false);
    }
  };

  const filtered = companies.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      (c.companyName || '').toLowerCase().includes(q) ||
      (c.industry || '').toLowerCase().includes(q)
    );
  });

  const getIndustryColor = (industry = '') => {
    const map = {
      'IT/Software': 'bg-blue-100 text-blue-700',
      'Finance': 'bg-emerald-100 text-emerald-700',
      'Manufacturing': 'bg-orange-100 text-orange-700',
      'Consulting': 'bg-purple-100 text-purple-700',
      'E-commerce': 'bg-pink-100 text-pink-700',
      'Healthcare': 'bg-red-100 text-red-700',
      'Education': 'bg-yellow-100 text-yellow-700',
    };
    for (const k of Object.keys(map)) {
      if (industry.toLowerCase().includes(k.toLowerCase())) return map[k];
    }
    return 'bg-gray-100 text-gray-700';
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-xl w-64" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="text-indigo-600" size={26} />
            Company Partners
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Companies that have conducted approved on-campus drives at your college
          </p>
        </div>
        <button
          onClick={fetchPartnerCompanies}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-semibold shadow-sm"
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Total Partners</p>
          <p className="text-3xl font-bold text-indigo-700 mt-1">{companies.length}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Total Drives</p>
          <p className="text-3xl font-bold text-emerald-700 mt-1">
            {companies.reduce((s, c) => s + (c.totalDrives || 0), 0)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-2xl p-4 col-span-2 sm:col-span-1">
          <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider">Industries</p>
          <p className="text-3xl font-bold text-purple-700 mt-1">
            {new Set(companies.map(c => c.industry).filter(Boolean)).size}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
        <input
          type="text"
          placeholder="Search by company name or industry..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex items-center gap-2">
          <span className="font-semibold">Error:</span> {error}
          <button onClick={fetchPartnerCompanies} className="ml-auto underline text-red-600 hover:text-red-800">Retry</button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="text-indigo-400" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {searchQuery ? 'No matching partners found' : 'No company partners yet'}
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
            {searchQuery
              ? 'Try a different search term.'
              : 'Companies will appear here once they submit an on-campus drive request and you approve it from the Drive Requests section.'}
          </p>
          {!searchQuery && (
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-indigo-600 font-medium bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 w-fit mx-auto">
              <CheckCircle2 size={14} />
              Approve a drive request → Company becomes a partner automatically
            </div>
          )}
        </div>
      )}

      {/* Company cards */}
      <div className="space-y-3">
        {filtered.map(company => {
          const isExpanded = expandedId === company._id;
          return (
            <div
              key={company._id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Card header */}
              <div className="p-5 flex items-start gap-4">
                {/* Logo / avatar */}
                <div className="flex-shrink-0">
                  {company.profilePicture ? (
                    <img
                      src={company.profilePicture}
                      alt={company.companyName}
                      className="w-14 h-14 rounded-xl object-contain border border-gray-100 bg-gray-50"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow">
                      {(company.companyName || 'C')[0].toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{company.companyName}</h3>
                      {company.industry && (
                        <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 ${getIndustryColor(company.industry)}`}>
                          {company.industry}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                        <Star size={12} fill="currentColor" />
                        {company.totalDrives} drive{company.totalDrives !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
                    {company.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={11} /> {company.email}
                      </span>
                    )}
                    {company.contactNumber && (
                      <span className="flex items-center gap-1">
                        <Phone size={11} /> {company.contactNumber}
                      </span>
                    )}
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-indigo-500 hover:underline"
                      >
                        <Globe size={11} /> Website <ExternalLink size={10} />
                      </a>
                    )}
                    {company.address?.city && (
                      <span className="flex items-center gap-1">
                        <MapPin size={11} /> {company.address.city}{company.address.state ? `, ${company.address.state}` : ''}
                      </span>
                    )}
                    {company.lastDriveDate && (
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> Last drive: {formatDate(company.lastDriveDate)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expand toggle */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : company._id)}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  title={isExpanded ? 'Collapse' : 'View drives'}
                >
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              {/* Expanded: drives history */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 space-y-3">
                  {company.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">{company.description}</p>
                  )}
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase size={13} /> Drive History
                  </h4>
                  {(company.drives || []).length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No drive history available.</p>
                  ) : (
                    <div className="space-y-2">
                      {company.drives.map((drive, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-2.5"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{drive.jobTitle || 'Drive'}</p>
                            {drive.jobId && (
                              <p className="text-xs text-gray-400">{drive.jobId}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              drive.status === 'active' ? 'bg-green-100 text-green-700' :
                              drive.status === 'closed' ? 'bg-gray-100 text-gray-500' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {drive.status}
                            </span>
                            {drive.driveDate && (
                              <p className="text-xs text-gray-400 mt-0.5">{formatDate(drive.driveDate)}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyManagement;

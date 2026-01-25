import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Server,
  AlertCircle,
  CheckCircle2,
  Clock,
  Globe,
  Search,
  MoreHorizontal,
  Bell,
  BellRing,
  Settings,
  LogOut,
  User as UserIcon,
  ShieldAlert,
  LayoutDashboard,
  Menu,
  Filter,
  Tag,
  XCircle,
  Eye,
  CheckSquare,
  Archive,
  AlertTriangle
} from 'lucide-react';
import { Service, ServiceStatus, Threshold, MetricType, ComparisonOperator, Alert, PageView, User } from './types';
import { UptimeChart } from './components/UptimeChart';
import { AnimatedBeam, MiniBeam } from './components/AnimatedBeam';
import { ThresholdSettingsModal } from './components/ThresholdSettingsModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthPages } from './components/AuthPages';
import { AnimatePresence, motion, Variants } from 'framer-motion';

// Mock Data Generator
const generateMockHistory = (baseLatency: number, variance: number): { time: string, latency: number }[] => {
  const history = [];
  const now = new Date();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const isSpike = Math.random() > 0.9;
    const latency = isSpike
      ? baseLatency + Math.random() * 200
      : baseLatency + (Math.random() - 0.5) * variance;

    history.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latency: Math.max(10, Math.floor(latency))
    });
  }
  return history;
};

// --- Animation Variants ---
const pageVariants: Variants = {
  initial: { opacity: 0, y: 15, filter: 'blur(5px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    y: -15,
    filter: 'blur(5px)',
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

// Generic item entry
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

// Consolidated Card Variants (Entry + Interaction)
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    boxShadow: "0 1px 2px 0 rgba(74, 64, 58, 0.05)"
  },
  show: {
    opacity: 1,
    y: 0,
    boxShadow: "0 1px 2px 0 rgba(74, 64, 58, 0.05)",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  },
  hover: {
    y: -5,
    boxShadow: "0 20px 25px -5px rgba(74, 64, 58, 0.1), 0 8px 10px -6px rgba(74, 64, 58, 0.1)",
    borderColor: "#d5bdaf", // almond-silk
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    scale: 0.98,
    boxShadow: "0 4px 6px -1px rgba(74, 64, 58, 0.1)",
    transition: { duration: 0.1 }
  }
};

// Initial services
const initialServices: Service[] = [
  {
    id: '1',
    name: 'Authentication API',
    url: 'api.auth.sentinel.dev',
    status: ServiceStatus.OPERATIONAL,
    uptimePercentage: 99.99,
    history: generateMockHistory(45, 15),
    lastChecked: 'Just now',
    region: 'us-east-1',
    tags: ['core', 'security', 'api'],
    thresholds: [
      { id: 't1', metric: MetricType.LATENCY, operator: ComparisonOperator.GREATER_THAN, value: 200, durationMinutes: 5, enabled: true },
      { id: 't2', metric: MetricType.UPTIME, operator: ComparisonOperator.LESS_THAN, value: 99.9, durationMinutes: 10, enabled: true }
    ]
  },
  {
    id: '2',
    name: 'Payment Gateway',
    url: 'pay.sentinel.dev',
    status: ServiceStatus.DEGRADED,
    uptimePercentage: 98.45,
    history: generateMockHistory(120, 50),
    lastChecked: '2 mins ago',
    region: 'us-west-2',
    tags: ['finance', 'external', 'critical'],
    thresholds: []
  },
  {
    id: '3',
    name: 'Image Processing Worker',
    url: 'worker.img.sentinel.dev',
    status: ServiceStatus.DOWN,
    uptimePercentage: 0.00,
    history: generateMockHistory(400, 100).map(p => ({ ...p, latency: 0 })),
    lastChecked: '5 mins ago',
    region: 'eu-central-1',
    tags: ['worker', 'media', 'background'],
    thresholds: [
      { id: 't3', metric: MetricType.ERROR_RATE, operator: ComparisonOperator.GREATER_THAN, value: 5, durationMinutes: 1, enabled: true }
    ]
  },
  {
    id: '4',
    name: 'Frontend CDN',
    url: 'cdn.sentinel.dev',
    status: ServiceStatus.OPERATIONAL,
    uptimePercentage: 100.00,
    history: generateMockHistory(25, 5),
    lastChecked: 'Just now',
    region: 'global',
    tags: ['frontend', 'static', 'cdn'],
    thresholds: []
  }
];

interface ServiceCardProps {
  service: Service;
  onThresholdSettings: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onThresholdSettings }) => (
  <motion.div
    variants={cardVariants}
    whileHover="hover"
    whileTap="tap"
    className="bg-linen border border-dust-grey rounded-xl p-5 group relative cursor-default"
  >
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
      <div className="flex items-start gap-4">
        <div className={`mt-1 w-3 h-3 rounded-full shrink-0 transition-shadow duration-500 ${service.status === ServiceStatus.OPERATIONAL ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' :
          service.status === ServiceStatus.DEGRADED ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]' :
            'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
          }`} />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{service.name}</h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${service.status === ServiceStatus.OPERATIONAL ? 'bg-green-100 text-green-700 border-green-200' :
              service.status === ServiceStatus.DEGRADED ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                'bg-red-100 text-red-700 border-red-200'
              }`}>
              {service.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <a href={`https://${service.url}`} target="_blank" rel="noopener noreferrer" className="text-xs text-foreground-muted hover:text-almond-silk flex items-center gap-1">
              {service.url} <Globe className="w-3 h-3" />
            </a>
            <span className="text-dust-grey">•</span>
            <span className="text-xs text-foreground-muted">{service.region}</span>
            {service.tags && service.tags.length > 0 && (
              <>
                <span className="text-dust-grey">•</span>
                <div className="flex items-center gap-1">
                  {service.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-parchment border border-dust-grey/50 px-1.5 rounded-sm text-foreground-muted">#{tag}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mini Stats & Action */}
      <div className="flex items-center gap-6 md:justify-end">
        <div className="text-right hidden sm:block">
          <div className="text-xs text-foreground-muted">Uptime (24h)</div>
          <div className="font-mono font-medium text-foreground">{service.uptimePercentage}%</div>
        </div>

        <div className="text-right hidden sm:block">
          <div className="text-xs text-foreground-muted">Response</div>
          <div className="font-mono font-medium text-foreground">
            {service.history[0].latency}ms
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: '#edede9' }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onThresholdSettings(service); }}
            className="p-1.5 bg-white border border-dust-grey rounded-lg text-foreground-muted transition-colors relative"
            title="Configure Alerts"
          >
            <Settings className="w-4 h-4" />
            {service.thresholds.some(t => t.enabled) && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-blue-400 rounded-full border border-white transform translate-x-1/4 -translate-y-1/4" />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: '#edede9' }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg text-foreground-muted"
          >
            <MoreHorizontal className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>

    {/* Chart Area */}
    <div className="mt-6 pt-4 border-t border-dust-grey/30 relative z-10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <Clock className="w-3 h-3" /> Response Time History
        </div>
        {service.thresholds.some(t => t.metric === MetricType.LATENCY && t.enabled) && (
          <div className="text-[10px] text-orange-600/70 font-medium">
            Threshold: &gt; {service.thresholds.find(t => t.metric === MetricType.LATENCY && t.enabled)?.value}ms
          </div>
        )}
      </div>
      <UptimeChart
        data={service.history}
        color={service.status === ServiceStatus.DOWN ? '#ef4444' : service.status === ServiceStatus.DEGRADED ? '#eab308' : '#84cc16'}
      />
    </div>
  </motion.div>
);

const App = () => {
  // Navigation & Auth State
  const [currentPage, setCurrentPage] = useState<PageView>('signin');
  const [user, setUser] = useState<User | null>(null);

  // App Data
  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem('sentinel_services');
      return saved ? JSON.parse(saved) : initialServices;
    } catch (e) {
      console.error("Failed to load services from storage", e);
      return initialServices;
    }
  });

  // Modals & Panels
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [serviceForThreshold, setServiceForThreshold] = useState<Service | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filters & Search (Monitors View)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterRegion, setFilterRegion] = useState<string>('All');
  const [filterTag, setFilterTag] = useState<string>('All');

  // Filters (Alerts View)
  const [alertFilterStatus, setAlertFilterStatus] = useState('All');
  const [alertFilterSeverity, setAlertFilterSeverity] = useState('All');

  // Alerts
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    try {
      const saved = localStorage.getItem('sentinel_alerts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load alerts from storage", e);
      return [];
    }
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('sentinel_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('sentinel_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Derived Stats
  const operationalCount = services.filter(s => s.status === ServiceStatus.OPERATIONAL).length;
  const incidentCount = services.filter(s => s.status !== ServiceStatus.OPERATIONAL).length;
  const avgUptime = (services.reduce((acc, s) => acc + s.uptimePercentage, 0) / services.length).toFixed(2);
  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  // Derived Filter Options
  const uniqueRegions = useMemo(() => Array.from(new Set(services.map(s => s.region))).sort(), [services]);
  const uniqueTags = useMemo(() => Array.from(new Set(services.flatMap(s => s.tags || []))).sort(), [services]);

  // Filter Logic
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.url.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'All' || service.status === filterStatus;
      const matchesRegion = filterRegion === 'All' || service.region === filterRegion;
      const matchesTag = filterTag === 'All' || (service.tags && service.tags.includes(filterTag));

      return matchesSearch && matchesStatus && matchesRegion && matchesTag;
    });
  }, [services, searchQuery, filterStatus, filterRegion, filterTag]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (alertFilterStatus !== 'All' && a.status !== alertFilterStatus.toLowerCase()) return false;
      if (alertFilterSeverity !== 'All' && a.severity !== alertFilterSeverity.toLowerCase()) return false;
      return true;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [alerts, alertFilterStatus, alertFilterSeverity]);

  // Auth Handler
  const handleAuth = () => {
    setUser({ name: 'John Doe', email: 'john@sentinel.dev', initials: 'JD' });
    setCurrentPage('dashboard');
  };

  const handleSignOut = () => {
    setUser(null);
    setCurrentPage('signin');
    setIsProfileOpen(false);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('All');
    setFilterRegion('All');
    setFilterTag('All');
  };

  // Periodic Logic (Simulated)
  useEffect(() => {
    if (!user) return;

    const checkThresholds = () => {
      const newAlerts: Alert[] = [];
      const now = new Date().toLocaleTimeString();

      services.forEach(service => {
        service.thresholds.forEach(threshold => {
          if (!threshold.enabled) return;

          let isBreach = false;
          let currentValue = 0;

          if (threshold.metric === MetricType.LATENCY) {
            currentValue = service.history[0]?.latency || 0;
            if (threshold.operator === ComparisonOperator.GREATER_THAN) isBreach = currentValue > threshold.value;
            else isBreach = currentValue < threshold.value;
          } else if (threshold.metric === MetricType.UPTIME) {
            currentValue = service.uptimePercentage;
            if (threshold.operator === ComparisonOperator.LESS_THAN) isBreach = currentValue < threshold.value;
            else isBreach = currentValue > threshold.value;
          } else if (threshold.metric === MetricType.ERROR_RATE) {
            currentValue = service.status === ServiceStatus.DOWN ? 100 : service.status === ServiceStatus.DEGRADED ? 15 : 0;
            if (threshold.operator === ComparisonOperator.GREATER_THAN) isBreach = currentValue > threshold.value;
          }

          if (isBreach) {
            const exists = alerts.some(a =>
              a.serviceId === service.id &&
              a.thresholdId === threshold.id &&
              a.status !== 'resolved'
            );

            if (!exists) {
              newAlerts.push({
                id: Math.random().toString(36).substr(2, 9),
                serviceId: service.id,
                thresholdId: threshold.id,
                message: `${threshold.metric} ${threshold.operator} ${threshold.value} (Current: ${currentValue.toFixed(0)})`,
                timestamp: now,
                severity: threshold.metric === MetricType.UPTIME || service.status === ServiceStatus.DOWN ? 'critical' : 'warning',
                status: 'active'
              });
            }
          }
        });
      });

      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev]);
      }
    };

    const interval = setInterval(checkThresholds, 5000);
    checkThresholds();
    return () => clearInterval(interval);
  }, [services, user, alerts]);

  // Handlers
  const openThresholdSettings = (service: Service) => {
    setServiceForThreshold(service);
    setIsThresholdModalOpen(true);
  };

  const handleSaveThresholds = (serviceId: string, newThresholds: Threshold[]) => {
    setServices(prev => prev.map(s =>
      s.id === serviceId ? { ...s, thresholds: newThresholds } : s
    ));
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'acknowledged' } : a));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'resolved' } : a));
  };

  // --- Views ---

  if (currentPage === 'signin' || currentPage === 'signup') {
    return <AuthPages view={currentPage} onNavigate={setCurrentPage} onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-parchment text-foreground font-sans selection:bg-almond-silk/30">

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-parchment/80 backdrop-blur-md border-b border-dust-grey/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setCurrentPage('dashboard')}
            >
              <div className="w-8 h-8 bg-foreground text-parchment rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">Sentinel</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground-muted hover:text-foreground hover:bg-linen rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <XCircle className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground-muted">
              {['dashboard', 'incidents', 'monitors', 'alerts'].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as PageView)}
                  className={`${currentPage === page ? 'text-foreground font-bold' : 'hover:text-foreground'} transition-colors relative capitalize`}
                >
                  {page}
                  {currentPage === page && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-5 left-0 right-0 h-0.5 bg-foreground"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`relative p-2 rounded-full transition-colors text-foreground-muted ${isNotificationsOpen ? 'bg-linen text-foreground' : 'hover:bg-linen'}`}
              >
                <Bell className="w-5 h-5" />
                {activeAlertsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-parchment" />
                )}
              </motion.button>

              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-8 h-8 rounded-full bg-almond-silk/50 border border-dust-grey flex items-center justify-center text-xs font-bold text-foreground hover:ring-2 hover:ring-almond-silk transition-all"
                >
                  {user?.initials || 'JP'}
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-linen border border-dust-grey rounded-xl shadow-xl z-20 py-1"
                      >
                        <div className="px-4 py-3 border-b border-dust-grey/30">
                          <p className="text-sm font-medium text-foreground">{user?.name}</p>
                          <p className="text-xs text-foreground-muted truncate">{user?.email}</p>
                        </div>
                        <button
                          onClick={() => { setIsProfileOpen(false); setIsProfileModalOpen(true); }}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-parchment transition-colors flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4" /> Settings
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-dust-grey/50 bg-parchment overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4">
                <div className="grid gap-2">
                  {['dashboard', 'incidents', 'monitors', 'alerts'].map((page) => (
                    <button
                      key={page}
                      onClick={() => { setCurrentPage(page as PageView); setIsMobileMenuOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium capitalize transition-colors ${currentPage === page
                        ? 'bg-foreground text-parchment'
                        : 'text-foreground hover:bg-linen'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-dust-grey/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-almond-silk/50 border border-dust-grey flex items-center justify-center text-xs font-bold text-foreground">
                      {user?.initials || 'JP'}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">{user?.name}</p>
                      <p className="text-xs text-foreground-muted truncate max-w-[150px]">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsMobileMenuOpen(false); }}
                      className="p-2 rounded-full hover:bg-linen text-foreground-muted relative"
                    >
                      <Bell className="w-5 h-5" />
                      {activeAlertsCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-parchment" />
                      )}
                    </button>
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); setIsProfileModalOpen(true); }}
                      className="p-2 rounded-full hover:bg-linen text-foreground-muted"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="p-2 rounded-full hover:bg-red-50 text-red-500"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-[calc(100vh-80px)]">

        {/* Notifications Panel */}
        <AnimatePresence>
          {isNotificationsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-linen border border-dust-grey rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <BellRing className="w-4 h-4" /> Active Alerts ({activeAlertsCount})
                  </h3>
                  <button onClick={() => setIsNotificationsOpen(false)} className="text-xs text-foreground-muted hover:text-foreground">Close</button>
                </div>
                {activeAlertsCount === 0 ? (
                  <p className="text-sm text-foreground-muted text-center py-4">No active alerts.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {alerts.filter(a => a.status === 'active').map(alert => (
                      <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border ${alert.severity === 'critical' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-yellow-50 border-yellow-200 text-yellow-900'
                        }`}>
                        <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{services.find(s => s.id === alert.serviceId)?.name}</p>
                          <p className="text-xs opacity-90">{alert.message}</p>
                          <p className="text-[10px] opacity-75 mt-1">{alert.timestamp}</p>
                        </div>
                        <button onClick={() => acknowledgeAlert(alert.id)} className="text-xs hover:underline opacity-60 hover:opacity-100 font-medium">Ack</button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-3 pt-3 border-t border-dust-grey/30 text-center">
                  <button onClick={() => { setIsNotificationsOpen(false); setCurrentPage('alerts'); }} className="text-xs font-semibold text-foreground hover:underline">
                    Manage all alerts
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- VIEW SWITCHER --- */}
        <AnimatePresence mode="wait">

          {/* DASHBOARD VIEW */}
          {currentPage === 'dashboard' && (
            <motion.div
              key="dashboard"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              {/* Header Hero */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-2">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl font-bold text-foreground"
                  >
                    System Overview
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-foreground-muted"
                  >
                    Real-time performance metrics and availability status.
                  </motion.p>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span className="flex items-center gap-2 px-3 py-1 bg-linen border border-dust-grey rounded-full text-xs font-medium text-foreground-muted">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Live Monitoring
                  </span>
                  <span className="text-xs text-foreground-muted">Last updated: Just now</span>
                </div>
              </div>

              {/* Stats Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <motion.div variants={cardVariants} whileHover="hover" whileTap="tap" className="bg-linen border border-dust-grey rounded-xl p-5 shadow-sm transition-colors relative overflow-hidden group cursor-default">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Server className="w-16 h-16 text-foreground" />
                  </div>
                  <p className="text-foreground-muted text-sm font-medium">Avg. Uptime</p>
                  <h3 className="text-3xl font-bold text-foreground mt-2">{avgUptime}%</h3>
                  <div className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> All systems normal
                  </div>
                </motion.div>

                <motion.div variants={cardVariants} whileHover="hover" whileTap="tap" className="bg-linen border border-dust-grey rounded-xl p-5 shadow-sm transition-colors cursor-default">
                  <p className="text-foreground-muted text-sm font-medium">Active Services</p>
                  <h3 className="text-3xl font-bold text-foreground mt-2">{services.length}</h3>
                  <div className="w-full mt-3">
                    <AnimatedBeam className="h-6" active={true} />
                  </div>
                </motion.div>

                <motion.div variants={cardVariants} whileHover="hover" whileTap="tap" className="bg-linen border border-dust-grey rounded-xl p-5 shadow-sm transition-colors cursor-default">
                  <p className="text-foreground-muted text-sm font-medium">Operational</p>
                  <h3 className="text-3xl font-bold text-foreground mt-2">{operationalCount}</h3>
                  <div className="mt-2 text-xs text-foreground-muted font-medium">
                    services performing optimally
                  </div>
                </motion.div>

                <motion.div variants={cardVariants} whileHover="hover" whileTap="tap" className={`border rounded-xl p-5 shadow-sm transition-colors cursor-default ${incidentCount > 0 ? 'bg-powder-petal/30 border-red-200' : 'bg-linen border-dust-grey'}`}>
                  <p className="text-foreground-muted text-sm font-medium">Active Incidents</p>
                  <h3 className="text-3xl font-bold text-foreground mt-2">{incidentCount}</h3>
                  {incidentCount > 0 && (
                    <div className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1 animate-pulse">
                      <AlertCircle className="w-3 h-3" /> Attention required
                    </div>
                  )}
                </motion.div>
              </motion.div>

              {/* Main Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Service List */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Monitored Services</h2>
                    <button onClick={() => setCurrentPage('monitors')} className="text-sm text-foreground-muted hover:text-foreground underline">View all monitors</button>
                  </div>
                  <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                    {services.slice(0, 3).map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        onThresholdSettings={openThresholdSettings}
                      />
                    ))}
                  </motion.div>
                </div>

                {/* Sidebar */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-dust-grey">
                    <h3 className="font-semibold text-foreground mb-4">Regional Status</h3>
                    <div className="space-y-4">
                      {[
                        { region: 'us-east-1', status: 'Operational', latency: '45ms' },
                        { region: 'us-west-2', status: 'Degraded', latency: '120ms' },
                        { region: 'eu-central-1', status: 'Operational', latency: '68ms' },
                        { region: 'ap-northeast-1', status: 'Operational', latency: '140ms' },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${r.status === 'Operational' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            <span className="text-foreground-muted">{r.region}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-foreground text-xs">{r.latency}</span>
                            <MiniBeam active={r.status === 'Degraded'} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-powder-petal/20 rounded-xl p-6 border border-almond-silk/50">
                    <h3 className="font-semibold text-foreground mb-2">Planned Maintenance</h3>
                    <div className="flex gap-3 items-start mt-4">
                      <div className="bg-white p-2 rounded-lg border border-dust-grey/50 text-center min-w-[60px]">
                        <div className="text-xs text-red-500 font-bold uppercase">Oct</div>
                        <div className="text-xl font-bold text-foreground">24</div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-foreground">Database Migration</h4>
                        <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                          Scheduled maintenance for the primary user database cluster. Expected downtime: 15 mins.
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-foreground-muted">
                          <Clock className="w-3 h-3" /> 02:00 AM - 04:00 AM UTC
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* MONITORS VIEW */}
          {currentPage === 'monitors' && (
            <motion.div
              key="monitors"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">All Monitors</h1>
                  <p className="text-foreground-muted">Detailed performance metrics for all configured services.</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-foreground text-parchment rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors"
                >
                  + Add Monitor
                </motion.button>
              </div>

              {/* Search and Filters Toolbar */}
              <div className="bg-linen border border-dust-grey rounded-xl p-4 flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-parchment border border-dust-grey rounded-lg text-sm text-foreground focus:outline-none focus:border-almond-silk"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  {/* Status Filter */}
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="appearance-none pl-9 pr-8 py-2 bg-parchment border border-dust-grey rounded-lg text-sm text-foreground focus:outline-none focus:border-almond-silk cursor-pointer min-w-[140px]"
                    >
                      <option value="All">All Statuses</option>
                      <option value={ServiceStatus.OPERATIONAL}>Operational</option>
                      <option value={ServiceStatus.DEGRADED}>Degraded</option>
                      <option value={ServiceStatus.DOWN}>Down</option>
                      <option value={ServiceStatus.MAINTENANCE}>Maintenance</option>
                    </select>
                    <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none" />
                  </div>

                  {/* Region Filter */}
                  <div className="relative">
                    <select
                      value={filterRegion}
                      onChange={(e) => setFilterRegion(e.target.value)}
                      className="appearance-none pl-9 pr-8 py-2 bg-parchment border border-dust-grey rounded-lg text-sm text-foreground focus:outline-none focus:border-almond-silk cursor-pointer min-w-[140px]"
                    >
                      <option value="All">All Regions</option>
                      {uniqueRegions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none" />
                  </div>

                  {/* Tag Filter */}
                  <div className="relative">
                    <select
                      value={filterTag}
                      onChange={(e) => setFilterTag(e.target.value)}
                      className="appearance-none pl-9 pr-8 py-2 bg-parchment border border-dust-grey rounded-lg text-sm text-foreground focus:outline-none focus:border-almond-silk cursor-pointer min-w-[140px]"
                    >
                      <option value="All">All Tags</option>
                      {uniqueTags.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none" />
                  </div>

                  {/* Clear Filters */}
                  {(searchQuery || filterStatus !== 'All' || filterRegion !== 'All' || filterTag !== 'All') && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Results */}
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-6">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onThresholdSettings={openThresholdSettings}
                    />
                  ))
                ) : (
                  <motion.div variants={itemVariants} className="text-center py-12 bg-linen border border-dust-grey rounded-xl border-dashed">
                    <Search className="w-12 h-12 text-dust-grey mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-foreground">No services found</h3>
                    <p className="text-foreground-muted">Try adjusting your search or filters.</p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* ALERTS VIEW */}
          {currentPage === 'alerts' && (
            <motion.div
              key="alerts"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Alert Management</h1>
                  <p className="text-foreground-muted">View, acknowledge, and resolve system alerts.</p>
                </div>
              </div>

              {/* Filter Toolbar */}
              <div className="bg-linen border border-dust-grey rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground-muted">
                  <Filter className="w-4 h-4" /> Filters:
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={alertFilterStatus}
                    onChange={(e) => setAlertFilterStatus(e.target.value)}
                    className="appearance-none px-4 py-2 bg-parchment border border-dust-grey rounded-lg text-sm text-foreground focus:outline-none focus:border-almond-silk cursor-pointer min-w-[120px]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Acknowledged">Acknowledged</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  <select
                    value={alertFilterSeverity}
                    onChange={(e) => setAlertFilterSeverity(e.target.value)}
                    className="appearance-none px-4 py-2 bg-parchment border border-dust-grey rounded-lg text-sm text-foreground focus:outline-none focus:border-almond-silk cursor-pointer min-w-[120px]"
                  >
                    <option value="All">All Severities</option>
                    <option value="Critical">Critical</option>
                    <option value="Warning">Warning</option>
                  </select>
                </div>

                <div className="ml-auto text-sm text-foreground-muted">
                  Showing {filteredAlerts.length} alerts
                </div>
              </div>

              {/* Alerts List */}
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-4">
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map(alert => {
                    const service = services.find(s => s.id === alert.serviceId);
                    return (
                      <motion.div variants={itemVariants} key={alert.id} className={`bg-linen border rounded-xl p-5 transition-all flex flex-col md:flex-row gap-4 justify-between items-start md:items-center ${alert.status === 'resolved' ? 'border-dust-grey opacity-70' :
                        alert.status === 'acknowledged' ? 'border-blue-200' :
                          alert.severity === 'critical' ? 'border-red-200 shadow-sm' : 'border-yellow-200 shadow-sm'
                        }`}>
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg shrink-0 ${alert.status === 'resolved' ? 'bg-stone-200 text-stone-500' :
                            alert.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                            }`}>
                            {alert.status === 'resolved' ? <CheckSquare className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">{service?.name || 'Unknown Service'}</h3>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider border ${alert.status === 'active' ? 'bg-red-100 text-red-700 border-red-200' :
                                alert.status === 'acknowledged' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                  'bg-stone-100 text-stone-600 border-stone-200'
                                }`}>
                                {alert.status}
                              </span>
                              <span className="text-[10px] text-foreground-muted">{alert.timestamp}</span>
                            </div>
                            <p className="text-sm text-foreground">{alert.message}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-auto">
                          {alert.status === 'active' && (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => acknowledgeAlert(alert.id)}
                              className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Acknowledge
                            </motion.button>
                          )}
                          {alert.status !== 'resolved' && (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => resolveAlert(alert.id)}
                              className="px-3 py-1.5 bg-white border border-green-200 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-50 transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Resolve
                            </motion.button>
                          )}
                          {alert.status === 'resolved' && (
                            <span className="text-xs font-medium text-stone-500 flex items-center gap-1 px-3 py-1.5">
                              <Archive className="w-3 h-3" /> Archived
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div variants={itemVariants} className="text-center py-16 bg-linen border border-dust-grey rounded-xl border-dashed">
                    <CheckCircle2 className="w-12 h-12 text-green-500/50 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-foreground">All clear</h3>
                    <p className="text-foreground-muted">No alerts matching your filters.</p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* INCIDENTS VIEW */}
          {currentPage === 'incidents' && (
            <motion.div
              key="incidents"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold text-foreground">Incidents</h1>
                <p className="text-foreground-muted">History of outages, degradations, and resolved issues.</p>
              </div>

              {/* Active Incidents */}
              {incidentCount > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-500" /> Active Incidents
                  </h2>
                  {services.filter(s => s.status !== ServiceStatus.OPERATIONAL).map(service => (
                    <motion.div variants={itemVariants} key={service.id} className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-red-900">{service.name} is {service.status}</h3>
                          <p className="text-red-700 mt-1 text-sm">Investigating - High latency detected in {service.region} region.</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Past Incidents (Mock) */}
              <div className="space-y-4 pt-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Past Incidents
                </h2>
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="bg-linen border border-dust-grey rounded-xl overflow-hidden">
                  {[1, 2, 3].map((_, i) => (
                    <motion.div variants={itemVariants} key={i} className="p-4 border-b border-dust-grey/50 last:border-0 hover:bg-parchment/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-foreground">API Gateway Latency Spike</h4>
                          <p className="text-xs text-foreground-muted">Resolved • Oct {20 - i}, 2023</p>
                        </div>
                        <span className="text-xs font-mono text-foreground-muted">Duration: 14m</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ThresholdSettingsModal
        isOpen={isThresholdModalOpen}
        onClose={() => setIsThresholdModalOpen(false)}
        service={serviceForThreshold}
        onSave={handleSaveThresholds}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onSave={handleUpdateProfile}
      />

    </div>
  );
};

export default App;
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PieChart, 
  CreditCard, 
  History, 
  HelpCircle,
  Wallet,
  TrendingUp,
  ArrowDownLeft
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { name: 'Investments', href: '/dashboard/investments', icon: PieChart },
  { name: 'Deposits', href: '/dashboard/deposits', icon: Wallet },
  { name: 'Withdrawals', href: '/dashboard/withdrawals', icon: ArrowDownLeft },
  { name: 'Transactions', href: '/dashboard/transactions', icon: History },
  { name: 'Performance', href: '/dashboard/performance', icon: TrendingUp },
  { name: 'Support', href: '/dashboard/support', icon: HelpCircle },
];

const DashboardSidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Dashboard</h2>
        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;
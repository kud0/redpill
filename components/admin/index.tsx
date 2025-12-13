'use client';

import { ReactNode } from 'react';

// ============================================
// REUSABLE ADMIN UI COMPONENTS (DRY)
// ============================================

// Types
interface BaseProps {
  className?: string;
  children?: ReactNode;
}

// ============================================
// STAT CARD - For dashboard statistics
// ============================================
interface StatCardProps extends BaseProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: number; isPositive: boolean };
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
  default: 'border-white/10',
  success: 'border-neon-green/30',
  warning: 'border-yellow-500/30',
  danger: 'border-neon-red/30',
};

const variantGlow = {
  default: '',
  success: 'shadow-[0_0_15px_rgba(0,255,65,0.1)]',
  warning: 'shadow-[0_0_15px_rgba(234,179,8,0.1)]',
  danger: 'shadow-[0_0_15px_rgba(255,0,51,0.1)]',
};

export function StatCard({ label, value, icon, trend, variant = 'default', className = '' }: StatCardProps) {
  return (
    <div className={`
      relative bg-black/40 backdrop-blur-md border rounded-lg p-6
      ${variantStyles[variant]} ${variantGlow[variant]} ${className}
    `}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-white font-mono">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.isPositive ? 'text-neon-green' : 'text-neon-red'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="text-gray-500">{icon}</div>
        )}
      </div>
    </div>
  );
}

// ============================================
// PANEL - Container for sections
// ============================================
interface PanelProps extends BaseProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function Panel({ title, subtitle, actions, children, className = '' }: PanelProps) {
  return (
    <div className={`bg-black/40 backdrop-blur-md border border-white/10 rounded-lg ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

// ============================================
// TABLE - Data display
// ============================================
interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (item: T) => void;
}

export function Table<T>({ columns, data, keyExtractor, emptyMessage = 'No data found', loading, onRowClick }: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-6 h-6 border-2 border-neon-red border-t-transparent rounded-full" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className={`hover:bg-white/5 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className={`px-4 py-4 text-sm text-gray-300 font-mono ${col.className || ''}`}>
                  {col.render ? col.render(item) : String((item as any)[col.key] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// BUTTON - Action buttons
// ============================================
interface ButtonProps extends BaseProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

const buttonVariants = {
  primary: 'bg-neon-red text-black hover:bg-white',
  secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/10',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  onClick,
  type = 'button',
  children,
  className = ''
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        font-mono font-semibold uppercase tracking-wider transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${buttonVariants[variant]} ${buttonSizes[size]} ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          Loading...
        </span>
      ) : children}
    </button>
  );
}

// ============================================
// BADGE - Status indicators
// ============================================
interface BadgeProps extends BaseProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const badgeVariants = {
  default: 'bg-white/10 text-gray-300',
  success: 'bg-neon-green/20 text-neon-green',
  warning: 'bg-yellow-500/20 text-yellow-500',
  danger: 'bg-neon-red/20 text-neon-red',
  info: 'bg-neon-blue/20 text-neon-blue',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 text-xs font-mono uppercase tracking-wider rounded
      ${badgeVariants[variant]} ${className}
    `}>
      {children}
    </span>
  );
}

// ============================================
// INPUT - Form inputs
// ============================================
interface InputProps {
  label?: string;
  type?: 'text' | 'number' | 'date' | 'email';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function Input({ label, type = 'text', value, onChange, placeholder, disabled, error, className = '' }: InputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-2 bg-black/50 border rounded font-mono text-sm text-white
          placeholder-gray-600 focus:outline-none focus:ring-1 transition-all
          ${error ? 'border-neon-red focus:ring-neon-red' : 'border-white/10 focus:ring-neon-red/50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />
      {error && <p className="text-xs text-neon-red mt-1">{error}</p>}
    </div>
  );
}

// ============================================
// TABS - Navigation tabs
// ============================================
interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 border-b border-white/10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            px-4 py-3 text-sm font-mono uppercase tracking-wider transition-all
            border-b-2 -mb-px
            ${activeTab === tab.id
              ? 'text-neon-red border-neon-red'
              : 'text-gray-500 border-transparent hover:text-gray-300'
            }
          `}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-2 text-xs bg-white/10 px-1.5 py-0.5 rounded">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ============================================
// MODAL - Dialog overlay
// ============================================
interface ModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function Modal({ isOpen, onClose, title, children, className = '' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className={`
        relative bg-matrix-black border border-white/10 rounded-lg
        max-w-lg w-full mx-4 max-h-[90vh] overflow-auto
        shadow-[0_0_30px_rgba(255,0,51,0.2)] ${className}
      `}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
export function formatNumber(num: number, decimals = 2): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(decimals) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(decimals) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(decimals) + 'K';
  return num.toFixed(decimals);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatWallet(address: string, chars = 4): string {
  if (!address) return '-';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatSOL(amount: number): string {
  return `${amount.toFixed(4)} SOL`;
}

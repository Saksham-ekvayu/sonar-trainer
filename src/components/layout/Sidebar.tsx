import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Waves,
  Radio,
  Activity,
  Calculator,
  BrainCircuit,
  Target,
  MonitorDot,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/scenario-setup', label: 'Scenario Setup', icon: Settings },
  { path: '/environment', label: 'Environment', icon: Waves },
  { path: '/equipment', label: 'Equipment', icon: Radio },
  { path: '/propagation', label: 'Propagation', icon: Activity },
  { path: '/sonar-equation', label: 'Sonar Equation', icon: Calculator },
  { path: '/signal-processing', label: 'Signal Processing', icon: BrainCircuit },
  { path: '/target-strength', label: 'Target Strength', icon: Target },
  { path: '/visualization', label: 'Visualization', icon: MonitorDot },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
                <div className="absolute inset-1 rounded-full bg-primary/40" />
                <div className="absolute inset-2 rounded-full bg-primary" />
              </div>
              <span className="font-mono text-sm font-bold text-primary sonar-glow-text">
                SONAR
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              const linkContent = (
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary sonar-glow'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 flex-shrink-0',
                      isActive && 'text-primary'
                    )}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );

              return (
                <li key={item.path}>
                  {collapsed ? (
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    linkContent
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          {!collapsed && (
            <div className="text-xs text-muted-foreground">
              <p className="font-mono">v1.0.0</p>
              <p className="mt-1">Naval Sonar Simulator</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

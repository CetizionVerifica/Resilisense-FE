import { Home, type LucideIcon, Settings } from 'lucide-react';
import { type Permission } from '@/lib/auth/me';

export interface NavItem {
  to: string;
  labelKey: string;
  icon: LucideIcon;
  /** Hidden without this permission (from GET /v1/me). */
  permission?: Permission;
  /** Entitlement module; non-entitled items show the locked-module panel (M01 §2, M02). */
  module?: string;
  /** Active only on the exact path (default); false keeps it active on sub-pages. */
  end?: boolean;
}

export interface NavGroup {
  labelKey: string;
  items: NavItem[];
}

/**
 * Sidebar groups (02 §3). Feature modules add their entries as they land (M03 Projects,
 * M04 Gap analysis, …); items are filtered by permission, never by ad-hoc role checks.
 */
export const NAV: NavGroup[] = [
  { labelKey: 'nav.group.workspace', items: [{ to: '/', labelKey: 'nav.home', icon: Home }] },
  { labelKey: 'nav.group.admin', items: [{ to: '/settings', labelKey: 'nav.settings', icon: Settings, end: false }] },
];

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: number;
  status?: 'online' | 'offline' | 'warning' | 'critical';
  isNested?: boolean;
}

export interface SidebarGroup {
  id: string;
  title: string;
  items: SidebarItem[];
  defaultExpanded?: boolean;
}

export interface SidebarState {
  isExpanded: boolean;
  expandedGroups: Record<string, boolean>;
  pinnedItems: string[];
  favorites: string[];
  recentItems: string[];
}

import {
  Fingerprint,
  LayoutDashboard,
  ChartBar,
  Banknote,
  Headphones,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        title: "Default",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      {
        title: "Service Orders",
        url: "/dashboard/service-orders",
        icon: Briefcase,
        isNew: true,
      },
      {
        title: "Podcast Orders",
        url: "/dashboard/podcast-orders",
        icon: Headphones,
      }
    ],
  },
];

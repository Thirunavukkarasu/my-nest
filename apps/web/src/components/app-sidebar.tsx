"use client";

import * as React from "react";
import {
  GalleryVerticalEnd,
  LayoutDashboardIcon,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "My Nest",
      logo: GalleryVerticalEnd,
      plan: "Apartment",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Flats",
      url: "/flats",
      icon: SquareTerminal,
    },
    {
      title: "Residents",
      url: "/residents",
      icon: SquareTerminal,
    },
    {
      title: "Payments",
      url: "/payments",
      icon: SquareTerminal,
    },
    {
      title: "Expenses",
      url: "/expenses",
      icon: SquareTerminal,
    },
    {
      title: 'Transacion History',
      url: '/transaction-history',
      icon: SquareTerminal,
    }
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain navMain={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

import type { LucideIcon } from "lucide-react";
import {
  Download,
  Heart,
  MapPinned,
  Palette,
  ShoppingBag,
  Shirt,
  Sparkles,
  Trophy,
  VenetianMask,
} from "lucide-react";

export type NavigationDestination = {
  id: string;
  label: string;
  description?: string;
  href: string | null;
  icon?: LucideIcon;
  available: boolean;
  status?: string;
};

export type NavigationMenu = {
  id: "garage" | "shop";
  label: string;
  icon: LucideIcon;
  items: NavigationDestination[];
};

/**
 * Keep page routes here rather than coupling the navbar to pages that are not
 * in the current App Router yet. A null href is an intentional, safe state.
 */
export const navigationConfig = {
  home: {
    id: "home",
    label: "Trang chủ",
    href: "/",
    available: true,
    icon: Sparkles,
  } satisfies NavigationDestination,
  menus: [
    {
      id: "garage",
      label: "Garage",
      icon: VenetianMask,
      items: [
        {
          id: "garage-dino",
          label: "Garage Dino",
          description: "Quản lý khủng long",
          href: null,
          icon: VenetianMask,
          available: false,
          status: "Sắp ra mắt",
        },
        {
          id: "garage-skin",
          label: "Garage Skin",
          description: "Bộ sưu tập Skin",
          href: null,
          icon: Shirt,
          available: false,
          status: "Sắp ra mắt",
        },
      ],
    },
    {
      id: "shop",
      label: "Shop",
      icon: ShoppingBag,
      items: [
        {
          id: "shop-dino",
          label: "Shop Dino",
          description: "Cửa hàng khủng long",
          href: null,
          icon: VenetianMask,
          available: false,
          status: "Sắp ra mắt",
        },
        {
          id: "shop-skin",
          label: "Shop Skin",
          description: "Cửa hàng Skin",
          href: null,
          icon: Palette,
          available: false,
          status: "Sắp ra mắt",
        },
      ],
    },
  ] satisfies NavigationMenu[],
  destinations: [
    {
      id: "live-map",
      label: "Bản đồ trực tiếp",
      href: null,
      icon: MapPinned,
      available: false,
      status: "Chưa có route",
    },
    {
      id: "leaderboard",
      label: "Bảng Xếp Hạng",
      href: null,
      icon: Trophy,
      available: false,
      status: "Chưa có route",
    },
    {
      id: "skin-editor",
      label: "Chỉnh sửa Skin",
      href: null,
      icon: Palette,
      available: false,
      status: "Sắp ra mắt",
    },
    {
      id: "donate",
      label: "Donate",
      href: null,
      icon: Heart,
      available: false,
      status: "Chưa có cổng thanh toán",
    },
  ] satisfies NavigationDestination[],
  launcher: {
    id: "launcher",
    label: "Tải Launcher",
    href: null,
    icon: Download,
    available: false,
    status: "Sắp ra mắt",
  } satisfies NavigationDestination,
} as const;

export type NavigationMenuId = (typeof navigationConfig.menus)[number]["id"];

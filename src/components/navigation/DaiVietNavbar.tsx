"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Heart,
  LockKeyhole,
  Menu,
  X,
} from "lucide-react";
import {
  navigationConfig,
  type NavigationDestination,
  type NavigationMenu,
  type NavigationMenuId,
} from "./navigation.config";
import styles from "./DaiVietNavbar.module.css";
import { useEffect, useRef, useState } from "react";

type OpenMenu = NavigationMenuId | null;

function isActive(pathname: string | null, href: string | null) {
  if (!pathname || !href) return false;
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function UnavailableDestination({
  destination,
  className,
  compact = false,
}: {
  destination: NavigationDestination;
  className?: string;
  compact?: boolean;
}) {
  const Icon = destination.icon;
  return (
    <button
      type="button"
      className={[className, styles.unavailable].filter(Boolean).join(" ")}
      aria-disabled="true"
      title={destination.status ?? "Chưa khả dụng"}
      data-destination={destination.id}
    >
      {Icon ? <Icon aria-hidden="true" size={compact ? 17 : 16} strokeWidth={1.8} /> : null}
      <span>{destination.label}</span>
      <span className={styles.soon}>{compact ? "Sắp ra mắt" : destination.status ?? "Sắp ra mắt"}</span>
    </button>
  );
}

function DestinationLink({
  destination,
  pathname,
  className,
  onNavigate,
  compact = false,
}: {
  destination: NavigationDestination;
  pathname: string | null;
  className?: string;
  onNavigate: () => void;
  compact?: boolean;
}) {
  const Icon = destination.icon;
  if (!destination.available || !destination.href) {
    return <UnavailableDestination destination={destination} className={className} compact={compact} />;
  }
  return (
    <Link
      href={destination.href}
      className={[className, isActive(pathname, destination.href) ? styles.active : ""].filter(Boolean).join(" ")}
      aria-current={isActive(pathname, destination.href) ? "page" : undefined}
      onClick={onNavigate}
      data-destination={destination.id}
    >
      {Icon ? <Icon aria-hidden="true" size={compact ? 17 : 16} strokeWidth={1.8} /> : null}
      <span>{destination.label}</span>
    </Link>
  );
}

function MenuItem({
  destination,
  pathname,
  onNavigate,
}: {
  destination: NavigationDestination;
  pathname: string | null;
  onNavigate: () => void;
}) {
  const Icon = destination.icon;
  const itemClass = styles.dropdownItem;
  if (!destination.available || !destination.href) {
    return (
      <button
        type="button"
        role="menuitem"
        className={[itemClass, styles.dropdownUnavailable].join(" ")}
        aria-disabled="true"
        data-menu-item="true"
        data-destination={destination.id}
        title={destination.status ?? "Chưa khả dụng"}
      >
        <span className={styles.dropdownIcon}>{Icon ? <Icon aria-hidden="true" size={18} strokeWidth={1.8} /> : <LockKeyhole size={17} />}</span>
        <span className={styles.dropdownCopy}>
          <strong>{destination.label}</strong>
          {destination.description ? <small>{destination.description}</small> : null}
        </span>
        <span className={styles.dropdownStatus}>{destination.status ?? "Sắp ra mắt"}</span>
      </button>
    );
  }
  return (
    <Link
      href={destination.href}
      role="menuitem"
      className={[itemClass, isActive(pathname, destination.href) ? styles.active : ""].filter(Boolean).join(" ")}
      onClick={onNavigate}
      data-menu-item="true"
      data-destination={destination.id}
    >
      <span className={styles.dropdownIcon}>{Icon ? <Icon aria-hidden="true" size={18} strokeWidth={1.8} /> : null}</span>
      <span className={styles.dropdownCopy}>
        <strong>{destination.label}</strong>
        {destination.description ? <small>{destination.description}</small> : null}
      </span>
    </Link>
  );
}

export function DaiVietNavbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Partial<Record<NavigationMenuId, HTMLButtonElement | null>>>({});
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<OpenMenu>(null);

  const closeAll = () => {
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  };

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) closeAll();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const wasOpen = Boolean(openMenu || mobileOpen);
        closeAll();
        if (wasOpen) {
          const trigger = openMenu
            ? triggerRefs.current[openMenu]
            : navRef.current?.querySelector<HTMLButtonElement>("[aria-controls='daiviet-mobile-drawer']");
          trigger?.focus();
        }
        return;
      }
      if (openMenu && ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        const items = navRef.current?.querySelectorAll<HTMLElement>(`[data-menu="${openMenu}"] [data-menu-item="true"]`);
        if (!items?.length) return;
        const currentIndex = Array.from(items).indexOf(document.activeElement as HTMLElement);
        if (currentIndex === -1) return;
        event.preventDefault();
        const nextIndex = event.key === "Home" ? 0
          : event.key === "End" ? items.length - 1
            : (currentIndex + (event.key === "ArrowDown" ? 1 : items.length - 1)) % items.length;
        items[nextIndex].focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen, openMenu]);

  useEffect(() => {
    closeAll();
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    requestAnimationFrame(() => {
      navRef.current?.querySelector<HTMLElement>("[data-mobile-nav] [data-destination='home']")?.focus();
    });
  }, [mobileOpen]);

  const toggleMenu = (menu: NavigationMenu, focusFirst = false) => {
    setOpenMenu((current) => (current === menu.id ? null : menu.id));
    if (focusFirst) {
      requestAnimationFrame(() => navRef.current?.querySelector<HTMLElement>(`[data-menu="${menu.id}"] [data-menu-item="true"]`)?.focus());
    }
  };

  const onMenuTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, menu: NavigationMenu) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpenMenu(menu.id);
      requestAnimationFrame(() => {
        const items = navRef.current?.querySelectorAll<HTMLElement>(`[data-menu="${menu.id}"] [data-menu-item="true"]`);
        if (!items?.length) return;
        (event.key === "ArrowUp" ? items[items.length - 1] : items[0]).focus();
      });
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpenMenu(null);
    }
  };

  const renderDropdown = (menu: NavigationMenu) => (
    <div
      className={[styles.dropdown, openMenu === menu.id ? styles.dropdownOpen : ""].filter(Boolean).join(" ")}
      role="menu"
      aria-label={`${menu.label} menu`}
      data-menu={menu.id}
    >
      <div className={styles.dropdownEyebrow}>{menu.label}<span>DAI VIET</span></div>
      {menu.items.map((destination) => (
        <MenuItem key={destination.id} destination={destination} pathname={pathname} onNavigate={closeAll} />
      ))}
    </div>
  );

  return (
    <header ref={navRef} className={[styles.navbar, className].filter(Boolean).join(" ")}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Đại Việt, trang chủ" onClick={closeAll}>
          <span className={styles.brandMark} aria-hidden="true">DV</span>
          <span className={styles.brandCopy}><strong>ĐẠI VIỆT</strong><small>THE ISLE COMMUNITY</small></span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Điều hướng chính">
          <DestinationLink destination={navigationConfig.home} pathname={pathname} className={styles.navLink} onNavigate={closeAll} />
          {navigationConfig.menus.map((menu) => {
            const MenuIcon = menu.icon;
            return (
              <div
                className={styles.menuCluster}
                key={menu.id}
                onMouseEnter={() => setOpenMenu(menu.id)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  type="button"
                  ref={(node) => { triggerRefs.current[menu.id] = node; }}
                  className={[styles.navLink, openMenu === menu.id ? styles.navLinkOpen : ""].filter(Boolean).join(" ")}
                  aria-haspopup="menu"
                  aria-expanded={openMenu === menu.id}
                  data-menu-trigger={menu.id}
                  onClick={() => toggleMenu(menu)}
                  onKeyDown={(event) => onMenuTriggerKeyDown(event, menu)}
                >
                  <MenuIcon aria-hidden="true" size={15} strokeWidth={1.8} />
                  <span>{menu.label}</span>
                  <ChevronDown aria-hidden="true" size={14} className={styles.chevron} />
                </button>
                {renderDropdown(menu)}
              </div>
            );
          })}
          {navigationConfig.destinations.map((destination) => (
            <DestinationLink key={destination.id} destination={destination} pathname={pathname} className={[styles.navLink, destination.id === "donate" ? styles.donateLink : ""].filter(Boolean).join(" ")} onNavigate={closeAll} />
          ))}
        </nav>

        <div className={styles.actions}>
          <UnavailableDestination destination={navigationConfig.launcher} className={styles.launcherCta} />
          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={mobileOpen}
            aria-controls="daiviet-mobile-drawer"
            data-mobile-toggle="true"
            aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
            onClick={() => setMobileOpen((current) => !current)}
          >
            {mobileOpen ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
          </button>
        </div>
      </div>

      <div id="daiviet-mobile-drawer" className={[styles.mobileDrawer, mobileOpen ? styles.mobileDrawerOpen : ""].filter(Boolean).join(" ")} aria-hidden={!mobileOpen} inert={!mobileOpen}>
        <nav className={styles.mobileNav} aria-label="Điều hướng mobile" data-mobile-nav="true">
          <DestinationLink destination={navigationConfig.home} pathname={pathname} className={styles.mobileLink} onNavigate={closeAll} compact />
          {navigationConfig.menus.map((menu) => {
            const MenuIcon = menu.icon;
            const expanded = mobileExpanded === menu.id;
            return (
              <div key={menu.id} className={styles.mobileCluster}>
                <button type="button" className={[styles.mobileLink, expanded ? styles.mobileLinkOpen : ""].filter(Boolean).join(" ")} aria-expanded={expanded} data-mobile-menu-trigger={menu.id} onClick={() => setMobileExpanded(expanded ? null : menu.id)}>
                  <MenuIcon aria-hidden="true" size={17} strokeWidth={1.8} /><span>{menu.label}</span><ChevronDown aria-hidden="true" size={16} className={expanded ? styles.chevronUp : ""} />
                </button>
                <div className={[styles.mobileSubmenu, expanded ? styles.mobileSubmenuOpen : ""].filter(Boolean).join(" ")}>
                  {menu.items.map((destination) => <MenuItem key={destination.id} destination={destination} pathname={pathname} onNavigate={closeAll} />)}
                </div>
              </div>
            );
          })}
          {navigationConfig.destinations.map((destination) => (
            <DestinationLink key={destination.id} destination={destination} pathname={pathname} className={[styles.mobileLink, destination.id === "donate" ? styles.mobileDonate : ""].filter(Boolean).join(" ")} onNavigate={closeAll} compact />
          ))}
          <UnavailableDestination destination={navigationConfig.launcher} className={[styles.mobileLink, styles.mobileLauncher].join(" ")} compact />
        </nav>
        <p className={styles.mobileFootnote}><Heart aria-hidden="true" size={14} /> Cộng đồng Đại Việt · The Isle Evrima</p>
      </div>
    </header>
  );
}

export default DaiVietNavbar;

"use client";

import { usePathname } from "next/navigation";
import { DesktopTitlebar } from "./DesktopTitlebar";

export function DesktopTitlebarWrapper() {
  const pathname = usePathname() ?? "/";
  return <DesktopTitlebar pathname={pathname} />;
}

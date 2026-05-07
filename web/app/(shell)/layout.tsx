import { BottomNav } from "@/components/BottomNav";
import { CmdK } from "@/components/CmdK";
import { DesktopTitlebarWrapper } from "@/components/DesktopTitlebarWrapper";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { SidebarRail } from "@/components/SidebarRail";
import { StoreHydrator } from "@/components/StoreHydrator";
import { SyncOnLoad } from "@/components/SyncOnLoad";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarRail />
      <DesktopTitlebarWrapper />
      <div className="shell">
        <StoreHydrator />
        <SyncOnLoad />
        <KeyboardShortcuts />
        {children}
        <BottomNav />
      </div>
      <CmdK />
    </>
  );
}

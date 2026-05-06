import { BottomNav } from "@/components/BottomNav";
import { CmdK } from "@/components/CmdK";
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
      <div className="shell">
        <StoreHydrator />
        <SyncOnLoad />
        {children}
        <BottomNav />
      </div>
      <CmdK />
    </>
  );
}

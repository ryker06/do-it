import { BottomNav } from "@/components/BottomNav";
import { StoreHydrator } from "@/components/StoreHydrator";
import { VoiceCaptureButton } from "@/components/VoiceCaptureButton";
import { SyncOnLoad } from "@/components/SyncOnLoad";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="shell">
      <StoreHydrator />
      <SyncOnLoad />
      {children}
      <BottomNav />
      <VoiceCaptureButton />
    </div>
  );
}

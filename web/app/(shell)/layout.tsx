import { BottomNav } from "@/components/BottomNav";
import { StoreHydrator } from "@/components/StoreHydrator";
import { VoiceCaptureButton } from "@/components/VoiceCaptureButton";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="shell">
      <StoreHydrator />
      {children}
      <BottomNav />
      <VoiceCaptureButton />
    </div>
  );
}

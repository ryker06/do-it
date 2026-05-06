import { BottomNav } from "@/components/BottomNav";
import { StoreHydrator } from "@/components/StoreHydrator";

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
    </div>
  );
}

import { PlatformProvider } from "@/composition/platform-provider";
import { PlatformShell } from "@/features/platform/presentation/platform-shell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformProvider demo={false}>
      <PlatformShell>{children}</PlatformShell>
    </PlatformProvider>
  );
}

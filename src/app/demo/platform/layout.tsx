import { notFound } from "next/navigation";
import { PlatformProvider } from "@/composition/platform-provider";
import { PlatformShell } from "@/features/platform/presentation/platform-shell";
export default function Layout({ children }: { children: React.ReactNode }) {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.NALAR_ENABLE_DEMO === "false"
  )
    notFound();
  return (
    <PlatformProvider demo>
      <PlatformShell>{children}</PlatformShell>
    </PlatformProvider>
  );
}

import { LoginPage } from "@/features/identity/presentation/login-page";
export default function Page() {
  return (
    <LoginPage
      demoEnabled={
        process.env.NODE_ENV === "development" &&
        process.env.NALAR_ENABLE_DEMO !== "false"
      }
    />
  );
}

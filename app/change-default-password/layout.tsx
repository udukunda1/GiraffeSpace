import { DefaultPasswordAuthProvider } from "@/contexts/default-password-auth-context";

export default function ChangeDefaultPasswordLayout({ children }: { children: React.ReactNode }) {
  return <DefaultPasswordAuthProvider>{children}</DefaultPasswordAuthProvider>;
} 
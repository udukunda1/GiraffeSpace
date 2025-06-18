import { DefaultPasswordAuthProvider } from "@/contexts/default-password-auth-context";

export default function LoginDefaultPasswordLayout({ children }: { children: React.ReactNode }) {
  return <DefaultPasswordAuthProvider>{children}</DefaultPasswordAuthProvider>;
} 
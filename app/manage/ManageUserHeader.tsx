"use client";
import { UserHeader } from "@/components/UserHeader";
import { useAuth } from "@/contexts/auth-context";

export default function ManageUserHeader() {
  const { user } = useAuth();
  return <UserHeader user={user} />;
} 
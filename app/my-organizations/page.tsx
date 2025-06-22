"use client"

import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import ApiService from "@/api/apiConfig";
import { useEffect, useState } from "react";

export default function MyOrganizationsPage() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError("");
      try {
        // const response = await ApiService.getUserById(user!.userId);
        const response = {
          user: {
            organizations: [
              { organizationId: "1", organizationName: "Organization 1" },
              { organizationId: "2", organizationName: "Organization 2" },
            ],
          },
        }
        const orgs = response?.user?.organizations || [];
        console.log(response);
        setOrganizations(orgs);
      } catch (err: any) {
        setError("Failed to load organizations.");
      } finally {
        setIsLoading(false);
      }
    };
    if (user && user.userId) {
      fetchUser();
    }
  }, [user?.userId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="my-organizations" />
      <main className="flex-1 container mx-auto px-4 md:px-16 max-w-7xl py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Organizations</h1>
          <Link
            href="/my-organizations/add"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add New Organization
          </Link>
        </div>
        {isLoading ? (
          <div className="text-center text-gray-500 py-12">Loading organizations...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : organizations.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            You have not added any organizations yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {organizations.map((org) => (
              <div key={org.organizationId} className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-lg">{org.organizationName}</span>
                </div>
                <div className="text-gray-600 text-sm mb-2">{org.description}</div>
                <div className="text-gray-500 text-xs mb-2">Type: {org.organizationType}</div>
                <div className="flex gap-2 mt-auto">
                  <Link
                    href={`/my-organizations/${org.organizationId}/edit`}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 
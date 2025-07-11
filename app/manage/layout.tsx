import ManageUserHeader from "./ManageUserHeader";
import { Sidebar } from "@/components/sidebar";

export default function VenueLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <ManageUserHeader />
      <div className="flex mt-16 min-h-screen">
        <Sidebar />
        <main className="flex-1 ">{children}</main>
      </div>
    </>
  );
}

 
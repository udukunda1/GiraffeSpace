import { Header } from "@/components/header"

export default function VenueLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
    <Header activePage="manage" />
        <>{children}</>
    </>
  )
}
import { ProtectedRoute } from "@/routes/protected-route";


export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

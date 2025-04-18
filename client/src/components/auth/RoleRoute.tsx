import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { PageLoading } from "@/components/ui/page-loading"

interface RoleRouteProps {
  children: React.ReactNode
  role: "admin" | "donor" | "ngo" | "volunteer"
}

export function RoleRoute({ children, role }: RoleRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <PageLoading />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const userRole = user.user_metadata?.role

  if (userRole !== role) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
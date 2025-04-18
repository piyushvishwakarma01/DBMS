import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { PageLoading } from "@/components/ui/page-loading"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <PageLoading />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
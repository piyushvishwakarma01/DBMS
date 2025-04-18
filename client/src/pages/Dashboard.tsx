import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return

    // Redirect based on user role
    const role = user.user_metadata?.role
    switch (role) {
      case "donor":
        navigate("/donor")
        break
      case "ngo":
        navigate("/ngo")
        break
      case "volunteer":
        navigate("/volunteer")
        break
      case "admin":
        navigate("/admin")
        break
      default:
        // If no role, stay on generic dashboard
        break
    }
  }, [user, navigate])

  if (!user) return null

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome back!</h1>
      <p>Please wait while we redirect you to your dashboard...</p>
    </div>
  )
}
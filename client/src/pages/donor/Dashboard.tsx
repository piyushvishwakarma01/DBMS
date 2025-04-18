import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { useAuth } from "@/hooks/useAuth"

export function DonorDashboard() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto p-6">
      <Heading>Welcome back, {user?.name}</Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Active Donations</h3>
          {/* Add donation stats here */}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          {/* Add recent activity here */}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Impact Summary</h3>
          {/* Add impact stats here */}
        </Card>
      </div>
    </div>
  )
}
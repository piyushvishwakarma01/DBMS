import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { useAuth } from "@/hooks/useAuth"

export function VolunteerDashboard() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto p-6">
      <Heading>Welcome back, {user?.name}</Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Current Assignments</h3>
          {/* Add current assignments */}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Upcoming Pickups</h3>
          {/* Add upcoming pickups */}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Contribution Summary</h3>
          {/* Add volunteer contribution stats */}
        </Card>
      </div>
    </div>
  )
}
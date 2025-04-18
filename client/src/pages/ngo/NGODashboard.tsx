import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRealtime } from "@/hooks/useRealtime"
import { useState } from "react"
import { Donation } from "@/types"

export function NGODashboard() {
  const { user } = useAuth()
  const [donations, setDonations] = useState<Donation[]>([])

  useRealtime("ngo_donation_updates", (payload) => {
    if (payload.new) {
      setDonations((prev) => [...prev, payload.new])
    } else if (payload.old) {
      setDonations((prev) => prev.filter((d) => d.id !== payload.old.id))
    }
  })

  const handleAccept = async (donationId: string) => {
    // TODO: Implement donation acceptance
  }

  const handleReject = async (donationId: string) => {
    // TODO: Implement donation rejection
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">NGO Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {donations.map((donation) => (
          <Card key={donation.id}>
            <CardHeader>
              <CardTitle>{donation.food_type}</CardTitle>
              <CardDescription>
                {donation.quantity} {donation.unit}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Status: {donation.status}</p>
              <p>Expiry: {new Date(donation.expiry_date).toLocaleDateString()}</p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleReject(donation.id)}
                >
                  Reject
                </Button>
                <Button onClick={() => handleAccept(donation.id)}>Accept</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 
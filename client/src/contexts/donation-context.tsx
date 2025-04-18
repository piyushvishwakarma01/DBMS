import { createContext, useContext, useCallback } from "react"
import { useQuery, useMutation } from "@/hooks/use-query"
import { donorService } from "@/services/donor-service"
import { ngoService } from "@/services/ngo-service"
import { volunteerService } from "@/services/volunteer-service"
import { useAuth } from "@/hooks/useAuth"

interface DonationContextType {
  donations: any[]
  assignments: any[]
  loading: boolean
  error: Error | null
  createDonation: (data: any) => Promise<void>
  acceptDonation: (id: string) => Promise<void>
  acceptAssignment: (id: string) => Promise<void>
  updateAssignmentStatus: (id: string, status: string) => Promise<void>
}

const DonationContext = createContext<DonationContextType | undefined>(undefined)

export function DonationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const role = user?.user_metadata?.role

  const {
    data: donations = [],
    isLoading: donationsLoading,
    error: donationsError,
  } = useQuery(
    ["donations", role],
    () => {
      switch (role) {
        case "donor":
          return donorService.getDonations()
        case "ngo":
          return ngoService.getAvailableDonations()
        default:
          return []
      }
    },
    { enabled: !!role }
  )

  const {
    data: assignments = [],
    isLoading: assignmentsLoading,
    error: assignmentsError,
  } = useQuery(
    ["assignments", role],
    () => {
      switch (role) {
        case "volunteer":
          return volunteerService.getMyAssignments()
        default:
          return []
      }
    },
    { enabled: role === "volunteer" }
  )

  const { mutateAsync: createDonation } = useMutation(
    (data: any) => donorService.createDonation(data),
    {
      showSuccessToast: true,
      successMessage: "Donation created successfully",
    }
  )

  const { mutateAsync: acceptDonation } = useMutation(
    (id: string) => ngoService.acceptDonation(id),
    {
      showSuccessToast: true,
      successMessage: "Donation accepted successfully",
    }
  )

  const { mutateAsync: acceptAssignment } = useMutation(
    (id: string) => volunteerService.acceptAssignment(id),
    {
      showSuccessToast: true,
      successMessage: "Assignment accepted successfully",
    }
  )

  const { mutateAsync: updateAssignmentStatus } = useMutation(
    ({ id, status }: { id: string; status: string }) =>
      volunteerService.updateAssignmentStatus(id, status as any),
    {
      showSuccessToast: true,
      successMessage: "Assignment status updated successfully",
    }
  )

  const value = {
    donations,
    assignments,
    loading: donationsLoading || assignmentsLoading,
    error: donationsError || assignmentsError,
    createDonation,
    acceptDonation,
    acceptAssignment,
    updateAssignmentStatus: async (id: string, status: string) =>
      updateAssignmentStatus({ id, status }),
  }

  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  )
}

export function useDonations() {
  const context = useContext(DonationContext)
  if (context === undefined) {
    throw new Error("useDonations must be used within a DonationProvider")
  }
  return context
}
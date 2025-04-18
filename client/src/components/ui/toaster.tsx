import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        className: "rounded-lg border bg-background text-foreground",
      }}
    />
  )
}
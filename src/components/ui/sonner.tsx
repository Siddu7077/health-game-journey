
"use client"

import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner"

const Toaster = ({
  ...props
}: React.ComponentProps<typeof SonnerToaster>) => {
  return (
    <SonnerToaster
      theme="light" 
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

// Re-export the toast function for use in the application
export { Toaster, toast as toast } from "sonner"

export const useToast = () => {
  return { toast: sonnerToast }
}


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

// Re-export the toast function from sonner
export { Toaster, toast } from "sonner"

// Export the useToast hook that returns the properly typed toast function
export const useToast = () => {
  return { toast: sonnerToast }
}

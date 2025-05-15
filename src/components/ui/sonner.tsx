
"use client"

import { Toaster as SonnerToaster, toast } from "sonner"

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

const useToast = () => {
  return {
    toast,
    dismiss: toast.dismiss,
  }
}

export { Toaster, toast, useToast }

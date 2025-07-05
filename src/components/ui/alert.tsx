import type React from "react"
import { cn } from "@/lib/utils"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive"
}

export function Alert({ className, variant = "default", ...props }: AlertProps) {
  const variants = {
    default: "bg-white border-gray-200 text-gray-900",
    destructive: "bg-red-50 border-red-200 text-red-900",
  }

  return (
    <div className={cn("relative w-full rounded-lg border p-4 shadow-sm", variants[variant], className)} {...props} />
  )
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
}

"use client"

import { type ComponentProps, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

export function SubmitButton({
  isSubmitting = false,
  children,
  ...props
}: {
  isSubmitting?: boolean;
  children?: ReactNode;
} & ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      type={props.type ?? "submit"}
      disabled={props.disabled ?? isSubmitting}
      className={props.className ?? "w-full"}
    >
      {isSubmitting ? <Loader2Icon className="animate-spin" /> : children}
    </Button>
  );
}

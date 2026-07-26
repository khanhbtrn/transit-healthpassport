"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function ConsentModal({
  open,
  onOpenChange,
  checked,
  onCheckedChange,
  onConfirm,
  title,
  description,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label className="flex items-start gap-3 text-sm">
            <Checkbox
              checked={checked}
              onCheckedChange={onCheckedChange}
              id="consent"
            />
            <span>
              I understand TransitH listens only with permission, and extracted
              medical facts will not be saved until I review and approve them.
            </span>
          </label>
          <p className="text-xs text-muted-foreground">
            TransitH organises information and prepares actions. It does not
            replace qualified medical professionals.
          </p>
          <Button disabled={!checked} onClick={onConfirm} className="w-full">
            Continue with consent
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

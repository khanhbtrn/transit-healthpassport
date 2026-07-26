"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function ShareModal({
  open,
  onOpenChange,
  consent,
  onConsentChange,
  onShare,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consent: boolean;
  onConsentChange: (value: boolean) => void;
  onShare: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share secure handoff</DialogTitle>
          <DialogDescription>
            This is a simulated sharing panel for the demo. No real clinical
            sharing infrastructure is active unless explicitly configured.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="rounded-2xl bg-muted p-4">
            <p>
              <span className="text-muted-foreground">Expiring link:</span>{" "}
              https://transit.app/share/demo-maria-7f3a
            </p>
            <p className="mt-2">
              <span className="text-muted-foreground">Access code:</span> 482193
            </p>
            <p className="mt-2">
              <span className="text-muted-foreground">Expires:</span> 28 July
              2026
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>Clinical summary</Badge>
            <Badge>Spanish translation</Badge>
            <Badge>Blood results</Badge>
            <Badge>Prescription</Badge>
          </div>
          <label className="flex items-start gap-3">
            <Checkbox
              checked={consent}
              onCheckedChange={onConsentChange}
              id="share-consent"
            />
            <span>
              I consent to share the selected handoff materials with my chosen
              care pathway for continuity of care.
            </span>
          </label>
          <div className="rounded-2xl border border-border p-3 text-xs text-muted-foreground">
            Access log preview: link created · awaiting first open · demo mode
          </div>
          <Button disabled={!consent} onClick={onShare} className="w-full">
            Create simulated secure share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BriefCard } from "@/components/brief-card";
import type { BookingRequest } from "@/lib/schema";

function when(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

export function RequestsClient({ requests }: { requests: BookingRequest[] }) {
  return (
    <Accordion type="multiple">
      {requests.map((request) => (
        <AccordionItem key={request.id} value={request.id} data-testid="request-row">
          <AccordionTrigger>
            <span className="flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-sm text-ink-accent">{request.id}</span>
              <span className="text-sm font-medium">{request.name}</span>
              <span className="text-xs text-ink-muted">
                {request.style} · {request.placement} · {request.budget}
              </span>
              <span className="ml-auto text-xs text-ink-muted">
                {when(request.createdAt)}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="mb-4 text-sm italic leading-relaxed text-ink-muted">
              “{request.description}”
            </p>
            <div data-testid="row-brief">
              <BriefCard brief={request.brief} />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

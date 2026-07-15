"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/seed/faq";

export function FaqClient({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible defaultValue={items[0]?.id}>
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} data-testid="faq-item">
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>
            <p data-testid="faq-answer">{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

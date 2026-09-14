import type { FaqCategory } from "@/types";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/schema";

export function Faq({ categories }: { categories: FaqCategory[] }) {
  return (
    <div className="space-y-10">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className="font-heading text-lg font-semibold text-navy">{category.name}</h3>
          <div className="mt-4 divide-y divide-border border-t border-border">
            {category.items.map((item) => (
              <details key={item.question} className="group py-4">
                <summary className="cursor-pointer list-none font-medium text-charcoal marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {item.question}
                    <span className="text-gold group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      ))}
      <JsonLd data={faqSchema(categories)} />
    </div>
  );
}

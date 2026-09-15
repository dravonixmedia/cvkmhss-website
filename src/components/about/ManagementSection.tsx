import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { staggerDelay } from "@/lib/stagger";
import type { ManagementMemberRow } from "@/lib/supabase/database.types";

export interface ManagementDisplayMember {
  member: ManagementMemberRow;
  photoUrl: string | null;
}

/**
 * Editorial portrait presentation for published Management & Leadership
 * members — a single alternating-side list rather than a repeating
 * card grid, so it reads at any count (1 to many) without looking like a
 * generic "our team" directory. Featured members (admin-controlled,
 * never inferred from designation) get a larger portrait and name size;
 * everyone else reads at a consistent, still-editorial scale.
 *
 * Renders nothing at all when there are no published members — no empty
 * state, no placeholder people. The surrounding About page keeps working
 * unchanged either way.
 */
export function ManagementSection({ members }: { members: ManagementDisplayMember[] }) {
  if (members.length === 0) return null;

  return (
    <section className="border-t border-border py-16 sm:py-20">
      <Container className="max-w-4xl">
        <Reveal variant="fadeUp">
          <SectionHeading eyebrow="Leadership" title="Management & Leadership" />
        </Reveal>

        <div className="mt-14 space-y-16">
          {members.map(({ member, photoUrl }, index) => (
            <Reveal key={member.id} variant="fadeUp" delay={staggerDelay(index, 90)}>
              <ManagementMemberEntry member={member} photoUrl={photoUrl} reverse={index % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ManagementMemberEntry({
  member,
  photoUrl,
  reverse,
}: {
  member: ManagementMemberRow;
  photoUrl: string | null;
  reverse: boolean;
}) {
  const altText = `${member.full_name} — ${member.designation}, C V K M Higher Secondary School`;

  return (
    <div
      className={`flex flex-col gap-8 border-t border-border pt-10 first:border-t-0 first:pt-0 sm:flex-row sm:items-start ${
        reverse ? "sm:flex-row-reverse" : ""
      }`}
    >
      <div className={`w-full shrink-0 ${member.is_featured ? "sm:w-64" : "sm:w-44"}`}>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-off-white">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={altText}
              fill
              sizes="(min-width: 640px) 256px, 100vw"
              className="object-cover"
            />
          ) : (
            <PhotoPlaceholder
              caption={member.full_name}
              tone="navy"
              compact
              className="absolute inset-0"
            />
          )}
        </div>
      </div>

      <div className="flex-1">
        <p className="text-xs font-semibold tracking-wide text-gold uppercase">{member.designation}</p>
        <h3
          className={`font-heading mt-2 font-bold text-navy ${
            member.is_featured ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {member.full_name}
        </h3>
        {member.short_bio && (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate">{member.short_bio}</p>
        )}
      </div>
    </div>
  );
}

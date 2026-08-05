import { Button, ButtonVariant, Icon } from "@/components/ui";
import type { ReservationCtaSection } from "@/lib/strapi";
import { SectionBackground, sectionBackground } from "@/lib/section-background";

export function ReservationCta({ s }: { s: ReservationCtaSection }) {
  return (
    <section
      id="rezervacia"
      className={`${sectionBackground(s.background, SectionBackground.Green)} px-6 py-20 text-center`}
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
        <Icon name="clock" size={28} className="text-gold-400" />
        <h2 className="font-display-alt text-[clamp(28px,4vw,40px)] font-semibold tracking-tight">{s.heading}</h2>
        {s.body && <p className="max-w-[48ch] text-[17px] text-current/85">{s.body}</p>}
        {s.button && (
          <Button variant={s.button.variant ?? ButtonVariant.Gold} href={s.button.href}>
            {s.button.label}
          </Button>
        )}
      </div>
    </section>
  );
}

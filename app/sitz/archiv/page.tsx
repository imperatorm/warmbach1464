"use client";

import { ArchivePlaque } from "@/components/sitz/ArchivePlaque";
import { useCurrentMember } from "@/lib/founders/MemberContext";
import { Reveal } from "@/components/ui/Reveal";

export default function ArchivPage() {
  const member = useCurrentMember();
  return (
    <div>
      <Reveal>
        <p className="t-label">Hofarchiv</p>
        <h1 className="t-h1 text-cream mt-3">Ihr Platz, in Bronze.</h1>
      </Reveal>
      <div className="mt-14">
        <ArchivePlaque member={member} />
      </div>
    </div>
  );
}

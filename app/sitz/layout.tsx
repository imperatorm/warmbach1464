"use client";

import { useMember } from "@/lib/founders/useMember";
import { MemberProvider } from "@/lib/founders/MemberContext";
import { MemberGate } from "@/components/sitz/MemberGate";
import { SitzShell } from "@/components/sitz/SitzShell";

export default function SitzLayout({ children }: { children: React.ReactNode }) {
  const { member, ready } = useMember();

  if (!ready) return <div className="min-h-screen bg-night" />; // avoid gate flash pre-hydration
  if (!member) return <MemberGate />;

  return (
    <MemberProvider member={member}>
      <SitzShell member={member}>{children}</SitzShell>
    </MemberProvider>
  );
}

"use client";

import { createContext, useContext } from "react";
import type { Member } from "./types";

const MemberContext = createContext<Member | null>(null);

/** Provides the resolved logged-in member to the gated portal subtree. */
export function MemberProvider({
  member,
  children,
}: {
  member: Member;
  children: React.ReactNode;
}) {
  return <MemberContext.Provider value={member}>{children}</MemberContext.Provider>;
}

/** The currently logged-in member. Must be used inside the gated portal layout. */
export function useCurrentMember(): Member {
  const member = useContext(MemberContext);
  if (!member) throw new Error("useCurrentMember must be used within MemberProvider");
  return member;
}

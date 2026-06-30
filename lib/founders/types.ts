// Portal-Typen — die einzige Quelle der Wahrheit für „Der Sitz".
export type Privilege = "P1" | "P2" | "P3" | "P4" | "P5" | "P6" | "P7";

export type Member = {
  id: string; // "1464.0007"
  name: string;
  seatNo: number; // 1..464
  joinedYear: number;
  accessCode: string; // Demo-Code; später durch echtes Auth ersetzt
  privileges: Privilege[];
};

export type PhaseStatus = "done" | "current" | "upcoming";
export type Phase = {
  key: string;
  label: string;
  dateLabel: string; // menschlich, z. B. "Mai 2026" / "Q4 2027"
  status: PhaseStatus;
};

export type ReleasePipeline = {
  phases: Phase[];
  fillStartISO: string; // "2026-05-01"
  targetReleaseISO: string; // repräsentativ, Q4 2027
  targetReleaseLabel: string; // "Q4 2027 (geplant)"
};

export type AvailabilityStatus = "reserviert" | "freigegeben" | "zugeteilt";
export type AvailabilityItem = {
  edition: string;
  total: number | null; // null = keine feste Auflage
  reservedForYou: number;
  status: AvailabilityStatus;
  note: string;
  firstAccessWindowDays: number; // P1 = 14
};

export type EventRsvp = "offen" | "angefragt";
export type EventItem = {
  title: string;
  dateLabel: string; // keine erfundenen exakten Daten
  time: string; // "15:04"
  location: string;
  kind: string;
  capacityNote: string;
  rsvp: EventRsvp;
};

export type RequestKind = "flasche" | "gasthof";
export type RequestStatus = "entwurf" | "angefragt" | "bestaetigt";
export type MemberRequest = {
  kind: RequestKind;
  subject: string;
  dateLabel?: string;
  status: RequestStatus;
};

export type ConciergeMessage = {
  from: "member" | "concierge";
  text: string;
  dateLabel: string;
};

export type GasthofState = { year: number; used: boolean };

export type FoundersData = {
  members: Member[];
  pipeline: ReleasePipeline;
  availability: AvailabilityItem[];
  events: EventItem[];
  requests: MemberRequest[];
  concierge: ConciergeMessage[];
  gasthof: GasthofState;
};

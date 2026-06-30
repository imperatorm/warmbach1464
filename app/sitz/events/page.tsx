import { foundersData } from "@/lib/founders/data";
import { EventsList } from "@/components/sitz/EventsList";
import { Reveal } from "@/components/ui/Reveal";

export default function EventsPage() {
  return (
    <div>
      <Reveal>
        <p className="t-label">Events</p>
        <h1 className="t-h1 text-cream mt-3">Der Sitzkreis trifft sich.</h1>
        <p className="t-lead mt-5 max-w-xl">
          Tastings beginnen um 15:04 — „14:64", wenn die Stunde 64 Minuten hätte.
        </p>
      </Reveal>
      <div className="mt-14">
        <EventsList events={foundersData.events} />
      </div>
    </div>
  );
}

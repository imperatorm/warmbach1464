import { foundersData } from "@/lib/founders/data";
import { AvailabilityLedger } from "@/components/sitz/AvailabilityLedger";
import { Reveal } from "@/components/ui/Reveal";

export default function VerfuegbarkeitPage() {
  return (
    <div>
      <Reveal>
        <p className="t-label">Verfügbarkeit & Allokation</p>
        <h1 className="t-h1 text-cream mt-3">Was für Sie reserviert ist.</h1>
        <p className="t-lead mt-5 max-w-xl">
          Sitz vor Markt. Ihre Allokation erscheint 14 Tage vor jedem öffentlichen Verkauf (P1).
        </p>
      </Reveal>
      <div className="mt-14">
        <AvailabilityLedger items={foundersData.availability} />
      </div>
    </div>
  );
}

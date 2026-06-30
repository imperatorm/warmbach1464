import { foundersData } from "@/lib/founders/data";
import { ReleaseTimeline } from "@/components/sitz/ReleaseTimeline";
import { Reveal } from "@/components/ui/Reveal";

export default function WegPage() {
  return (
    <div>
      <Reveal>
        <p className="t-label">Der Weg zum Release</p>
        <h1 className="t-h1 text-cream mt-3">Vom Apfel zum Sitz.</h1>
        <p className="t-lead mt-5 max-w-xl">
          Wo der Brand gerade steht — und wie lange bis zur Allokation an Ihren Sitz.
        </p>
      </Reveal>
      <div className="mt-14">
        <ReleaseTimeline pipeline={foundersData.pipeline} />
      </div>
    </div>
  );
}

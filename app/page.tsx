import { HeroSection } from "@/components/sections/HeroSection";
import { PortalGateway } from "@/components/sections/PortalGateway";
import { ChronicleSection } from "@/components/sections/ChronicleSection";

/**
 * Home = Portal. The bottle, one statement, a quiet doorway into the house,
 * and — at the very bottom — the interactive Hofchronik (1464–today) with the
 * holographic chronometer pair.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PortalGateway />
      <ChronicleSection />
    </>
  );
}

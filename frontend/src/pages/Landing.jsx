import { useState } from "react";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Intro } from "@/components/site/Intro";
import { Machines } from "@/components/site/Machines";
import { Featured } from "@/components/site/Featured";
import { Results } from "@/components/site/Results";
import { Pillars } from "@/components/site/Pillars";
import { About } from "@/components/site/About";
import { Challenges } from "@/components/site/Challenges";
import { Bento } from "@/components/site/Bento";
import { Series } from "@/components/site/Series";
import { Comparison } from "@/components/site/Comparison";
import { Roi } from "@/components/site/Roi";
import { Process } from "@/components/site/Process";
import { Faq } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { LegalDialog } from "@/components/site/Legal";
import { CallbackWidget } from "@/components/site/CallbackWidget";
import { LangProvider } from "@/i18n";

export default function Landing() {
  const [legal, setLegal] = useState(null);
  return (
    <LangProvider>
    <div className="grain overflow-x-clip" data-testid="landing-page">
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Machines />
        <Featured />
        <Results />
        <Pillars />
        <Series />
        <Comparison />
        <Roi />
        <Process />
        <About />
        <Challenges />
        <Bento />
        <Faq />
        <Contact onLegal={setLegal} />
      </main>
      <Footer onLegal={setLegal} />
      <LegalDialog open={legal} onClose={() => setLegal(null)} />
      <CallbackWidget onLegal={setLegal} />
    </div>
    </LangProvider>
  );
}

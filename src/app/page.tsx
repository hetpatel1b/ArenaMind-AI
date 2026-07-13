import { Hero } from './components/landing/Hero';
import { Problem } from './components/landing/Problem';
import { Solution } from './components/landing/Solution';
import { CommandCenterPreview } from './components/landing/CommandCenterPreview';
import { AiWorkflow } from './components/landing/AiWorkflow';
import { CoreCapabilities } from './components/landing/CoreCapabilities';
import { Technology } from './components/landing/Technology';
import { Metrics } from './components/landing/Metrics';
import { Footer } from './components/landing/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <Problem />
      <Solution />
      <CommandCenterPreview />
      <AiWorkflow />
      <CoreCapabilities />
      <Technology />
      <Metrics />
      <Footer />
    </main>
  );
}

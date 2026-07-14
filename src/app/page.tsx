import { Hero } from './components/landing/Hero';
import { Footer } from './components/landing/Footer';
import { StartupProvider } from './components/startup/StartupProvider';
import { StartupOverlay } from './components/startup/StartupOverlay';
import { LandingNavbar } from './components/landing/LandingNavbar';

// Background & Motion
import { LandingBackground } from './components/landing/LandingBackground';
import { EnterpriseCursor } from './components/motion/EnterpriseCursor';
import { SectionTransition } from './components/motion/SectionTransition';
import { SignalPropagation } from './components/motion/SignalPropagation';

// Story Components
import { StoryIntroduction } from './components/landing/story/StoryIntroduction';
import { StoryStadiumScale } from './components/landing/story/StoryStadiumScale';
import { StoryLegacyFailure } from './components/landing/story/StoryLegacyFailure';
import { StoryAiReasoning } from './components/landing/story/StoryAiReasoning';
import { StoryTrustLayer } from './components/landing/story/StoryTrustLayer';
import { StoryBentoCapabilities } from './components/landing/story/StoryBentoCapabilities';
import { StoryArchitecture } from './components/landing/story/StoryArchitecture';
import { StoryEnterpriseReady } from './components/landing/story/StoryEnterpriseReady';
import { StoryFinalCta } from './components/landing/story/StoryFinalCta';

export default function Home() {
  return (
    <StartupProvider>
      <StartupOverlay />
      <EnterpriseCursor />
      <LandingBackground />
      <LandingNavbar />
      <main style={{ position: 'relative', zIndex: 1, overflowX: 'hidden' }}>
        <SignalPropagation />
        <Hero />

        <SectionTransition type="reveal">
          <StoryIntroduction />
        </SectionTransition>

        <SectionTransition type="camera-push">
          <StoryStadiumScale />
        </SectionTransition>

        <SectionTransition type="depth-shift">
          <StoryLegacyFailure />
        </SectionTransition>

        <SectionTransition type="reveal">
          <StoryAiReasoning />
        </SectionTransition>

        <SectionTransition type="fade-up">
          <StoryTrustLayer />
        </SectionTransition>

        <SectionTransition type="camera-push">
          <StoryBentoCapabilities />
        </SectionTransition>

        <SectionTransition type="depth-shift">
          <StoryArchitecture />
        </SectionTransition>

        <SectionTransition type="reveal">
          <StoryEnterpriseReady />
        </SectionTransition>

        <SectionTransition type="camera-push">
          <StoryFinalCta />
        </SectionTransition>

        <Footer />
      </main>
    </StartupProvider>
  );
}

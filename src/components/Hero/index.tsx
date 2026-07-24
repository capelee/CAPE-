import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { MotionValue } from 'motion/react';
import { HeroText } from './HeroText';
import { HeroMascot } from './HeroMascot';
import { DraggableCan } from './DraggableCan';
import { TutorialTooltip } from '../TutorialTooltip';

export interface HeroSectionRef {
  setHeroParticles: React.Dispatch<React.SetStateAction<any[]>>;
  setTitleBounceTrigger: React.Dispatch<React.SetStateAction<number>>;
}

interface HeroSectionProps {
  theme: "dark" | "light" | "sepia";
  profile: any;
  incrementInteraction: () => void;
  handlePdfClick: () => void;
  scrollToElement: (id: string) => void;
  setCategory: (cat: string) => void;
  mascotRef: React.RefObject<HTMLDivElement>;
  mascotY: MotionValue<number>;
  glowY: MotionValue<number>;
  elementsY: MotionValue<number>;
  elementsY2: MotionValue<number>;
  rotateElement1: MotionValue<number>;
  rotateElement2: MotionValue<number>;
  isMagicTransformed: boolean;
  isHeroSpeaking: boolean;
  showHeroDialogue: boolean;
  displayedDialogue: string;
  handleHeroClick: () => void;
  onMascotDrag?: () => void;
  tutorialStep: number;
  tutorialDismissed5: boolean;
  setTutorialDismissed5: (val: boolean) => void;
  tutorialDismissed6: boolean;
  setTutorialDismissed6: (val: boolean) => void;
  nextTutorialStep: () => void;
  canRef: React.RefObject<HTMLDivElement>;
  canX: MotionValue<number>;
  canY: MotionValue<number>;
  canRotate: MotionValue<number>;
  canFlavor: string;
  handleCanDragStart: (e: any, info: any) => void;
  handleCanDrag: (e: any, info: any) => void;
  handleCanDragEnd: (e: any, info: any) => void;
  handleCanTap: () => void;
  onRandomProject?: () => void;
  onMagicPaletteClick?: (clientX: number, clientY: number) => void;
  showCan: boolean;
}

export const HeroSection = forwardRef<HeroSectionRef, HeroSectionProps>(({
  theme,
  profile,
  incrementInteraction,
  handlePdfClick,
  scrollToElement,
  setCategory,
  mascotRef,
  mascotY,
  glowY,
  elementsY,
  elementsY2,
  rotateElement1,
  rotateElement2,
  isMagicTransformed,
  isHeroSpeaking,
  showHeroDialogue,
  displayedDialogue,
  handleHeroClick,
  onMascotDrag,
  tutorialStep,
  tutorialDismissed5,
  setTutorialDismissed5,
  tutorialDismissed6,
  setTutorialDismissed6,
  nextTutorialStep,
  canRef,
  canX,
  canY,
  canRotate,
  canFlavor,
  handleCanDragStart,
  handleCanDrag,
  handleCanDragEnd,
  handleCanTap,
  onRandomProject,
  onMagicPaletteClick,
  showCan
}, ref) => {
  const [titleBounceTrigger, setTitleBounceTrigger] = useState(0);
  const [heroParticles, setHeroParticles] = useState<any[]>([]);

  useImperativeHandle(ref, () => ({
    setHeroParticles,
    setTitleBounceTrigger
  }));

  return (
    <section id="hero-minimalist" className="relative pt-4 pb-8 md:pt-10 md:pb-14 overflow-visible flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 border-b border-zinc-150/50 dark:border-white/5 scroll-mt-[48px] md:scroll-mt-[58px]">
      <HeroText
        theme={theme}
        titleBounceTrigger={titleBounceTrigger}
        profile={profile}
        incrementInteraction={incrementInteraction}
        handlePdfClick={handlePdfClick}
        scrollToElement={scrollToElement}
        setCategory={setCategory}
      />
      
      <HeroMascot
        theme={theme}
        mascotRef={mascotRef}
        mascotY={mascotY}
        glowY={glowY}
        elementsY={elementsY}
        elementsY2={elementsY2}
        rotateElement1={rotateElement1}
        rotateElement2={rotateElement2}
        heroParticles={heroParticles}
        setHeroParticles={setHeroParticles}
        isMagicTransformed={isMagicTransformed}
        isHeroSpeaking={isHeroSpeaking}
        showHeroDialogue={showHeroDialogue}
        scrollToElement={scrollToElement}
        setCategory={setCategory}
        displayedDialogue={displayedDialogue}
        handleHeroClick={handleHeroClick}
        onMascotDrag={onMascotDrag}
        tutorialStep={tutorialStep}
        tutorialDismissed5={tutorialDismissed5}
        setTutorialDismissed5={setTutorialDismissed5}
        nextTutorialStep={nextTutorialStep}
        onRandomProject={onRandomProject}
        onMagicPaletteClick={onMagicPaletteClick}
      />

      {showCan && tutorialStep >= 4 && tutorialStep <= 8 && !tutorialDismissed6 && (
        <TutorialTooltip 
          key={`tutorial-step-6-${tutorialStep}`}
          step={6}
          text="試著滑動罐罐"
          theme={theme}
          onClick={() => { setTutorialDismissed6(true); nextTutorialStep(); }}
          pointerDirection="right"
          className="absolute top-2 right-16 z-[100]"
        />
      )}
      
      {showCan && (
        <DraggableCan
          canRef={canRef}
          canX={canX}
          canY={canY}
          canRotate={canRotate}
          canFlavor={canFlavor}
          handleCanDragStart={handleCanDragStart}
          handleCanDrag={handleCanDrag}
          handleCanDragEnd={handleCanDragEnd}
          handleCanTap={handleCanTap}
        />
      )}
    </section>
  );
});

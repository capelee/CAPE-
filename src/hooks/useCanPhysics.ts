import React, { useState, useRef } from "react";
import { useMotionValue, animate } from "motion/react";
import { FLAVOR_PHYSICS } from "../utils/flavorPhysics";
import { playCanClinkSound } from "../utils/audioEffects";

interface UseCanPhysicsProps {
  mascotRef: React.RefObject<HTMLDivElement | null>;
  canRef: React.RefObject<HTMLDivElement | null>;
  onFeedMascot: (flavor: "tuna" | "chicken" | "luxury") => void;
  tutorialStep?: number;
  tutorialDismissed6?: boolean;
  setTutorialDismissed6?: (val: boolean) => void;
  nextTutorialStep?: () => void;
}

export function useCanPhysics({
  mascotRef,
  canRef,
  onFeedMascot,
  tutorialStep = 0,
  tutorialDismissed6 = false,
  setTutorialDismissed6,
  nextTutorialStep,
}: UseCanPhysicsProps) {
  const canX = useMotionValue(0);
  const canY = useMotionValue(0);
  const canRotate = useMotionValue(0);
  const canPhysicsId = useRef<number | null>(null);

  const [canFlavor, setCanFlavor] = useState<"tuna" | "chicken" | "luxury">("luxury");

  const handleCanDragStart = () => {
    if (tutorialStep >= 4 && tutorialStep <= 8 && !tutorialDismissed6) {
      if (setTutorialDismissed6) setTutorialDismissed6(true);
      if (nextTutorialStep) nextTutorialStep();
    }
    if (canPhysicsId.current !== null) {
      cancelAnimationFrame(canPhysicsId.current);
      canPhysicsId.current = null;
    }
  };

  const handleCanTap = () => {
    setCanFlavor((prev) => {
      if (prev === "tuna") return "chicken";
      if (prev === "chicken") return "luxury";
      return "tuna";
    });
  };

  const handleCanDragEnd = (_event: any, info: any) => {
    if (!canRef.current) return;

    // Check collision with mascot
    if (mascotRef.current) {
      const rect = mascotRef.current.getBoundingClientRect();
      const px = info.point.x;
      const py = info.point.y;

      const padding = 15;
      if (
        px >= rect.left - padding &&
        px <= rect.right + padding &&
        py >= rect.top - padding &&
        py <= rect.bottom + padding
      ) {
        onFeedMascot(canFlavor);
        animate(canX, 0, { type: "spring", stiffness: 200, damping: 18 });
        animate(canY, 0, { type: "spring", stiffness: 200, damping: 18 });
        return;
      }
    }

    // Custom Physics Loop for bouncing off the edge of screen with angular momentum
    const flavorConfig = FLAVOR_PHYSICS[canFlavor] || FLAVOR_PHYSICS.luxury;
    const elasticity = flavorConfig.elasticity || 0.65;
    const rotFactor = flavorConfig.rotationalInertia || 0.8;

    const rect = canRef.current.getBoundingClientRect();
    const curX = canX.get();
    const curY = canY.get();
    const curRot = canRotate.get();

    const startX = rect.left - curX;
    const startY = rect.top - curY;
    const canWidth = rect.width || 48;
    const canHeight = rect.height || 48;

    const vx = info.velocity.x;
    const vy = info.velocity.y;

    let velX = vx / 60;
    let velY = vy / 60;
    let rotVel = velX * 0.55 * rotFactor;

    let posX = curX;
    let posY = curY;
    let posRot = curRot;

    if (Math.sqrt(velX * velX + velY * velY) < 1.0) {
      return;
    }

    let lastFrameTime = performance.now();

    const updatePhysics = (timestamp: number) => {
      const dt = Math.min((timestamp - lastFrameTime) / 16.666, 3);
      lastFrameTime = timestamp;

      posX += velX * dt;
      posY += velY * dt;
      posRot += rotVel * dt;

      const margin = 10;
      const minX = -startX + margin;
      const maxX = (typeof window !== "undefined" ? window.innerWidth : 1200) - startX - canWidth - margin;
      const minY = -startY + margin;
      const maxY = (typeof window !== "undefined" ? window.innerHeight : 800) - startY - canHeight - margin;

      let bounced = false;

      if (posX < minX) {
        posX = minX;
        velX = -velX * elasticity;
        rotVel += velY * 1.5 * rotFactor;
        bounced = true;
      } else if (posX > maxX) {
        posX = maxX;
        velX = -velX * elasticity;
        rotVel -= velY * 1.5 * rotFactor;
        bounced = true;
      }

      if (posY < minY) {
        posY = minY;
        velY = -velY * elasticity;
        rotVel -= velX * 1.5 * rotFactor;
        bounced = true;
      } else if (posY > maxY) {
        posY = maxY;
        velY = -velY * elasticity;
        rotVel += velX * 1.5 * rotFactor;
        bounced = true;
      }

      if (bounced) {
        try {
          playCanClinkSound();
        } catch (e) {}
      }

      canX.set(posX);
      canY.set(posY);
      canRotate.set(posRot);

      velX *= Math.pow(0.965, dt);
      velY *= Math.pow(0.965, dt);
      rotVel *= Math.pow(0.955, dt);

      const linearSpeed = Math.sqrt(velX * velX + velY * velY);
      const angularSpeed = Math.abs(rotVel);
      if (linearSpeed > 0.18 || angularSpeed > 0.18) {
        canPhysicsId.current = requestAnimationFrame(updatePhysics);
      } else {
        canPhysicsId.current = null;
      }
    };

    if (canPhysicsId.current !== null) {
      cancelAnimationFrame(canPhysicsId.current);
    }
    canPhysicsId.current = requestAnimationFrame(updatePhysics);
  };

  return {
    canX,
    canY,
    canRotate,
    canFlavor,
    setCanFlavor,
    handleCanTap,
    handleCanDragStart,
    handleCanDragEnd,
  };
}

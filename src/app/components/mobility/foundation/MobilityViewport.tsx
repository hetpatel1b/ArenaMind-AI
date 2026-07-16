'use client';

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { motion } from 'framer-motion';

export interface ViewportTransform {
  x: number;
  y: number;
  scale: number;
}

export interface MobilityViewportProps {
  children: React.ReactNode;
  worldWidth: number;
  worldHeight: number;
  onTransformChange?: (transform: ViewportTransform) => void;
}

export interface MobilityViewportRef {
  flyTo: (x: number, y: number, scale: number) => void;
  fitToScreen: () => void;
  getTransform: () => ViewportTransform;
}

export const MobilityViewport = forwardRef<MobilityViewportRef, MobilityViewportProps>(
  function MobilityViewport({ children, worldWidth, worldHeight, onTransformChange }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const worldRef = useRef<HTMLDivElement>(null);
    const hudRef = useRef<HTMLDivElement>(null);

    // High performance DOM state
    const t = useRef<ViewportTransform>({ x: 0, y: 0, scale: 1 });
    const target = useRef<ViewportTransform>({ x: 0, y: 0, scale: 1 });

    // Physics
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const isFlying = useRef(false);

    // Spring constants for flyTo
    const tension = 120;
    const friction = 20;
    const velocity = useRef({ x: 0, y: 0, scale: 0 });

    const applyTransform = useCallback(() => {
      if (worldRef.current) {
        worldRef.current.style.transform = `translate3d(${t.current.x}px, ${t.current.y}px, 0) scale(${t.current.scale})`;
      }
      if (onTransformChange) {
        onTransformChange(t.current);
      }
    }, [onTransformChange]);

    // Animation Loop
    useEffect(() => {
      let rafId: number;
      let lastTime = performance.now();
      let frames = 0;
      let lastFpsTime = lastTime;

      const loop = (time: number) => {
        const dt = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;

        frames++;
        if (time - lastFpsTime >= 1000) {
          const fps = Math.round((frames * 1000) / (time - lastFpsTime));
          frames = 0;
          lastFpsTime = time;
          if (hudRef.current) {
            hudRef.current.innerText = `FPS: ${fps} | X: ${Math.round(t.current.x)} Y: ${Math.round(t.current.y)} | Scale: ${Math.round(t.current.scale * 100)}%`;
          }
        }

        if (isFlying.current) {
          // Spring physics to target
          const dx = target.current.x - t.current.x;
          const dy = target.current.y - t.current.y;
          const ds = target.current.scale - t.current.scale;

          const ax = dx * tension - velocity.current.x * friction;
          const ay = dy * tension - velocity.current.y * friction;
          const as = ds * tension - velocity.current.scale * friction;

          velocity.current.x += ax * dt;
          velocity.current.y += ay * dt;
          velocity.current.scale += as * dt;

          t.current.x += velocity.current.x * dt;
          t.current.y += velocity.current.y * dt;
          t.current.scale += velocity.current.scale * dt;

          if (
            Math.abs(dx) < 0.5 &&
            Math.abs(dy) < 0.5 &&
            Math.abs(ds) < 0.005 &&
            Math.abs(velocity.current.x) < 0.1 &&
            Math.abs(velocity.current.y) < 0.1 &&
            Math.abs(velocity.current.scale) < 0.001
          ) {
            t.current.x = target.current.x;
            t.current.y = target.current.y;
            t.current.scale = target.current.scale;
            isFlying.current = false;
          }
          applyTransform();
        }

        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    }, [applyTransform]);

    const handleWheel = useCallback(
      (e: React.WheelEvent) => {
        e.preventDefault();

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Stop flying
        isFlying.current = false;

        // Zoom logic
        const zoomSensitivity = 0.001;
        const delta = -e.deltaY * zoomSensitivity;
        let newScale = t.current.scale * Math.exp(delta);

        // Clamp scale
        newScale = Math.max(0.1, Math.min(newScale, 5));

        // Calculate new position to keep mouse centered
        const scaleRatio = newScale / t.current.scale;
        const newX = mouseX - (mouseX - t.current.x) * scaleRatio;
        const newY = mouseY - (mouseY - t.current.y) * scaleRatio;

        t.current = { x: newX, y: newY, scale: newScale };
        target.current = { ...t.current };
        applyTransform();
      },
      [applyTransform]
    );

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
      if (e.button !== 0 && e.button !== 1) return; // Left or Middle
      isDragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      isFlying.current = false;

      const container = containerRef.current;
      if (container) {
        container.setPointerCapture(e.pointerId);
        container.style.cursor = 'grabbing';
      }
    }, []);

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (!isDragging.current) return;

        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;

        lastPos.current = { x: e.clientX, y: e.clientY };

        t.current.x += dx;
        t.current.y += dy;
        target.current.x = t.current.x;
        target.current.y = t.current.y;

        applyTransform();
      },
      [applyTransform]
    );

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
      isDragging.current = false;
      const container = containerRef.current;
      if (container) {
        container.releasePointerCapture(e.pointerId);
        container.style.cursor = 'grab';
      }
    }, []);

    // Exposed API
    useImperativeHandle(ref, () => ({
      flyTo: (x: number, y: number, scale: number) => {
        target.current = { x, y, scale };
        isFlying.current = true;
      },
      fitToScreen: () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // Calculate scale to fit world inside container
        const scaleX = rect.width / worldWidth;
        const scaleY = rect.height / worldHeight;
        const scale = Math.min(scaleX, scaleY) * 0.95; // 95% fit

        // Center it
        const x = (rect.width - worldWidth * scale) / 2;
        const y = (rect.height - worldHeight * scale) / 2;

        target.current = { x, y, scale };
        isFlying.current = true;
      },
      getTransform: () => t.current,
    }));

    // Initial fit
    useEffect(() => {
      const timer = setTimeout(() => {
        if (ref && 'current' in ref && (ref as any).current) {
          (ref as any).current.fitToScreen();
          // Immediately apply without flying for the very first frame
          t.current = { ...target.current };
          applyTransform();
          isFlying.current = false;
        }
      }, 100);
      return () => clearTimeout(timer);
    }, [worldWidth, worldHeight, ref, applyTransform]);

    return (
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          touchAction: 'none',
          cursor: 'grab',
          background: 'var(--bg-default, #0D0F12)',
        }}
      >
        <div
          ref={worldRef}
          style={{
            position: 'absolute',
            width: worldWidth,
            height: worldHeight,
            transformOrigin: '0 0',
            willChange: 'transform',
          }}
        >
          {children}
        </div>

        {/* Simple HUD for debug/info */}
        <div
          ref={hudRef}
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            fontSize: '11px',
            color: '#10B981',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '6px 12px',
            borderRadius: '6px',
            fontFamily: 'monospace',
            pointerEvents: 'none',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          INITIALIZING VIEWPORT...
        </div>
      </div>
    );
  }
);

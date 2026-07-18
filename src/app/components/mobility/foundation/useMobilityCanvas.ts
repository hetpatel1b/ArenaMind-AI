import { useEffect, useRef } from 'react';
import { VehicleState, VehiclePhysics } from '@/lib/domain/VehiclePhysics';
import { VehicleRenderer } from '@/lib/domain/VehicleRenderer';

export function useMobilityCanvas(engineVehicles: any[], worldWidth: number, worldHeight: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vehiclesRef = useRef<VehicleState[]>([]);

  useEffect(() => {
    // We map engine vehicles to the VehicleState if needed, but since it's any[], we assume they match.
    // In a real TS strict environment, we'd cast properly. For now we assume they match.
    vehiclesRef.current = engineVehicles as unknown as VehicleState[];
  }, [engineVehicles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    canvas.width = worldWidth;
    canvas.height = worldHeight;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      VehicleRenderer.renderGrid(ctx, canvas.width, canvas.height);

      VehiclePhysics.updateVehiclesInPlace(vehiclesRef.current, canvas.width, canvas.height);

      VehicleRenderer.renderVehicles(ctx, vehiclesRef.current);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [worldWidth, worldHeight]);

  return { canvasRef };
}

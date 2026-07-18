import { VehicleState } from './VehiclePhysics';

export const VehicleRenderer = {
  renderVehicles(ctx: CanvasRenderingContext2D, vehicles: VehicleState[]): void {
    vehicles.forEach((v) => {
      ctx.save();
      ctx.translate(v.x, v.y);
      ctx.rotate((v.rotation * Math.PI) / 180);

      if (v.type === 'EMERGENCY') {
        ctx.fillStyle = '#EF4444';
        ctx.shadowColor = '#EF4444';
        ctx.shadowBlur = 15;
      } else if (v.type === 'BUS') {
        ctx.fillStyle = '#3B82F6';
        ctx.shadowColor = '#3B82F6';
        ctx.shadowBlur = 10;
      } else {
        ctx.fillStyle = '#10B981';
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-8, 6);
      ctx.lineTo(-8, -6);
      ctx.fill();
      ctx.restore();
    });
  },

  renderGrid(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 2;
    for (let i = 0; i < width; i += 100) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 100) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
  },
};

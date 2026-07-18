export interface VehicleState {
  x: number;
  y: number;
  rotation: number;
  speed: number;
  type: string;
}

export const VehiclePhysics = {
  calculateNextVehicleState(
    vehicle: VehicleState,
    worldWidth: number,
    worldHeight: number
  ): VehicleState {
    const nextVehicle = { ...vehicle };

    // Simple simulation movement
    nextVehicle.x += Math.cos((nextVehicle.rotation * Math.PI) / 180) * nextVehicle.speed;
    nextVehicle.y += Math.sin((nextVehicle.rotation * Math.PI) / 180) * nextVehicle.speed;

    // Wrap around bounds
    if (nextVehicle.x > worldWidth) nextVehicle.x = 0;
    if (nextVehicle.x < 0) nextVehicle.x = worldWidth;
    if (nextVehicle.y > worldHeight) nextVehicle.y = 0;
    if (nextVehicle.y < 0) nextVehicle.y = worldHeight;

    return nextVehicle;
  },

  updateVehiclesInPlace(vehicles: VehicleState[], worldWidth: number, worldHeight: number): void {
    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      if (!v) continue;

      v.x += Math.cos((v.rotation * Math.PI) / 180) * v.speed;
      v.y += Math.sin((v.rotation * Math.PI) / 180) * v.speed;

      if (v.x > worldWidth) v.x = 0;
      if (v.x < 0) v.x = worldWidth;
      if (v.y > worldHeight) v.y = 0;
      if (v.y < 0) v.y = worldHeight;
    }
  },
};

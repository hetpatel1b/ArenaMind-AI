export const ViewportEngine = {
  calculateWorldCoordinates(
    clientX: number,
    clientY: number,
    rectLeft: number,
    rectTop: number,
    minimapWidth: number,
    minimapHeight: number,
    worldWidth: number,
    worldHeight: number
  ) {
    const x = clientX - rectLeft;
    const y = clientY - rectTop;

    const worldX = (x / minimapWidth) * worldWidth;
    const worldY = (y / minimapHeight) * worldHeight;

    return { worldX, worldY };
  },

  calculateCenterTransform(
    worldX: number,
    worldY: number,
    scale: number,
    containerWidth: number = 1000,
    containerHeight: number = 800
  ) {
    // Offset by half container to center the point
    const targetX = -worldX * scale + containerWidth / 2;
    const targetY = -worldY * scale + containerHeight / 2;
    return { targetX, targetY };
  },
};

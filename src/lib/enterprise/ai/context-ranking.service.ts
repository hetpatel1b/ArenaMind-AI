export interface RankedContext {
  item: any;
  score: number;
}

export class ContextRankingService {
  rankContext(contextData: any): any {
    if (!contextData || typeof contextData !== 'object') {
      return contextData;
    }

    const rankedItems: RankedContext[] = [];

    // Analyze arrays or objects
    const extractAndScore = (data: any) => {
      if (Array.isArray(data)) {
        data.forEach((item) => {
          if (item && typeof item === 'object') {
            rankedItems.push({ item, score: this.calculateScore(item) });
          }
        });
      } else if (data && typeof data === 'object') {
        Object.entries(data).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => {
              if (v && typeof v === 'object') {
                rankedItems.push({ item: { [key]: v }, score: this.calculateScore(v) });
              }
            });
          } else if (value && typeof value === 'object') {
            rankedItems.push({ item: { [key]: value }, score: this.calculateScore(value) });
          }
        });
      }
    };

    extractAndScore(contextData);

    // Sort by highest score first
    rankedItems.sort((a, b) => b.score - a.score);

    // Take top N (e.g. top 10 items) or items with score > a threshold
    const topContext = rankedItems.filter((r) => r.score >= 50).map((r) => r.item);

    // If we extracted everything into arrays, we return the reconstructed high-value context
    return topContext.length > 0 ? topContext : contextData;
  }

  private calculateScore(item: any): number {
    let score = 50; // Default baseline

    const strObj = JSON.stringify(item).toLowerCase();

    // High priority keywords
    if (strObj.includes('incident') || strObj.includes('critical')) score += 50;
    if (strObj.includes('crowd risk') || strObj.includes('danger')) score += 45;
    if (strObj.includes('camera event') || strObj.includes('detection')) score += 40;

    // Low priority
    if (
      strObj.includes('old report') ||
      strObj.includes('historical') ||
      strObj.includes('archived')
    )
      score -= 30;

    // Time decay (if timestamp exists)
    if (item.timestamp || item.createdAt) {
      const time = new Date(item.timestamp || item.createdAt).getTime();
      const ageHours = (Date.now() - time) / (1000 * 60 * 60);
      if (ageHours > 24) score -= 20;
      if (ageHours > 72) score -= 30;
      if (ageHours < 1) score += 20; // Very recent
    }

    // Clamp score
    return Math.max(0, Math.min(100, score));
  }
}

export const aiContextRankingService = new ContextRankingService();

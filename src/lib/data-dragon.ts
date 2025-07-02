// Data Dragon API utilities for League of Legends static data

export interface DataDragonVersion {
  version: string;
  patch: string;
}

export interface MapInfo {
  mapId: number;
  mapName: string;
  imageUrl: string;
  bounds: {
    min: { x: number; y: number };
    max: { x: number; y: number };
  };
}

// Map configurations based on Riot API documentation
export const MAP_CONFIGS: Record<number, Omit<MapInfo, 'imageUrl'>> = {
  11: {
    mapId: 11,
    mapName: "Summoner's Rift",
    bounds: {
      min: { x: -120, y: -120 },
      max: { x: 14870, y: 14980 }
    }
  },
  12: {
    mapId: 12,
    mapName: "Howling Abyss",
    bounds: {
      min: { x: -28, y: -19 },
      max: { x: 12849, y: 12858 }
    }
  },
  10: {
    mapId: 10,
    mapName: "Twisted Treeline",
    bounds: {
      min: { x: 0, y: 0 },
      max: { x: 15398, y: 15398 }
    }
  }
};

/**
 * Get the latest Data Dragon version
 */
export async function getLatestDataDragonVersion(): Promise<DataDragonVersion> {
  try {
    const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = await response.json();
    
    if (!versions || !Array.isArray(versions) || versions.length === 0) {
      throw new Error('No versions found');
    }

    const latestVersion = versions[0];
    return {
      version: latestVersion,
      patch: latestVersion.split('.').slice(0, 2).join('.')
    };
  } catch (error) {
    console.error('Failed to fetch Data Dragon version:', error);
    // Fallback to a known working version
    return {
      version: '13.24.1',
      patch: '13.24'
    };
  }
}

/**
 * Get map image URL from Data Dragon
 */
export function getMapImageUrl(mapId: number, version?: string): string {
  const mapVersion = version || '13.24.1';
  return `https://ddragon.leagueoflegends.com/cdn/${mapVersion}/img/map/map${mapId}.png`;
}

/**
 * Get complete map information including image URL
 */
export async function getMapInfo(mapId: number): Promise<MapInfo | null> {
  const mapConfig = MAP_CONFIGS[mapId];
  if (!mapConfig) {
    console.warn(`Unknown map ID: ${mapId}`);
    return null;
  }

  try {
    const { version } = await getLatestDataDragonVersion();
    
    return {
      ...mapConfig,
      imageUrl: getMapImageUrl(mapId, version)
    };
  } catch (error) {
    console.error(`Failed to get map info for map ${mapId}:`, error);
    
    // Return with fallback version
    return {
      ...mapConfig,
      imageUrl: getMapImageUrl(mapId)
    };
  }
}

/**
 * Convert game coordinates to map percentage coordinates
 */
export function gameToMapCoordinates(
  gameX: number,
  gameY: number,
  mapBounds: MapInfo['bounds']
): { x: number; y: number } {
  const { min, max } = mapBounds;
  
  // Clamp coordinates to bounds
  const clampedX = Math.max(min.x, Math.min(max.x, gameX));
  const clampedY = Math.max(min.y, Math.min(max.y, gameY));
  
  // Convert to percentage (0-100)
  const x = ((clampedX - min.x) / (max.x - min.x)) * 100;
  const y = ((clampedY - min.y) / (max.y - min.y)) * 100;
  
  return { x, y };
}

/**
 * Convert map percentage coordinates back to game coordinates
 */
export function mapToGameCoordinates(
  mapX: number,
  mapY: number,
  mapBounds: MapInfo['bounds']
): { x: number; y: number } {
  const { min, max } = mapBounds;
  
  // Convert from percentage to game coordinates
  const x = min.x + (mapX / 100) * (max.x - min.x);
  const y = min.y + (mapY / 100) * (max.y - min.y);
  
  return { x, y };
}

/**
 * Preload map image to ensure it's cached
 */
export async function preloadMapImage(mapId: number): Promise<string> {
  const mapInfo = await getMapInfo(mapId);
  if (!mapInfo) {
    throw new Error(`Cannot load map ${mapId}`);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log(`Map ${mapId} preloaded successfully`);
      resolve(mapInfo.imageUrl);
    };
    
    img.onerror = (error) => {
      console.error(`Failed to preload map ${mapId}:`, error);
      reject(new Error(`Failed to load map image: ${mapInfo.imageUrl}`));
    };
    
    img.src = mapInfo.imageUrl;
  });
}

/**
 * Get champion square image URL from Data Dragon
 */
export function getChampionImageUrl(championName: string, version?: string): string {
  const champVersion = version || '13.24.1';
  return `https://ddragon.leagueoflegends.com/cdn/${champVersion}/img/champion/${championName}.png`;
}

/**
 * Get item image URL from Data Dragon
 */
export function getItemImageUrl(itemId: number, version?: string): string {
  const itemVersion = version || '13.24.1';
  return `https://ddragon.leagueoflegends.com/cdn/${itemVersion}/img/item/${itemId}.png`;
} 
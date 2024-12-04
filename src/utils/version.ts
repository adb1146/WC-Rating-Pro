import { RatingFactor } from '../types';

export function incrementVersion(version: string): string {
  const [major, minor, patch] = version.split('.').map(Number);
  return `${major}.${minor}.${patch + 1}`;
}

export function compareVersions(a: string, b: string): number {
  const [aMajor, aMinor, aPatch] = a.split('.').map(Number);
  const [bMajor, bMinor, bPatch] = b.split('.').map(Number);
  
  if (aMajor !== bMajor) return aMajor - bMajor;
  if (aMinor !== bMinor) return aMinor - bMinor;
  return aPatch - bPatch;
}

export function createNewVersion(factor: RatingFactor): RatingFactor {
  return {
    ...factor,
    id: Date.now().toString(),
    version: incrementVersion(factor.version),
    status: 'pending'
  };
}
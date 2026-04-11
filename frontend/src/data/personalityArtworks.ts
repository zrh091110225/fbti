import sampleWatercolorFishing from '../assets/results/sample-watercolor-fishing.jpg'

const artworkByPersonalityId: Partial<Record<string, string>> = {}

export function getPersonalityArtwork(personalityId: string) {
  return artworkByPersonalityId[personalityId] ?? sampleWatercolorFishing
}

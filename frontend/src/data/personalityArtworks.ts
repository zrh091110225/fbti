import { personalities } from '../config/quizConfig'

const defaultArtwork = '/results/sample-personality-result.png'

const artworkByPersonalityId = Object.fromEntries(
  personalities.map(personality => [personality.id, personality.image])
) as Record<string, string>

export function getPersonalityArtwork(personalityId: string) {
  return artworkByPersonalityId[personalityId] ?? defaultArtwork
}

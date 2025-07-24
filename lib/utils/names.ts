// Fun, engaging names for children when no name is provided
const adventurerNames = [
  'Captain Curious',
  'Professor Wonder',
  'Detective Discovery',
  'Astronaut Alex',
  'Scientist Sam',
  'Explorer Evie',
  'Ranger Riley',
  'Inspector Izzy',
  'Captain Casey',
  'Doctor Dani',
  'Inventor Iris',
  'Researcher Remy',
  'Pioneer Penny',
  'Adventurer Ash',
  'Scholar Sky',
  'Seeker Sage',
  'Voyager Val',
  'Dreamer Dylan',
  'Thinker Theo',
  'Questor Quinn'
]

export function getRandomName(): string {
  return adventurerNames[Math.floor(Math.random() * adventurerNames.length)]
}

export function getChildName(providedName?: string | null): string {
  if (providedName && providedName.trim()) {
    return providedName.trim()
  }
  return getRandomName()
}
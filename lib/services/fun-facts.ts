export const scienceFunFacts = [
  // Physics
  "A sneeze travels out of your mouth at over 100 miles per hour!",
  "Lightning is 5 times hotter than the surface of the sun!",
  "Sound travels 4 times faster in water than in air.",
  "A rainbow is actually a full circle, but we only see half from the ground.",
  "Bubble wrap was originally invented as wallpaper!",
  
  // Biology
  "Butterflies taste with their feet!",
  "A blue whale's heart is as big as a small car!",
  "Octopuses have three hearts and blue blood!",
  "Trees can talk to each other through their roots!",
  "Your nose can remember 50,000 different smells!",
  
  // Chemistry
  "Honey never goes bad - archaeologists found 3000-year-old honey that was still good!",
  "Water can boil and freeze at the same time in space!",
  "Bananas are slightly radioactive (but totally safe to eat)!",
  "Diamond and pencil lead are made of the same thing - carbon!",
  "Fireworks get their colors from different metals burning!",
  
  // Earth Science
  "There are more stars in space than grains of sand on all Earth's beaches!",
  "One day on Venus is longer than one year on Venus!",
  "It can rain diamonds on Jupiter and Saturn!",
  "The Earth's core is as hot as the Sun's surface!",
  "Some clouds weigh as much as 100 elephants!",
  
  // General Science
  "Scientists have created glow-in-the-dark cats!",
  "There's enough gold in Earth's core to coat the planet in 1.5 feet of gold!",
  "Hot water freezes faster than cold water sometimes - it's called the Mpemba effect!",
  "Glass is neither a solid nor a liquid - it's an amorphous solid!",
  "The inventor of the Pringles can is now buried in one!",
]

export function getRandomFunFact(): string {
  return scienceFunFacts[Math.floor(Math.random() * scienceFunFacts.length)]
}

export function* funFactGenerator() {
  const shuffled = [...scienceFunFacts].sort(() => Math.random() - 0.5)
  for (const fact of shuffled) {
    yield fact
  }
  // Start over when we run out
  yield* funFactGenerator()
}
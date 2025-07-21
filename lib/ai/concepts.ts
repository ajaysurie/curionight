import { ScienceConcept } from '@/types/story'

export const scienceConcepts: ScienceConcept[] = [
  // Physics
  {
    id: 'gravity',
    name: 'Gravity',
    category: 'Physics',
    description: 'The force that pulls things down to Earth',
    keywords: ['falling', 'dropping', 'weight', 'heavy', 'light'],
    ageRange: { min: 4, max: 8 },
  },
  {
    id: 'light-shadows',
    name: 'Light and Shadows',
    category: 'Physics',
    description: 'How light creates shadows and makes things visible',
    keywords: ['shadow', 'light', 'sun', 'lamp', 'dark', 'bright'],
    ageRange: { min: 4, max: 8 },
  },
  {
    id: 'sound-vibrations',
    name: 'Sound and Vibrations',
    category: 'Physics',
    description: 'How sounds are made by things vibrating',
    keywords: ['noise', 'music', 'loud', 'quiet', 'echo', 'vibrate'],
    ageRange: { min: 5, max: 8 },
  },
  {
    id: 'magnetism',
    name: 'Magnetism',
    category: 'Physics',
    description: 'How magnets attract and repel certain materials',
    keywords: ['magnet', 'metal', 'attract', 'stick', 'pull', 'push'],
    ageRange: { min: 5, max: 8 },
  },
  
  // Chemistry
  {
    id: 'states-matter',
    name: 'States of Matter',
    category: 'Chemistry',
    description: 'How things can be solid, liquid, or gas',
    keywords: ['ice', 'water', 'steam', 'melt', 'freeze', 'solid', 'liquid'],
    ageRange: { min: 5, max: 8 },
  },
  {
    id: 'mixing-solutions',
    name: 'Mixing and Solutions',
    category: 'Chemistry',
    description: 'What happens when we mix different things together',
    keywords: ['mix', 'stir', 'dissolve', 'solution', 'combine'],
    ageRange: { min: 4, max: 8 },
  },
  {
    id: 'bubbles-foam',
    name: 'Bubbles and Foam',
    category: 'Chemistry',
    description: 'How bubbles form and why they pop',
    keywords: ['bubble', 'foam', 'soap', 'pop', 'float'],
    ageRange: { min: 4, max: 7 },
  },
  
  // Biology
  {
    id: 'plant-growth',
    name: 'How Plants Grow',
    category: 'Biology',
    description: 'What plants need to grow big and strong',
    keywords: ['plant', 'flower', 'tree', 'leaf', 'grow', 'seed'],
    ageRange: { min: 4, max: 8 },
  },
  {
    id: 'animal-homes',
    name: 'Animal Homes',
    category: 'Biology',
    description: 'Where different animals live and why',
    keywords: ['animal', 'pet', 'nest', 'home', 'habitat'],
    ageRange: { min: 4, max: 7 },
  },
  {
    id: 'human-senses',
    name: 'Our Five Senses',
    category: 'Biology',
    description: 'How we see, hear, smell, taste, and touch',
    keywords: ['eye', 'ear', 'nose', 'tongue', 'hand', 'sense'],
    ageRange: { min: 4, max: 7 },
  },
  {
    id: 'food-energy',
    name: 'Food as Energy',
    category: 'Biology',
    description: 'How food gives us energy to play and grow',
    keywords: ['food', 'eat', 'hungry', 'energy', 'grow', 'strong'],
    ageRange: { min: 5, max: 8 },
  },
  
  // Earth Science
  {
    id: 'weather-patterns',
    name: 'Weather Patterns',
    category: 'Earth Science',
    description: 'Why we have sunny, rainy, and cloudy days',
    keywords: ['rain', 'sun', 'cloud', 'wind', 'snow', 'weather'],
    ageRange: { min: 4, max: 8 },
  },
  {
    id: 'rocks-minerals',
    name: 'Rocks and Minerals',
    category: 'Earth Science',
    description: 'Different types of rocks and how they form',
    keywords: ['rock', 'stone', 'pebble', 'sand', 'crystal'],
    ageRange: { min: 5, max: 8 },
  },
  {
    id: 'water-cycle',
    name: 'The Water Cycle',
    category: 'Earth Science',
    description: 'How water moves from clouds to rain to rivers',
    keywords: ['water', 'rain', 'cloud', 'river', 'ocean', 'evaporate'],
    ageRange: { min: 6, max: 8 },
  },
  {
    id: 'day-night',
    name: 'Day and Night',
    category: 'Earth Science',
    description: 'Why we have daytime and nighttime',
    keywords: ['sun', 'moon', 'star', 'day', 'night', 'sky'],
    ageRange: { min: 4, max: 7 },
  },
  
  // Technology/Engineering
  {
    id: 'simple-machines',
    name: 'Simple Machines',
    category: 'Engineering',
    description: 'How wheels, levers, and ramps make work easier',
    keywords: ['wheel', 'ramp', 'lever', 'pulley', 'machine'],
    ageRange: { min: 6, max: 8 },
  },
  {
    id: 'building-structures',
    name: 'Building Strong Structures',
    category: 'Engineering',
    description: 'How to build things that dont fall down',
    keywords: ['build', 'tower', 'bridge', 'strong', 'balance'],
    ageRange: { min: 5, max: 8 },
  },
]
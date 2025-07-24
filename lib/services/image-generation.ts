import { GoogleGenerativeAI } from '@google/generative-ai'

export interface ImageGenerationResult {
  success: boolean
  imageUrl?: string
  error?: string
}

export class ImageGenerationService {
  private genAI: GoogleGenerativeAI
  
  constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_GEMINI_API_KEY is not set')
    }
    this.genAI = new GoogleGenerativeAI(apiKey)
  }
  
  async generateStoryImage(
    prompt: string,
    style: 'illustration' | 'watercolor' | 'cartoon' = 'illustration'
  ): Promise<ImageGenerationResult> {
    try {
      // For now, we'll use DALL-E 3 or Stable Diffusion via API
      // Gemini doesn't support image generation yet
      // This is a placeholder for when we integrate an image generation API
      
      // Style modifiers for children's book illustrations
      const styleModifiers = {
        illustration: 'children\'s book illustration, soft colors, whimsical, friendly',
        watercolor: 'watercolor painting, soft edges, dreamy, children\'s book style',
        cartoon: 'cute cartoon style, vibrant colors, rounded shapes, child-friendly'
      }
      
      const enhancedPrompt = `${prompt}, ${styleModifiers[style]}, safe for children, no scary elements, magical and wonder-filled`
      
      // TODO: Integrate with actual image generation API
      // Options: DALL-E 3, Stable Diffusion, Midjourney API
      
      return {
        success: false,
        error: 'Image generation not yet implemented'
      }
    } catch (error) {
      console.error('Error generating image:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate image'
      }
    }
  }
  
  // Generate a simple SVG illustration as a placeholder
  async generatePlaceholderSVG(
    prompt: string,
    pageNumber: number
  ): Promise<string> {
    try {
      // Extract key elements from the prompt
      const elements = this.extractKeyElements(prompt)
      
      // Create a simple, colorful SVG based on the story elements
      const svg = this.createStoryScene(elements, pageNumber)
      
      // Optimize SVG - remove unnecessary whitespace and compress
      const optimizedSvg = svg.replace(/\s+/g, ' ').trim()
      
      // Convert to data URL with URL encoding instead of base64 (smaller)
      const svgDataUrl = `data:image/svg+xml,${encodeURIComponent(optimizedSvg)}`
      
      return svgDataUrl
    } catch (error) {
      console.error('Error generating SVG:', error)
      // Return a simple fallback SVG
      return this.getFallbackSVG(pageNumber)
    }
  }
  
  private getFallbackSVG(pageNumber: number): string {
    const colors = ['#9333ea', '#7c3aed', '#6366f1', '#3b82f6']
    const color = colors[pageNumber % colors.length]
    const svg = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="${color}"/>
      <circle cx="400" cy="300" r="100" fill="white" opacity="0.3"/>
    </svg>`
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }
  
  private extractKeyElements(prompt: string): string[] {
    const keywords = [
      'star', 'moon', 'sun', 'cloud', 'tree', 'flower', 'mountain',
      'ocean', 'wave', 'bird', 'butterfly', 'rainbow', 'planet',
      'rocket', 'telescope', 'microscope', 'bubble', 'crystal',
      'light', 'shadow', 'wind', 'rain', 'snow', 'atom', 'molecule',
      'dna', 'cell', 'galaxy', 'comet', 'aurora', 'volcano', 'fossil',
      'coral', 'jellyfish', 'dolphin', 'whale', 'shark', 'octopus',
      'beetle', 'ant', 'bee', 'spider', 'mushroom', 'fern', 'cactus',
      'desert', 'forest', 'river', 'waterfall', 'cave', 'crystal',
      'diamond', 'prism', 'magnet', 'battery', 'circuit', 'robot',
      'satellite', 'asteroid', 'nebula', 'blackhole', 'supernova'
    ]
    
    const found: string[] = []
    const lowerPrompt = prompt.toLowerCase()
    
    for (const keyword of keywords) {
      if (lowerPrompt.includes(keyword)) {
        found.push(keyword)
      }
    }
    
    // Add context-specific elements based on science topics
    if (lowerPrompt.includes('physics') || lowerPrompt.includes('gravity')) {
      found.push('atom', 'wave')
    }
    if (lowerPrompt.includes('biology') || lowerPrompt.includes('life')) {
      found.push('cell', 'dna')
    }
    if (lowerPrompt.includes('space') || lowerPrompt.includes('astronomy')) {
      found.push('planet', 'star')
    }
    if (lowerPrompt.includes('chemistry')) {
      found.push('molecule', 'bubble')
    }
    if (lowerPrompt.includes('geology') || lowerPrompt.includes('earth')) {
      found.push('mountain', 'crystal')
    }
    if (lowerPrompt.includes('weather') || lowerPrompt.includes('climate')) {
      found.push('cloud', 'sun')
    }
    
    // Default elements if none found
    if (found.length === 0) {
      found.push('star', 'cloud')
    }
    
    // Limit to 3 elements to reduce memory usage
    return found.slice(0, 3)
  }
  
  private createStoryScene(elements: string[], pageNumber: number): string {
    const width = 800
    const height = 600
    
    // Color palettes for different moods
    const palettes = [
      { bg: '#1a1a2e', primary: '#ffd93d', secondary: '#6bcf7f', accent: '#e94560' },
      { bg: '#0f3460', primary: '#e94560', secondary: '#ffd93d', accent: '#16213e' },
      { bg: '#2d3561', primary: '#c84b31', secondary: '#ecdbba', accent: '#191919' },
      { bg: '#364f6b', primary: '#fc5185', secondary: '#f5f5f5', accent: '#3fc1c9' }
    ]
    
    const palette = palettes[pageNumber % palettes.length]
    
    let svgElements = ''
    
    // Add elements based on keywords
    elements.forEach((element, index) => {
      const x = (index + 1) * (width / (elements.length + 1))
      const y = height / 2 + Math.sin(index) * 100
      
      switch (element) {
        case 'star':
          svgElements += this.createStar(x, y, 30, palette.primary)
          break
        case 'moon':
          svgElements += this.createMoon(x, y, 40, palette.secondary)
          break
        case 'cloud':
          svgElements += this.createCloud(x, y, 60, '#ffffff', 0.3)
          break
        case 'sun':
          svgElements += this.createSun(x, y, 50, palette.primary)
          break
        case 'tree':
          svgElements += this.createTree(x, height - 100, 80, palette.secondary)
          break
        case 'mountain':
          svgElements += this.createMountain(x, height, 150, palette.accent)
          break
        case 'wave':
          svgElements += this.createWave(0, height - 150, width, palette.secondary)
          break
        case 'rainbow':
          svgElements += this.createRainbow(width / 2, height / 2, 200)
          break
        case 'atom':
          svgElements += this.createAtom(x, y, 40, palette.primary)
          break
        case 'molecule':
          svgElements += this.createMolecule(x, y, 50, palette.secondary)
          break
        case 'dna':
          svgElements += this.createDNA(x, y, 60, palette.primary)
          break
        case 'cell':
          svgElements += this.createCell(x, y, 45, palette.secondary)
          break
        case 'planet':
          svgElements += this.createPlanet(x, y, 45, palette.accent)
          break
        case 'galaxy':
          svgElements += this.createGalaxy(x, y, 70, palette.primary)
          break
        case 'butterfly':
          svgElements += this.createButterfly(x, y, 35, palette.secondary)
          break
        case 'flower':
          svgElements += this.createFlower(x, height - 80, 30, palette.accent)
          break
        case 'telescope':
          svgElements += this.createTelescope(x, y, 50, palette.secondary)
          break
        case 'microscope':
          svgElements += this.createMicroscope(x, y, 50, palette.accent)
          break
        case 'crystal':
          svgElements += this.createCrystal(x, y, 40, palette.primary)
          break
        case 'bubble':
          svgElements += this.createBubble(x, y, 35, palette.secondary)
          break
        case 'coral':
          svgElements += this.createCoral(x, height - 50, 40, palette.accent)
          break
        case 'jellyfish':
          svgElements += this.createJellyfish(x, y, 40, palette.secondary)
          break
        case 'volcano':
          svgElements += this.createVolcano(x, height, 100, palette.accent)
          break
        case 'aurora':
          svgElements += this.createAurora(0, 0, width, height / 3, palette.primary)
          break
        case 'comet':
          svgElements += this.createComet(x, y, 30, palette.primary)
          break
        case 'rocket':
          svgElements += this.createRocket(x, y, 60, palette.accent)
          break
        default:
          svgElements += this.createSparkle(x, y, 20, palette.accent)
      }
    })
    
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${palette.bg};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${this.lightenColor(palette.bg, 20)};stop-opacity:1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Background -->
        <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
        
        <!-- Story elements -->
        ${svgElements}
        
        <!-- Floating particles -->
        ${this.createFloatingParticles(width, height, palette.primary)}
      </svg>
    `
  }
  
  private createStar(x: number, y: number, size: number, color: string): string {
    return `
      <g transform="translate(${x}, ${y})" filter="url(#glow)">
        <path d="M 0 -${size} L ${size * 0.3} -${size * 0.3} L ${size} 0 L ${size * 0.3} ${size * 0.3} L 0 ${size} L -${size * 0.3} ${size * 0.3} L -${size} 0 L -${size * 0.3} -${size * 0.3} Z" 
              fill="${color}" opacity="0.9"/>
      </g>
    `
  }
  
  private createMoon(x: number, y: number, size: number, color: string): string {
    return `
      <g transform="translate(${x}, ${y})">
        <circle cx="0" cy="0" r="${size}" fill="${color}" opacity="0.8"/>
        <circle cx="${size * 0.3}" cy="-${size * 0.1}" r="${size * 0.8}" fill="${this.lightenColor(color, 10)}" opacity="0.6"/>
      </g>
    `
  }
  
  private createCloud(x: number, y: number, size: number, color: string, opacity: number): string {
    return `
      <g transform="translate(${x}, ${y})" opacity="${opacity}">
        <ellipse cx="0" cy="0" rx="${size}" ry="${size * 0.6}" fill="${color}"/>
        <ellipse cx="${size * 0.5}" cy="${size * 0.1}" rx="${size * 0.7}" ry="${size * 0.5}" fill="${color}"/>
        <ellipse cx="-${size * 0.4}" cy="${size * 0.1}" rx="${size * 0.6}" ry="${size * 0.4}" fill="${color}"/>
      </g>
    `
  }
  
  private createSun(x: number, y: number, size: number, color: string): string {
    const rays = Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 30) * Math.PI / 180
      const x1 = Math.cos(angle) * size * 1.2
      const y1 = Math.sin(angle) * size * 1.2
      const x2 = Math.cos(angle) * size * 1.5
      const y2 = Math.sin(angle) * size * 1.5
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="3" opacity="0.6"/>`
    }).join('')
    
    return `
      <g transform="translate(${x}, ${y})" filter="url(#glow)">
        ${rays}
        <circle cx="0" cy="0" r="${size}" fill="${color}"/>
      </g>
    `
  }
  
  private createTree(x: number, y: number, size: number, color: string): string {
    return `
      <g transform="translate(${x}, ${y})">
        <rect x="-${size * 0.1}" y="-${size}" width="${size * 0.2}" height="${size}" fill="#8B4513"/>
        <circle cx="0" cy="-${size}" r="${size * 0.6}" fill="${color}"/>
        <circle cx="-${size * 0.3}" cy="-${size * 0.8}" r="${size * 0.4}" fill="${this.lightenColor(color, 10)}"/>
        <circle cx="${size * 0.3}" cy="-${size * 0.8}" r="${size * 0.4}" fill="${this.lightenColor(color, 10)}"/>
      </g>
    `
  }
  
  private createMountain(x: number, y: number, size: number, color: string): string {
    return `
      <g transform="translate(${x}, ${y})">
        <path d="M -${size} 0 L 0 -${size * 1.5} L ${size} 0 Z" fill="${color}" opacity="0.7"/>
        <path d="M -${size * 0.3} -${size * 0.9} L 0 -${size * 1.5} L ${size * 0.3} -${size * 0.9} Z" fill="white" opacity="0.5"/>
      </g>
    `
  }
  
  private createWave(x: number, y: number, width: number, color: string): string {
    const path = `M ${x} ${y} Q ${width * 0.25} ${y - 30} ${width * 0.5} ${y} T ${width} ${y}`
    return `
      <g opacity="0.6">
        <path d="${path}" stroke="${color}" stroke-width="4" fill="none"/>
        <path d="M ${x} ${y + 20} Q ${width * 0.25} ${y - 10} ${width * 0.5} ${y + 20} T ${width} ${y + 20}" 
              stroke="${this.lightenColor(color, 20)}" stroke-width="3" fill="none"/>
      </g>
    `
  }
  
  private createRainbow(x: number, y: number, size: number): string {
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3']
    return colors.map((color, i) => 
      `<path d="M ${x - size} ${y} A ${size - i * 10} ${size - i * 10} 0 0 1 ${x + size} ${y}" 
             stroke="${color}" stroke-width="10" fill="none" opacity="0.7"/>`
    ).join('')
  }
  
  private createSparkle(x: number, y: number, size: number, color: string): string {
    return `
      <g transform="translate(${x}, ${y})" opacity="0.8">
        <path d="M 0 -${size} L ${size * 0.2} -${size * 0.2} L ${size} 0 L ${size * 0.2} ${size * 0.2} L 0 ${size} L -${size * 0.2} ${size * 0.2} L -${size} 0 L -${size * 0.2} -${size * 0.2} Z" 
              fill="${color}" transform="scale(0.5, 1)"/>
      </g>
    `
  }
  
  private createFloatingParticles(width: number, height: number, color: string): string {
    return Array.from({ length: 10 }, (_, i) => {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * 3 + 1
      return `<circle cx="${x}" cy="${y}" r="${size}" fill="${color}" opacity="${Math.random() * 0.5 + 0.2}"/>`
    }).join('')
  }
  
  private lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
  }
  
  private createAtom(x: number, y: number, size: number, color: string): string {
    const orbits = Array.from({ length: 3 }, (_, i) => {
      const angle = i * 60
      return `<ellipse cx="0" cy="0" rx="${size}" ry="${size * 0.3}" fill="none" stroke="${color}" stroke-width="2" opacity="0.6" transform="rotate(${angle})"/>`
    }).join('')
    
    return `
      <g transform="translate(${x}, ${y})">
        ${orbits}
        <circle cx="0" cy="0" r="${size * 0.2}" fill="${color}"/>
        <circle cx="${size * 0.8}" cy="0" r="${size * 0.1}" fill="${this.lightenColor(color, 20)}"/>
        <circle cx="-${size * 0.8}" cy="0" r="${size * 0.1}" fill="${this.lightenColor(color, 20)}"/>
      </g>
    `
  }
  
  private createMolecule(x: number, y: number, size: number, color: string): string {
    return `
      <g transform="translate(${x}, ${y})">
        <line x1="-${size * 0.5}" y1="0" x2="${size * 0.5}" y2="0" stroke="${color}" stroke-width="3"/>
        <line x1="0" y1="0" x2="0" y2="-${size * 0.6}" stroke="${color}" stroke-width="3"/>
        <circle cx="-${size * 0.5}" cy="0" r="${size * 0.25}" fill="${this.lightenColor(color, 30)}"/>
        <circle cx="${size * 0.5}" cy="0" r="${size * 0.25}" fill="${this.lightenColor(color, 30)}"/>
        <circle cx="0" cy="0" r="${size * 0.3}" fill="${color}"/>
        <circle cx="0" cy="-${size * 0.6}" r="${size * 0.2}" fill="${this.lightenColor(color, 20)}"/>
      </g>
    `
  }
  
  private createDNA(x: number, y: number, size: number, color: string): string {
    const helixPath = `M 0 -${size} Q ${size * 0.3} -${size * 0.5} 0 0 T 0 ${size}`
    const helixPath2 = `M 0 -${size} Q -${size * 0.3} -${size * 0.5} 0 0 T 0 ${size}`
    
    return `
      <g transform="translate(${x}, ${y})">
        <path d="${helixPath}" stroke="${color}" stroke-width="3" fill="none"/>
        <path d="${helixPath2}" stroke="${this.lightenColor(color, 20)}" stroke-width="3" fill="none"/>
        ${Array.from({ length: 5 }, (_, i) => {
          const yPos = -size + (i * size * 0.5)
          return `<line x1="-${size * 0.2}" y1="${yPos}" x2="${size * 0.2}" y2="${yPos}" stroke="${color}" stroke-width="2" opacity="0.5"/>`
        }).join('')}
      </g>
    `
  }
  
  private createCell(x: number, y: number, size: number, color: string): string {
    return `
      <g transform="translate(${x}, ${y})">
        <ellipse cx="0" cy="0" rx="${size}" ry="${size * 0.8}" fill="${this.lightenColor(color, 40)}" opacity="0.8"/>
        <ellipse cx="0" cy="0" rx="${size * 0.9}" ry="${size * 0.7}" fill="none" stroke="${color}" stroke-width="3"/>
        <circle cx="0" cy="0" r="${size * 0.3}" fill="${color}" opacity="0.8"/>
        <circle cx="${size * 0.3}" cy="-${size * 0.2}" r="${size * 0.15}" fill="${this.lightenColor(color, 20)}" opacity="0.6"/>
        <circle cx="-${size * 0.3}" cy="${size * 0.2}" r="${size * 0.15}" fill="${this.lightenColor(color, 20)}" opacity="0.6"/>
      </g>
    `
  }
  
  private createPlanet(x: number, y: number, size: number, color: string): string {
    return `
      <g transform="translate(${x}, ${y})">
        <circle cx="0" cy="0" r="${size}" fill="${color}"/>
        <ellipse cx="0" cy="0" rx="${size * 1.5}" ry="${size * 0.3}" fill="none" stroke="${this.lightenColor(color, 30)}" stroke-width="3" opacity="0.7"/>
        <path d="M -${size} 0 A ${size} ${size} 0 0 1 ${size} 0" fill="${this.lightenColor(color, 20)}" opacity="0.5"/>
        <circle cx="-${size * 0.3}" cy="-${size * 0.3}" r="${size * 0.2}" fill="${this.lightenColor(color, 40)}" opacity="0.6"/>
      </g>
    `
  }
  
  private createGalaxy(x: number, y: number, size: number, color: string): string {
    const arms = Array.from({ length: 3 }, (_, i) => {
      const angle = i * 120
      return `<path d="M 0 0 Q ${size * 0.5} ${size * 0.2} ${size} 0" stroke="${color}" stroke-width="2" fill="none" opacity="0.7" transform="rotate(${angle})"/>`
    }).join('')
    
    return `
      <g transform="translate(${x}, ${y})" filter="url(#glow)">
        ${arms}
        <circle cx="0" cy="0" r="${size * 0.2}" fill="${color}"/>
        ${Array.from({ length: 30 }, (_, i) => {
          const r = Math.random() * size
          const theta = Math.random() * Math.PI * 2
          const px = r * Math.cos(theta)
          const py = r * Math.sin(theta)
          return `<circle cx="${px}" cy="${py}" r="1" fill="white" opacity="${Math.random() * 0.8 + 0.2}"/>`
        }).join('')}
      </g>
    `
  }
  
  private createButterfly(x: number, y: number, size: number, color: string): string {
    return `
      <g transform="translate(${x}, ${y})">
        <ellipse cx="-${size * 0.5}" cy="-${size * 0.3}" rx="${size * 0.4}" ry="${size * 0.6}" fill="${color}" transform="rotate(-20 -${size * 0.5} -${size * 0.3})"/>
        <ellipse cx="${size * 0.5}" cy="-${size * 0.3}" rx="${size * 0.4}" ry="${size * 0.6}" fill="${color}" transform="rotate(20 ${size * 0.5} -${size * 0.3})"/>
        <ellipse cx="-${size * 0.4}" cy="${size * 0.3}" rx="${size * 0.3}" ry="${size * 0.4}" fill="${this.lightenColor(color, 20)}" transform="rotate(-30 -${size * 0.4} ${size * 0.3})"/>
        <ellipse cx="${size * 0.4}" cy="${size * 0.3}" rx="${size * 0.3}" ry="${size * 0.4}" fill="${this.lightenColor(color, 20)}" transform="rotate(30 ${size * 0.4} ${size * 0.3})"/>
        <rect x="-${size * 0.05}" y="-${size * 0.6}" width="${size * 0.1}" height="${size}" fill="#333" rx="${size * 0.05}"/>
      </g>
    `
  }
  
  private createFlower(x: number, y: number, size: number, color: string): string {
    const petals = Array.from({ length: 6 }, (_, i) => {
      const angle = i * 60
      return `<ellipse cx="0" cy="-${size * 0.6}" rx="${size * 0.3}" ry="${size * 0.6}" fill="${color}" transform="rotate(${angle})"/>`
    }).join('')
    
    return `
      <g transform="translate(${x}, ${y})">
        <line x1="0" y1="0" x2="0" y2="${size}" stroke="#228B22" stroke-width="4"/>
        <g transform="translate(0, -${size})">
          ${petals}
          <circle cx="0" cy="0" r="${size * 0.3}" fill="${this.lightenColor(color, 40)}"/>
        </g>
      </g>
    `
  }
  
  private createTelescope(x: number, y: number, size: number, color: string): string {
    return `
      <g transform="translate(${x}, ${y})" transform="rotate(-30)">
        <rect x="-${size * 0.8}" y="-${size * 0.15}" width="${size * 1.6}" height="${size * 0.3}" fill="${color}" rx="${size * 0.05}"/>
        <rect x="${size * 0.8}" y="-${size * 0.2}" width="${size * 0.3}" height="${size * 0.4}" fill="${this.lightenColor(color, 20)}"/>
        <rect x="-${size * 0.4}" y="${size * 0.15}" width="${size * 0.1}" height="${size * 0.4}" fill="${color}"/>
        <rect x="-${size * 0.1}" y="${size * 0.15}" width="${size * 0.1}" height="${size * 0.4}" fill="${color}"/>
      </g>
    `
  }
  
  private createMicroscope(x: number, y: number, size: number, color: string): string {
    return `
      <g transform="translate(${x}, ${y})">
        <rect x="-${size * 0.3}" y="${size * 0.3}" width="${size * 0.6}" height="${size * 0.2}" fill="${color}" rx="${size * 0.1}"/>
        <rect x="-${size * 0.1}" y="-${size * 0.5}" width="${size * 0.2}" height="${size * 0.8}" fill="${color}"/>
        <circle cx="0" cy="-${size * 0.5}" r="${size * 0.2}" fill="${this.lightenColor(color, 20)}"/>
        <rect x="-${size * 0.15}" y="-${size * 0.2}" width="${size * 0.3}" height="${size * 0.1}" fill="${this.lightenColor(color, 30)}"/>
        <path d="M -${size * 0.05} 0 L -${size * 0.2} ${size * 0.2} L ${size * 0.2} ${size * 0.2} L ${size * 0.05} 0 Z" fill="${color}"/>
      </g>
    `
  }
  
  private createCrystal(x: number, y: number, size: number, color: string): string {
    return `
      <g transform="translate(${x}, ${y})" filter="url(#glow)">
        <path d="M 0 -${size} L ${size * 0.3} -${size * 0.3} L ${size * 0.2} ${size * 0.5} L 0 ${size} L -${size * 0.2} ${size * 0.5} L -${size * 0.3} -${size * 0.3} Z" 
              fill="${color}" opacity="0.8"/>
        <path d="M 0 -${size} L ${size * 0.3} -${size * 0.3} L 0 0 Z" fill="${this.lightenColor(color, 30)}" opacity="0.6"/>
        <path d="M 0 ${size} L ${size * 0.2} ${size * 0.5} L 0 0 Z" fill="${this.lightenColor(color, 20)}" opacity="0.5"/>
      </g>
    `
  }
  
  private createBubble(x: number, y: number, size: number, color: string): string {
    return `
      <g transform="translate(${x}, ${y})">
        <circle cx="0" cy="0" r="${size}" fill="${color}" opacity="0.3"/>
        <circle cx="0" cy="0" r="${size}" fill="none" stroke="${color}" stroke-width="2" opacity="0.5"/>
        <ellipse cx="${size * 0.3}" cy="-${size * 0.3}" rx="${size * 0.2}" ry="${size * 0.15}" fill="white" opacity="0.6"/>
      </g>
    `
  }
  
  private createCoral(x: number, y: number, size: number, color: string): string {
    const branches = Array.from({ length: 5 }, (_, i) => {
      const angle = (i - 2) * 20
      const height = size * (0.6 + Math.random() * 0.4)
      return `<path d="M 0 0 L ${Math.sin(angle * Math.PI / 180) * size * 0.3} -${height}" stroke="${color}" stroke-width="${size * 0.1}" stroke-linecap="round"/>`
    }).join('')
    
    return `
      <g transform="translate(${x}, ${y})">
        ${branches}
        <ellipse cx="0" cy="0" rx="${size * 0.4}" ry="${size * 0.1}" fill="${this.lightenColor(color, 20)}"/>
      </g>
    `
  }
  
  private createJellyfish(x: number, y: number, size: number, color: string): string {
    const tentacles = Array.from({ length: 8 }, (_, i) => {
      const xOffset = (i - 3.5) * size * 0.15
      return `<path d="M ${xOffset} ${size * 0.3} Q ${xOffset + size * 0.1} ${size * 0.6} ${xOffset} ${size}" stroke="${color}" stroke-width="2" fill="none" opacity="0.5"/>`
    }).join('')
    
    return `
      <g transform="translate(${x}, ${y})">
        <path d="M -${size} 0 Q -${size} -${size * 0.5} 0 -${size * 0.5} Q ${size} -${size * 0.5} ${size} 0 Q ${size * 0.5} ${size * 0.3} 0 ${size * 0.3} Q -${size * 0.5} ${size * 0.3} -${size} 0 Z" 
              fill="${color}" opacity="0.6"/>
        ${tentacles}
      </g>
    `
  }
  
  private createVolcano(x: number, y: number, size: number, color: string): string {
    return `
      <g transform="translate(${x}, ${y})">
        <path d="M -${size} 0 L -${size * 0.4} -${size} L ${size * 0.4} -${size} L ${size} 0 Z" fill="${color}"/>
        <ellipse cx="0" cy="-${size}" rx="${size * 0.4}" ry="${size * 0.1}" fill="#FF4500"/>
        <path d="M -${size * 0.2} -${size} Q 0 -${size * 1.3} ${size * 0.2} -${size}" stroke="#FF6347" stroke-width="3" fill="none"/>
        ${Array.from({ length: 5 }, (_, i) => {
          const px = (Math.random() - 0.5) * size * 0.6
          const py = -size - Math.random() * size * 0.5
          return `<circle cx="${px}" cy="${py}" r="${size * 0.05}" fill="#FF4500" opacity="0.8"/>`
        }).join('')}
      </g>
    `
  }
  
  private createAurora(x: number, y: number, width: number, height: number, color: string): string {
    const waves = Array.from({ length: 3 }, (_, i) => {
      const yOffset = i * height * 0.3
      const opacity = 0.3 - i * 0.1
      return `<path d="M ${x} ${y + yOffset} Q ${width * 0.25} ${y + yOffset - height * 0.2} ${width * 0.5} ${y + yOffset} T ${width} ${y + yOffset}" 
                    stroke="${i === 0 ? color : this.lightenColor(color, 20 * i)}" stroke-width="${height * 0.5}" fill="none" opacity="${opacity}"/>`
    }).join('')
    
    return waves
  }
  
  private createComet(x: number, y: number, size: number, color: string): string {
    return `
      <g transform="translate(${x}, ${y})" filter="url(#glow)">
        <circle cx="0" cy="0" r="${size * 0.3}" fill="${color}"/>
        <path d="M 0 0 L ${size * 2} ${size * 0.3} L ${size * 2.5} 0 L ${size * 2} -${size * 0.3} Z" fill="url(#cometGradient)" opacity="0.6"/>
        <defs>
          <linearGradient id="cometGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:${color};stop-opacity:0" />
          </linearGradient>
        </defs>
      </g>
    `
  }
  
  private createRocket(x: number, y: number, size: number, color: string): string {
    return `
      <g transform="translate(${x}, ${y})">
        <path d="M 0 -${size} L ${size * 0.3} -${size * 0.3} L ${size * 0.3} ${size * 0.5} L ${size * 0.15} ${size * 0.7} L 0 ${size * 0.6} L -${size * 0.15} ${size * 0.7} L -${size * 0.3} ${size * 0.5} L -${size * 0.3} -${size * 0.3} Z" 
              fill="${color}"/>
        <path d="M 0 -${size} L ${size * 0.3} -${size * 0.3} L 0 -${size * 0.5} Z" fill="${this.lightenColor(color, 30)}"/>
        <circle cx="0" cy="-${size * 0.2}" r="${size * 0.15}" fill="#87CEEB" opacity="0.8"/>
        <path d="M -${size * 0.15} ${size * 0.6} L -${size * 0.1} ${size} L 0 ${size * 0.8} L ${size * 0.1} ${size} L ${size * 0.15} ${size * 0.6}" 
              fill="#FF4500" opacity="0.8"/>
        <ellipse cx="-${size * 0.35}" cy="${size * 0.2}" rx="${size * 0.1}" ry="${size * 0.3}" fill="${color}" transform="rotate(-20 -${size * 0.35} ${size * 0.2})"/>
        <ellipse cx="${size * 0.35}" cy="${size * 0.2}" rx="${size * 0.1}" ry="${size * 0.3}" fill="${color}" transform="rotate(20 ${size * 0.35} ${size * 0.2})"/>
      </g>
    `
  }
}

export function getImageGenerationService() {
  return new ImageGenerationService()
}
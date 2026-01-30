/**
 * Type definitions for homepage collection entries
 */

import type { CollectionEntry } from 'astro:content'

export type IconType = 'flame' | 'shield' | 'bar-chart' | 'file-text' | 'key' | 'zap'
export type PillarIconType = 'trending-up' | 'shield' | 'leaf'

export type HeroEntry = CollectionEntry<'homepage'> & {
  data: {
    type: 'hero'
    title: string
    subtitle: string
    tagline: string
    description: string
    primaryButton: {
      text: string
      href: string
      variant: 'neon' | 'prism'
    }
    secondaryButton?: {
      text: string
      href: string
      variant: 'neon' | 'prism'
    }
  }
}

export type FeatureEntry = CollectionEntry<'homepage'> & {
  data: {
    type: 'feature'
    icon: IconType
    title: string
    order: number
  }
  body: string
}

export type StepEntry = CollectionEntry<'homepage'> & {
  data: {
    type: 'step'
    number: number
    title: string
  }
  body: string
}

export type InstallationEntry = CollectionEntry<'homepage'> & {
  data: {
    type: 'installation'
    commands: Array<{
      label: string
      code: string
      recommended: boolean
    }>
  }
}

export type BlockquoteEntry = CollectionEntry<'homepage'> & {
  data: {
    type: 'blockquote'
    author: string
  }
  body: string
}

export type CTAEntry = CollectionEntry<'homepage'> & {
  data: {
    type: 'cta'
    title: string
    description: string
    primaryButton: {
      text: string
      href: string
    }
    secondaryButton?: {
      text: string
      href: string
    }
  }
}

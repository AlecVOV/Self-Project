# Simplified Animation System

## Overview

The simplified animation system replaces complex multi-property animations with performance-optimized alternatives. This system focuses on single-property animations, consistent timing, and hardware acceleration for better performance.

## Key Improvements

- **Single-property animations**: Each animation focuses on one CSS property (opacity, transform)
- **Consistent timing**: Standardized durations (200ms, 400ms, 500ms)
- **Hardware acceleration**: GPU-accelerated transforms for smooth performance
- **Reduced motion support**: Respects user preferences for accessibility
- **Mobile optimization**: Faster animations and smaller scales on mobile devices
- **Performance monitoring**: Built-in animation registry to limit concurrent animations

## Available Animation Classes

### Entrance Animations
- `.fade-in` - Simple opacity fade-in (400ms)
- `.slide-up` - Slide up with fade (500ms)
- `.slide-down` - Slide down with fade (500ms)
- `.slide-left` - Slide from right with fade (500ms)
- `.slide-right` - Slide from left with fade (500ms)

### Hover Effects
- `.hover-scale` - Standard scale on hover (1.02x)
- `.hover-scale-sm` - Small scale on hover (1.01x)
- `.hover-scale-lg` - Large scale on hover (1.05x)
- `.nav-underline` - Navigation underline effect
- `.btn-hover` - Button hover with lift and shadow

### Loading Animations
- `.pulse-simple` - Simple opacity pulse
- `.spinner` - Minimal loading spinner

### Page Transitions
- `.page-fade-*` - Simple opacity transitions
- `.page-slide-*` - Minimal slide transitions

## Usage Examples

### HTML Classes
```html
<!-- Entrance animation -->
<div class="fade-in">Content appears with fade</div>

<!-- Hover effect -->
<button class="btn hover-scale">Hover me</button>

<!-- Navigation link -->
<a href="#" class="nav-underline">Navigation Link</a>

<!-- Staggered animations -->
<div class="slide-up delay-100">First item</div>
<div class="slide-up delay-200">Second item</div>
<div class="slide-up delay-300">Third item</div>
```

### TypeScript Utilities
```typescript
import { AnimationUtils, ANIMATION_CLASSES } from '~/utils/animations'

// Apply entrance animation
AnimationUtils.applyEntranceAnimation(element, 'FADE_IN', 200)

// Apply hover effect
AnimationUtils.applyHoverAnimation(element, 'HOVER_SCALE')

// Staggered animations
AnimationUtils.applyStaggeredAnimation(elements, 'SLIDE_UP', 100)

// Check performance
const stats = AnimationUtils.getPerformanceStats()
console.log(`Active animations: ${stats.activeAnimations}`)
```

### Vue Composable
```vue
<script setup>
import { useSimplifiedAnimations } from '~/utils/animations'

const { AnimationUtils, ANIMATION_CLASSES } = useSimplifiedAnimations()

onMounted(() => {
  const element = document.querySelector('.animate-me')
  AnimationUtils.applyEntranceAnimation(element, 'FADE_IN')
})
</script>
```

## Performance Features

### Animation Registry
- Limits concurrent animations to 3 maximum
- Automatically queues additional animations
- Tracks active animations for performance monitoring

### Reduced Motion Support
- Automatically detects `prefers-reduced-motion` setting
- Disables animations for accessibility
- Provides instant state changes instead of animations

### Mobile Optimization
- 25% faster animation durations on mobile
- Smaller scale effects to reduce visual impact
- Optimized for touch interactions

## Migration Guide

### Replacing Old Classes

| Old Class | New Class | Notes |
|-----------|-----------|-------|
| `.float` | Remove | Complex floating animation removed |
| `.gallery-img-container` hover | `.hover-scale-sm` | Simplified hover effect |
| `.card` hover | `.hover-scale` | Standard hover scale |
| `.loading-shimmer` | `.pulse-simple` | Simple loading animation |
| `.text-reveal` | `.fade-in` | Simple fade-in entrance |
| Complex page transitions | `.page-fade-*` | Simplified transitions |

### Button Updates
```html
<!-- Old -->
<button class="btn">Button</button>

<!-- New -->
<button class="btn btn-hover">Button</button>
```

### Navigation Updates
```html
<!-- Old -->
<a href="#" class="nav-link">Link</a>

<!-- New -->
<a href="#" class="nav-underline">Link</a>
```

## Performance Monitoring

Use the animation utilities to monitor performance:

```typescript
// Get current stats
const stats = AnimationUtils.getPerformanceStats()

// Check if we can animate
if (animationRegistry.canAnimate()) {
  // Safe to start new animation
}

// Clear all animations if needed
animationRegistry.clear()
```

## Best Practices

1. **Use single-property animations** when possible
2. **Limit concurrent animations** to 3 or fewer
3. **Prefer transform and opacity** over layout-affecting properties
4. **Test on mobile devices** for performance
5. **Respect reduced motion preferences**
6. **Use hardware acceleration** for smooth animations
7. **Clean up animations** when components unmount
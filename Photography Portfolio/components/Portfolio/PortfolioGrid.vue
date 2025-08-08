<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="(photo, index) in displayedPhotos" 
        :key="photo.id"
        ref="portfolioItems"
        class="portfolio-item aspect-[3/4] rounded-sm overflow-hidden cursor-pointer"
        @click="openGallery(index)"
      >
        <img 
          :src="photo.image" 
          :alt="photo.title" 
          class="portfolio-img"
          loading="lazy"
        />
        <div class="portfolio-overlay">
          <div class="portfolio-content">
            <h3 class="portfolio-title">
              {{ photo.title }}
            </h3>
            <p class="portfolio-category">
              {{ photo.category }}
            </p>
            <div class="portfolio-view-badge">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Enhanced Image Lightbox -->
    <ImageLightbox
      :images="lightboxImages"
      :initial-index="currentGalleryIndex"
      :is-open="isGalleryOpen"
      @close="closeGallery"
      @index-change="handleIndexChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import ImageLightbox from '~/components/ImageLightbox.vue';
import { useFadeInOnScroll } from '~/composables/useIntersectionAnimation';

const props = defineProps({
  photos: {
    type: Array,
    required: true
  },
  category: {
    type: String,
    default: 'all'
  }
});

const isGalleryOpen = ref(false);
const currentGalleryIndex = ref(0);
const portfolioItems = ref([]);
const isTransitioning = ref(false);

// Initialize intersection observer for entrance animations
const { observeMultiple, cleanup } = useFadeInOnScroll({
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
  animationOptions: {
    duration: 600,
    type: 'enhancement'
  },
  once: false // Allow re-animation when switching categories
});

const displayedPhotos = computed(() => {
  if (props.category === 'all') {
    return props.photos;
  }
  return props.photos.filter(photo => photo.category === props.category);
});

// Transform photos for lightbox component
const lightboxImages = computed(() => {
  return displayedPhotos.value.map(photo => ({
    id: photo.id,
    image: photo.image,
    title: photo.title,
    category: photo.category
  }));
});

const openGallery = (index) => {
  currentGalleryIndex.value = index;
  isGalleryOpen.value = true;
};

const closeGallery = () => {
  isGalleryOpen.value = false;
};

// Smooth animation helper functions
const animateOut = (elements) => {
  return Promise.all(elements.map((element, index) => {
    return new Promise(resolve => {
      if (!element) {
        resolve();
        return;
      }
      
      // Staggered fade out
      setTimeout(() => {
        element.style.transition = 'opacity 300ms ease-out, transform 300ms ease-out';
        element.style.opacity = '0';
        element.style.transform = 'translateY(-10px) scale(0.95)';
        
        setTimeout(resolve, 300);
      }, index * 30);
    });
  }));
};

const animateIn = async (elements) => {
  // Reset elements to initial state
  elements.forEach((element, index) => {
    if (element) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'none';
    }
  });
  
  // Small delay to ensure DOM is ready
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Re-observe with intersection observer for smooth staggered entrance
  observeMultiple(elements, 80);
};

const handleIndexChange = (newIndex) => {
  currentGalleryIndex.value = newIndex;
};

// Set up intersection observer for portfolio items
onMounted(async () => {
  await nextTick();
  if (portfolioItems.value && portfolioItems.value.length > 0) {
    // Observe all portfolio items with a subtle stagger effect
    observeMultiple(portfolioItems.value, 80);
  }
});

// Watch for category changes and create smooth transitions
watch(() => props.category, async (newCategory, oldCategory) => {
  if (isTransitioning.value || !portfolioItems.value || portfolioItems.value.length === 0) {
    return;
  }
  
  isTransitioning.value = true;
  
  // Step 1: Animate out current items
  await animateOut(portfolioItems.value);
  
  // Step 2: Wait for DOM to update with new filtered items
  await nextTick();
  
  // Step 3: Animate in new items
  if (portfolioItems.value && portfolioItems.value.length > 0) {
    await animateIn(portfolioItems.value);
  }
  
  isTransitioning.value = false;
}, { flush: 'post' });
</script>

<style scoped>
/* Streamlined portfolio grid with smooth transitions */
.portfolio-item {
  position: relative;
  overflow: hidden;
  border-radius: 0.375rem;
  opacity: 0;
  transform: translateY(20px);
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1), 
              box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
}

.portfolio-item:hover {
  transform: scale(1.02) translateY(20px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.portfolio-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.portfolio-item:hover .portfolio-img {
  transform: scale(1.05);
}

.portfolio-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  opacity: 0;
  transition: opacity 350ms cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  color: white;
}

.portfolio-item:hover .portfolio-overlay {
  opacity: 1;
}

.portfolio-title {
  font-size: 1.25rem;
  font-family: serif;
  margin-bottom: 0.5rem;
  font-weight: 400;
}

.portfolio-category {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 0.75rem;
}

.portfolio-view-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  width: fit-content;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .portfolio-item {
    transition: none;
    opacity: 1;
    transform: none;
  }
  
  .portfolio-item:hover {
    transform: none;
    box-shadow: none;
  }
  
  .portfolio-overlay {
    transition: none;
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .portfolio-item {
    transition-duration: 250ms; /* Slightly faster on mobile */
  }
  
  .portfolio-item:hover {
    transform: scale(1.02) translateY(20px); /* Reduced scale for mobile */
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }
  
  .portfolio-overlay {
    transition-duration: 400ms; /* Faster on mobile */
  }
  
  .portfolio-img {
    transition-duration: 500ms; /* Slightly faster image transition */
  }
}
</style>
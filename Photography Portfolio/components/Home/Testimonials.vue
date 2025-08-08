<template>
  <section class="section">
    <div class="container-custom">
      <h2 
        class="section-title text-center"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 800 } }"
      >
        Peer Review
      </h2>
      
      <div class="relative">
        <div class="flex justify-center mt-8">
          <div class="max-w-3xl">
            <Transition name="slide" mode="out-in">
              <div 
                :key="currentTestimonial"
                class="text-center"
              >
                <div class="mb-8">
                  <svg class="mx-auto h-12 w-12 text-accent-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                  </svg>
                </div>
                <p class="text-lg md:text-xl italic mb-6">{{ testimonials[currentTestimonial].quote }}</p>
                <div class="flex items-center justify-center">
                  <img 
                    :src="testimonials[currentTestimonial].avatar" 
                    :alt="testimonials[currentTestimonial].name" 
                    class="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div class="text-left">
                    <p class="font-medium">{{ testimonials[currentTestimonial].name }}</p>
                    <p class="text-sm text-primary-500 dark:text-primary-400">{{ testimonials[currentTestimonial].role }}</p>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
        
        <div class="flex justify-center mt-10">
          <div class="flex space-x-3">
            <button 
              v-for="(testimonial, index) in testimonials" 
              :key="testimonial.id"
              @click="currentTestimonial = index"
              class="w-3 h-3 rounded-full transition-all duration-200 ease-out hover:scale-105"
              :class="currentTestimonial === index ? 'bg-accent-600 scale-125' : 'bg-primary-300 hover:bg-accent-500'"
              aria-label="Show testimonial"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const testimonials = [
  {
    id: 1,
    quote: "Working with LensCraft was an absolute dream. They captured our wedding day with such artistry and emotion. The photos tell our story in a way words never could.",
    name: "Sarah Johnson",
    role: "Bride",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 2,
    quote: "The family portraits exceeded our expectations. The photographer has an incredible ability to capture the personality of each family member while creating a cohesive collection.",
    name: "Michael Reynolds",
    role: "Family Client",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 3,
    quote: "As a brand manager, I needed photography that would elevate our product line. The commercial shots we received were stunning, professional, and perfectly represented our brand aesthetic.",
    name: "Emma Chen",
    role: "Marketing Director",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }
];

const currentTestimonial = ref(0);
let testimonialInterval;

const startTestimonialRotation = () => {
  testimonialInterval = setInterval(() => {
    currentTestimonial.value = (currentTestimonial.value + 1) % testimonials.length;
  }, 8000);
};

onMounted(() => {
  startTestimonialRotation();
});

onBeforeUnmount(() => {
  clearInterval(testimonialInterval);
});
</script>
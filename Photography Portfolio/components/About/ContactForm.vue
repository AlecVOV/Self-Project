<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <div>
      <label for="name" class="block text-sm font-medium mb-2">Name</label>
      <input 
        id="name" 
        v-model="form.name"
        type="text" 
        required
        class="w-full px-4 py-2 border border-primary-300 dark:border-primary-600 rounded-sm bg-white dark:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-500"
      />
    </div>
    
    <div>
      <label for="email" class="block text-sm font-medium mb-2">Email</label>
      <input 
        id="email" 
        v-model="form.email"
        type="email" 
        required
        class="w-full px-4 py-2 border border-primary-300 dark:border-primary-600 rounded-sm bg-white dark:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-500"
      />
    </div>
    
    <div>
      <label for="service" class="block text-sm font-medium mb-2">Service Interested In</label>
      <select 
        id="service" 
        v-model="form.service"
        class="w-full px-4 py-2 border border-primary-300 dark:border-primary-600 rounded-sm bg-white dark:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-500"
      >
        <option value="">Please select...</option>
        <option value="wedding">Wedding Photography</option>
        <option value="portrait">Portrait Photography</option>
        <option value="commercial">Commercial Photography</option>
        <option value="event">Event Photography</option>
        <option value="landscape">Landscape Photography</option>
        <option value="other">Other</option>
      </select>
    </div>
    
    <div>
      <label for="message" class="block text-sm font-medium mb-2">Message</label>
      <textarea 
        id="message" 
        v-model="form.message"
        rows="5" 
        required
        class="w-full px-4 py-2 border border-primary-300 dark:border-primary-600 rounded-sm bg-white dark:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-500"
      ></textarea>
    </div>
    
    <div>
      <button 
        type="submit" 
        class="btn btn-primary w-full"
        :disabled="isSubmitting"
        :class="{ 'opacity-50 cursor-not-allowed hover:scale-100': isSubmitting }"
      >
        <span v-if="isSubmitting">Sending...</span>
        <span v-else>Send Message</span>
      </button>
    </div>
    
    <div v-if="formSubmitted" class="text-center p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-sm">
      Thank you for your message! I'll get back to you soon.
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue';

const form = reactive({
  name: '',
  email: '',
  service: '',
  message: ''
});

const isSubmitting = ref(false);
const formSubmitted = ref(false);

const submitForm = async () => {
  isSubmitting.value = true;
  
  // Simulate form submission with timeout
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Reset form after submission
  form.name = '';
  form.email = '';
  form.service = '';
  form.message = '';
  
  formSubmitted.value = true;
  isSubmitting.value = false;
  
  // Hide success message after 5 seconds
  setTimeout(() => {
    formSubmitted.value = false;
  }, 5000);
};
</script>
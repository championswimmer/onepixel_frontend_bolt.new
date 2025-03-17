<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h2 class="text-center mb-4">Login to 1px.li</h2>
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                {{ loading ? 'Logging in...' : 'Login' }}
              </button>
              <div v-if="error" class="alert alert-danger mt-3">
                {{ error }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    router.push('/dashboard');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to login';
  } finally {
    loading.value = false;
  }
};
</script>
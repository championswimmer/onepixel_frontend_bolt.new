<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>URL Shortener</h1>
      <button class="btn btn-danger" @click="handleLogout">
        <LogOut class="me-2" :size="20" />
        Logout
      </button>
    </div>

    <!-- Create URL Form -->
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Create New Short URL</h5>
        <form @submit.prevent="handleCreateUrl">
          <div class="mb-3">
            <label for="longUrl" class="form-label">Long URL</label>
            <input
              type="url"
              class="form-control"
              id="longUrl"
              v-model="longUrl"
              required
            />
          </div>
          <div class="mb-3">
            <label for="customCode" class="form-label">Custom Short Code (Optional)</label>
            <input
              type="text"
              class="form-control"
              id="customCode"
              v-model="customCode"
              maxlength="9"
              pattern="[a-zA-Z0-9-_]+"
            />
            <small class="text-muted">Leave empty for random code. Max 9 characters, alphanumeric only.</small>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Creating...' : 'Create Short URL' }}
          </button>
        </form>
        <div v-if="error" class="alert alert-danger mt-3">
          {{ error }}
        </div>
      </div>
    </div>

    <!-- URLs List -->
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">My Short URLs</h5>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Short URL</th>
                <th>Original URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="url in urls" :key="url.short_url">
                <td>{{ url.short_url }}</td>
                <td class="text-truncate" style="max-width: 300px;">
                  {{ url.long_url }}
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-outline-primary me-2"
                    @click="copyToClipboard(url.short_url)"
                  >
                    <Copy :size="16" />
                  </button>
                  <button
                    class="btn btn-sm btn-outline-info"
                    @click="showUrlDetails(url.short_url.split('/').pop())"
                  >
                    <Info :size="16" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- URL Details Modal -->
    <BModal v-model="showModal" title="URL Details">
      <div v-if="urlDetails">
        <p><strong>Original URL:</strong> {{ urlDetails.long_url }}</p>
        <p><strong>Hit Count:</strong> {{ urlDetails.hit_count }}</p>
      </div>
    </BModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { LogOut, Copy, Info } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { useUrlStore } from '../stores/urls';
import type { UrlInfoResponse } from '../types/api';

const router = useRouter();
const authStore = useAuthStore();
const urlStore = useUrlStore();

const longUrl = ref('');
const customCode = ref('');
const loading = ref(false);
const error = ref('');
const showModal = ref(false);
const urlDetails = ref<UrlInfoResponse | null>(null);
const urls = ref<any[]>([]);

const handleCreateUrl = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    if (customCode.value) {
      await urlStore.createSpecificUrl(customCode.value, {
        long_url: longUrl.value,
      });
    } else {
      await urlStore.createRandomUrl({
        long_url: longUrl.value,
      });
    }
    
    longUrl.value = '';
    customCode.value = '';
    await fetchUrls();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to create short URL';
  } finally {
    loading.value = false;
  }
};

const fetchUrls = async () => {
  try {
    urls.value = await urlStore.fetchUrls();
  } catch (err) {
    console.error('Failed to fetch URLs');
    error.value = 'Failed to fetch URLs';
  }
};

const copyToClipboard = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
  } catch (err) {
    console.error('Failed to copy URL');
  }
};

const showUrlDetails = async (shortcode: string | undefined) => {
  if (!shortcode) return;
  
  try {
    urlDetails.value = await urlStore.getUrlInfo(shortcode);
    showModal.value = true;
  } catch (err) {
    console.error('Failed to fetch URL details');
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

onMounted(() => {
  fetchUrls();
});
</script>
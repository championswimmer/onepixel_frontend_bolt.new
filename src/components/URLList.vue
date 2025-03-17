<template>
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
import { ref } from 'vue';
import { Copy, Info } from 'lucide-vue-next';
import { useUrlStore } from '../stores/urls';
import type { UrlResponse, UrlInfoResponse } from '../types/api';

const props = defineProps<{
  urls: UrlResponse[]
}>();

const urlStore = useUrlStore();
const showModal = ref(false);
const urlDetails = ref<UrlInfoResponse | null>(null);

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
</script>
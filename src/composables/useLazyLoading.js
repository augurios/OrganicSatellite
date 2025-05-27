import { ref, computed, watch } from 'vue';

/**
 * Composable for handling lazy loading functionality
 * @param {Function} itemCountFn - Function that returns the total count of items to load
 * @param {Function} resetTriggerFn - Function that returns a reactive value to watch for resets
 * @param {Object} options - Configuration options
 * @param {string} options.loadingMessage - Custom loading message
 * @param {string} options.itemIdentifier - Function to extract unique identifier from items
 * @returns {Object} Lazy loading state and methods
 */
export function useLazyLoading(itemCountFn, resetTriggerFn = null, options = {}) {
  const {
    loadingMessage = 'Loading...',
    itemIdentifier = (item, index) => item?.id || item?.cover || index
  } = options;

  const loading = ref(true);
  const loadedItems = ref(new Set());

  const totalItems = computed(() => {
    const count = itemCountFn();
    return count || 0;
  });

  const handleItemLoad = (item, index) => {
    const identifier = itemIdentifier(item, index);
    loadedItems.value.add(identifier);
    
    // Check if all items are loaded
    if (loadedItems.value.size >= totalItems.value && totalItems.value > 0) {
      loading.value = false;
    }
  };

  const resetLoading = () => {
    loading.value = true;
    loadedItems.value.clear();
  };

  // Watch for changes in the trigger function (e.g., when data changes)
  if (resetTriggerFn) {
    watch(resetTriggerFn, (newVal) => {
      if (newVal && (Array.isArray(newVal) ? newVal.length > 0 : true)) {
        resetLoading();
      }
    }, { immediate: true });
  }

  return {
    loading: computed(() => loading.value),
    loadedItems: computed(() => loadedItems.value),
    totalItems,
    handleItemLoad,
    resetLoading,
    loadingMessage
  };
}

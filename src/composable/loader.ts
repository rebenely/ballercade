import { ref, type Ref } from 'vue';

const loaderVisible = ref(false);

export function useLoader(): {
  showLoader: () => void;
  hideLoader: () => void;
  loaderVisible: Ref<boolean>;
} {
  const showLoader = () => {
    loaderVisible.value = true;
  };
  const hideLoader = () => {
    loaderVisible.value = false;
  };
  return { showLoader, hideLoader, loaderVisible };
}

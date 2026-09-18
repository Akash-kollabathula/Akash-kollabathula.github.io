export type AvatarFilterStyle = 'terminal' | 'cyber' | 'natural';

const STORAGE_KEY = 'akash_custom_photo_v2';
const FILTER_STYLE_KEY = 'akash_avatar_filter_style_v1';

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notify() {
  listeners.forEach((l) => l());
}

let serverAvatarUrl: string | null = null;

// Check server disk for existing avatar
if (typeof window !== 'undefined') {
  fetch('/api/avatar')
    .then((res) => res.json())
    .then((data) => {
      if (data && data.exists && data.url) {
        serverAvatarUrl = data.url;
        notify();
      }
    })
    .catch(() => {});
}

export const avatarStore = {
  getPhotoUrl(): string {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (
        stored &&
        stored.trim().length > 0 &&
        (stored.startsWith('data:image') || stored.startsWith('blob:') || stored.startsWith('/'))
      ) {
        return stored;
      }
    } catch {
      // fallback
    }

    if (serverAvatarUrl) {
      return serverAvatarUrl;
    }

    return '';
  },

  hasPhoto(): boolean {
    const url = this.getPhotoUrl();
    return Boolean(url && url.length > 0);
  },

  getFilterStyle(): AvatarFilterStyle {
    return 'natural'; // Keep 100% natural, exact unedited image
  },

  setFilterStyle(_style: AvatarFilterStyle) {
    // Keep unedited real face
    notify();
  },

  cycleFilterStyle(): AvatarFilterStyle {
    return 'natural';
  },

  setCustomPhoto(dataUrl: string) {
    try {
      localStorage.setItem(STORAGE_KEY, dataUrl);
      serverAvatarUrl = dataUrl;
      notify();

      // Persist to server on disk
      if (dataUrl.startsWith('data:image')) {
        fetch('/api/upload-avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: dataUrl }),
        })
          .then((r) => r.json())
          .then((d) => {
            if (d && d.url) {
              serverAvatarUrl = d.url;
            }
          })
          .catch((err) => console.warn('Background avatar disk sync warning:', err));
      }
    } catch (err) {
      console.error('Failed to save custom photo to localStorage', err);
    }
  },

  resetPhoto() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      serverAvatarUrl = null;
      notify();
    } catch {
      // ignore
    }
  },

  hasCustomPhoto(): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored.trim().length > 0) return true;
      return Boolean(serverAvatarUrl);
    } catch {
      return false;
    }
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};



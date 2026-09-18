import { AKASH_PROFILE_IMAGE } from '../assets/avatar';

export type AvatarFilterStyle = 'terminal' | 'cyber' | 'natural';

export const avatarStore = {
  getPhotoUrl(): string {
    return AKASH_PROFILE_IMAGE;
  },

  hasPhoto(): boolean {
    return true;
  },

  getFilterStyle(): AvatarFilterStyle {
    return 'natural';
  },

  setFilterStyle(_style: AvatarFilterStyle) {},

  cycleFilterStyle(): AvatarFilterStyle {
    return 'natural';
  },

  setCustomPhoto(_dataUrl: string) {},

  resetPhoto() {},

  hasCustomPhoto(): boolean {
    return true;
  },

  subscribe(_listener: () => void) {
    return () => {};
  },
};




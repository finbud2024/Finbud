import type { PropType } from 'vue';

export const imgProps = {
  placeholder: {
    type: [Array, Boolean, Number, String] as PropType<Array<any> | boolean | number | string>,
    required: true,
  },
  placeholderClass: {
    type: String,
    required: true,
  },
  custom: {
    type: Boolean,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  quality: {
    type: [Number, String] as PropType<number | string>,
    required: true,
  },
  background: {
    type: String,
    required: true,
  },
  fit: {
    type: String,
    required: true,
  },
  modifiers: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
  preset: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  sizes: {
    type: [String, Object] as PropType<string | Record<string, any>>,
    required: true,
  },
  densities: {
    type: String,
    required: true,
  },
  preload: {
    type: [Boolean, Object] as PropType<boolean | { fetchPriority: 'auto' | 'high' | 'low' }>,
    required: true,
  },
  width: {
    type: [Number, String],
    required: true,
  },
  height: {
    type: [Number, String],
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  referrerpolicy: {
    type: String as PropType<string>,
    required: true,
  },
  usemap: {
    type: String,
    required: true,
  },
  longdesc: {
    type: String,
    required: true,
  },
  ismap: {
    type: Boolean,
    required: true,
  },
  loading: {
    type: String as PropType<'lazy' | 'eager'>,
    required: true,
    default: 'lazy',
    validator: (val: string) => val === 'lazy' || val === 'eager',
  },
  crossorigin: {
    type: String as PropType<'' | 'anonymous' | 'use-credentials'>,
    required: true,
    default: '',
    validator: (val: string) =>
      val === '' || val === 'anonymous' || val === 'use-credentials',
  },
  decoding: {
    type: String as PropType<'async' | 'auto' | 'sync'>,
    required: true,
    default: 'async',
    validator: (val: string) =>
      val === 'async' || val === 'auto' || val === 'sync',
  },
  nonce: {
    type: String, // Changed from [String] to String
    required: true,
  },
};

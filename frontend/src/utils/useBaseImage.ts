import { computed } from 'vue'
import type { ExtractPropTypes } from 'vue'

/**
 * BaseImageAttrs defines the attributes that will be applied to
 * the underlying image element.
 */
export interface BaseImageAttrs {
    width?: number;
    height?: number;
    alt?: string;
    referrerpolicy?: string; // (Originally: ImgHTMLAttributes['referrerpolicy'])
    usemap?: string;
    longdesc?: string;
    ismap?: boolean;
    crossorigin?: '' | 'anonymous' | 'use-credentials';
    loading?: 'lazy' | 'eager';
    decoding?: 'async' | 'auto' | 'sync';
    nonce?: string;
}

/**
 * Define baseImageProps which will be used in a component that uses
 * useBaseImage. These props include the common HTML attributes plus some
 * extra properties for image processing.
 */
export const baseImageProps = {
    // Attributes from BaseImageAttrs:
    width: {
        type: [Number, String],
        required: false,
    },
    height: {
        type: [Number, String],
        required: false,
    },
    alt: {
        type: String,
        required: false,
        default: '',
    },
    referrerpolicy: {
        type: String,
        required: false,
    },
    usemap: {
        type: String,
        required: false,
    },
    longdesc: {
        type: String,
        required: false,
    },
    ismap: {
        type: Boolean,
        required: false,
        default: false,
    },
    crossorigin: {
        type: String,
        required: false,
    },
    loading: {
        type: String,
        required: false,
        default: 'lazy',
        validator: (val: string) => val === 'lazy' || val === 'eager',
    },
    decoding: {
        type: String,
        required: false,
        default: 'async',
        validator: (val: string) => val === 'async' || val === 'auto' || val === 'sync',
    },
    nonce: {
        type: String,
        required: false,
    },
    // Additional props that might be used for image processing:
    provider: {
        type: String,
        required: false,
    },
    preset: {
        type: String,
        required: false,
    },
    modifiers: {
        type: Object,
        required: false,
        default: () => ({}),
    },
}

/**
 * useBaseImage composable:
 * Accepts props (extracted by ExtractPropTypes) and returns three computed values:
 * - options: an object with provider and preset.
 * - attrs: an object that maps to BaseImageAttrs, converting sizes if needed.
 * - modifiers: the extra modifier properties.
 */
export function useBaseImage(props: ExtractPropTypes<typeof baseImageProps>) {
    const options = computed(() => ({
        provider: props.provider,
        preset: props.preset,
    }));

    const attrs = computed<BaseImageAttrs>(() => {
        return {
            width: props.width !== undefined ? Number(props.width) : undefined,
            height: props.height !== undefined ? Number(props.height) : undefined,
            alt: props.alt,
            referrerpolicy: props.referrerpolicy,
            usemap: props.usemap,
            longdesc: props.longdesc,
            ismap: props.ismap,
            crossorigin: props.crossorigin as BaseImageAttrs['crossorigin'],
            loading: props.loading as BaseImageAttrs['loading'],
            decoding: props.decoding as BaseImageAttrs['decoding'],
            nonce: props.nonce,
        };
    });

    const modifiers = computed(() => props.modifiers || {});

    return { options, attrs, modifiers };
}

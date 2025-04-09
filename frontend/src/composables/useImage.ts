import { reactive } from 'vue'

// ---
// The following type definitions are provided for context.
// You can adjust them as needed in your project.
export type CreateImageOptions = {
  // Define defaults for image creation options.
  // (Fill in with your actual type details.)
};

export type ImageOptions = {
  modifiers?: any; // Adjust the type to your actual modifiers type.
  // You can add additional properties as needed.
};

export type ResolvedImage = {
  url: string;
};

export type ImageSizes = {
  src: string;
  srcset: string;
  sizes: string;
};

export type ImageInfo = any; // Replace with your actual type if available.

interface Img {
  (source: string, modifiers?: ImageOptions['modifiers'], options?: ImageOptions): ResolvedImage['url'];
  options: CreateImageOptions;
  getImage: (source: string, options?: ImageOptions) => ResolvedImage;
  getSizes: (source: string, options?: ImageOptions, sizes?: string[]) => ImageSizes;
  getMeta: (source: string, options?: ImageOptions) => Promise<ImageInfo>;
}

// $Img is defined as Img plus an index signature so that presets can be added.
export type $Img = Img & {
  [preset: string]: $Img;
};
// ---
//
// Now we define the Vue‑compatible composable.

export function useImage(): $Img {
  // Create a base function that processes an image.
  // For demonstration, we'll simply return the source URL.
  const baseFn = ((source: string, modifiers?: any, options?: any) => {
    // Replace this with your actual image processing logic.
    return source;
  }) as unknown as Img;
  
  // Provide default options (fill these with your actual default values)
  baseFn.options = {
    // For example: defaultQuality: 75, defaultFormat: 'webp'
  };

  // Implement additional methods:
  baseFn.getImage = (source: string, options?: ImageOptions) => {
    // Process and return a resolved image.
    return { url: source };
  };

  baseFn.getSizes = (source: string, options?: ImageOptions, sizes?: string[]) => {
    // Generate and return responsive size data.
    return {
      src: source,
      srcset: '', // Replace with proper srcset generation logic.
      sizes: sizes ? sizes.join(', ') : '',
    };
  };

  baseFn.getMeta = async (source: string, options?: ImageOptions) => {
    // Return image meta data (e.g., dimensions, format, etc.)
    return {};
  };

  // Now cast baseFn to $Img:
  const img = baseFn as $Img;

  // Add a preset as an example.
  // The preset key (e.g. "thumbnail") maps to another $Img function,
  // which may, for example, change modifiers/options.
  img.thumbnail = ((source: string, modifiers?: any, options?: any) => {
    // Here, for demonstration, simply append a query parameter.
    // In a real scenario, you would adjust width/height/quality etc.
    return source + '?preset=thumbnail';
  }) as $Img;

  // Return the enhanced function.
  return img;
}

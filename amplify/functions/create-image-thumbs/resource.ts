import { defineFunction } from '@aws-amplify/backend';

export const createImageThumbs = defineFunction({
  name: 'gen-image-thumbs',
  entry: './handler.ts',
  runtime: 20,
  environment: {
    TARGET_BUCKET_NAME: 'pets/image-thumbs',
    SOURCE_BUCKET_NAME: 'pets',
  },
  memoryMB: 256,
});

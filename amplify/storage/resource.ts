import { defineFunction, defineStorage } from '@aws-amplify/backend';
import { createImageThumbs } from '../functions/create-image-thumbs/resource';

export const storage = defineStorage({
  name: 'amplifyPetShop',
  triggers: {
    onUpload: defineFunction({
      entry: '../functions/create-image-thumbs/handler.ts',
      environment: {
        TARGET_BUCKET_NAME: 'pets-thumbs',
      },
    }),
  },
  access: (allow) => ({
    'owner-pictures/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'delete', 'write']),
    ],
    'pets-thumbs/*': [
      allow.guest.to(['read']),
      allow.resource(createImageThumbs).to(['read', 'write', 'delete']),
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
    'pets/*': [
      allow.guest.to(['read']),
      allow.resource(createImageThumbs).to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
  }),
});

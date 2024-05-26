import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { CustomS3 } from './custom/CustomS3/resource';
import { storage } from './storage/resource';
import { createImageThumbs } from './functions/create-image-thumbs/resource';

const backend = defineBackend({
  auth,
  data,
  storage,
  createImageThumbs,
});

const customS3 = new CustomS3(
  backend.createStack('CustomS3'),
  'CustumS3ForOwnerPicture',
  {
    prefix: 'petshop',
    bucket: 'owner-pictures',
  }
);

import { a } from '@aws-amplify/backend';

enum PetCategory {
  DOG,
  CAT,
  BIRD,
  FISH,
  CHIEN,
}

export const petsSchema = {
  PetOwner: a
    .model({
      OwnerID: a.id(),
      Name: a.string().required(),
      Email: a.email().required(),
      Phone: a.phone(),
      Bio: a.string(),
      Pets: a.hasMany('Pet', 'ID'),
      Picture: a.url(),
    })
    .authorization((allow) => allow.publicApiKey()),
  PetKind: a.enum(['FEMALE', 'MALE']),
  PetCategorySchema: a.enum(
    Object.keys(PetCategory).filter((v) => isNaN(v as any))
  ),
  Pet: a
    .model({
      ID: a.id(),
      NickelName: a.string().required(),
      Price: a.integer().required(),
      Category: a.ref('PetCategorySchema').required(),
      Breed: a.string(),
      Rate: a.float().default(0.0),
      Kind: a.ref('PetKind'),
      BornDate: a.date().required(),
      Weight: a.float(),
      PetBio: a.string(),
      OwnerID: a.id(),
      Owner: a.belongsTo('PetOwner', 'OwnerID'),
      Images: a.url().array(),
      DefaultImage: a.url(),
    })
    .authorization((allow) => allow.authenticated()),
};

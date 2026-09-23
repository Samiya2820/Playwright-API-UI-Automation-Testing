import { faker } from '@faker-js/faker';
import { Pet, PetStatus } from '../api/types';

/**
 * The Petstore is one shared public server, so our pet's id must not collide with anyone else's.
 * Milliseconds since 1970 x 1000 + a random 0-999 gives a unique 16-digit number
 * (about 1.79e15), safely below JavaScript's largest exact integer (about 9.0e15).
 */
export function uniquePetId(): number {
  return Date.now() * 1000 + faker.number.int({ min: 0, max: 999 });
}

/** Builds a pet full of random data. Pass overrides to fix particular fields. */
export function buildPet(overrides: Partial<Pet> = {}): Pet {
  return {
    id: uniquePetId(),
    category: { id: faker.number.int({ min: 1, max: 100 }), name: faker.animal.type() },
    name: `${faker.animal.dog()}-${faker.string.alphanumeric(5)}`,
    photoUrls: [faker.image.url()],
    tags: [{ id: faker.number.int({ min: 1, max: 100 }), name: faker.word.noun() }],
    status: faker.helpers.arrayElement<PetStatus>(['available', 'pending', 'sold']),
    ...overrides,
  };
}

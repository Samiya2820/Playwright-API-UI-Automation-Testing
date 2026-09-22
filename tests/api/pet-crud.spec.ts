import { test, expect } from '@playwright/test';
import { PetClient } from '../../src/api/petClient';
import { ApiMessage, Pet } from '../../src/api/types';
import { buildPet } from '../../src/utils/testData';

test.describe('Petstore API - CRUD Operations', () => {
  // The four tests depend on each other (update needs the pet that create made),
  // so run them in order and skip the rest if one fails.
  test.describe.configure({ mode: 'serial' });

  // One randomly generated pet, shared by all four tests.
  const pet = buildPet();

  // Safety net: if a test failed half-way, remove our pet from the shared server.
  test.afterAll(async ({ request }) => {
    await new PetClient(request).delete(pet.id);
  });

  test('4. create a pet', async ({ request }) => {
    const response = await new PetClient(request).create(pet);

    await expect(response).toBeOK();
    expect(response.headers()['content-type']).toContain('application/json');
    expect(await response.json()).toMatchObject({ id: pet.id, name: pet.name });
  });

  test('5. read the pet back by its id', async ({ request }) => {
    const response = await new PetClient(request).getById(pet.id);

    await expect(response).toBeOK();
    expect(await response.json()).toMatchObject({ id: pet.id, name: pet.name, status: pet.status });
  });

  test('6. update the pet name', async ({ request }) => {
    const client = new PetClient(request);
    const updated: Pet = { ...pet, name: `${pet.name}-updated` };

    const response = await client.update(updated);
    await expect(response).toBeOK();
    expect(await response.json()).toMatchObject({ id: pet.id, name: updated.name });

    // Read it again to prove the change was saved, not just echoed back.
    const reread = await client.getById(pet.id);
    expect(await reread.json()).toMatchObject({ id: pet.id, name: updated.name });
  });

  test('7. delete the pet and confirm it is gone', async ({ request }) => {
    const client = new PetClient(request);

    const deleted = await client.delete(pet.id);
    await expect(deleted).toBeOK();
    expect(await deleted.json()).toMatchObject({ code: 200, message: String(pet.id) });

    // A later GET must now fail with "not found".
    const afterDelete = await client.getById(pet.id);
    expect(afterDelete.status()).toBe(404);
    const body: ApiMessage = await afterDelete.json();
    expect(body.message).toBe('Pet not found');
  });
});

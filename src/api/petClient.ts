import { APIRequestContext, APIResponse, test } from '@playwright/test';
import { Pet } from './types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** Typed client for the Pet endpoints (the API equivalent of a page object); each call is logged to the HTML report as a step. */
export class PetClient {
  constructor(private readonly request: APIRequestContext) {}

  /** POST /v2/pet: create a pet. */
  create(pet: Pet): Promise<APIResponse> {
    return this.send('POST', 'pet', pet);
  }

  /** GET /v2/pet/{id}: read one pet. */
  getById(id: number): Promise<APIResponse> {
    return this.send('GET', `pet/${id}`);
  }

  /** PUT /v2/pet: replace a pet with the object we send (so send the whole pet). */
  update(pet: Pet): Promise<APIResponse> {
    return this.send('PUT', 'pet', pet);
  }

  /** DELETE /v2/pet/{id}: remove a pet. */
  delete(id: number): Promise<APIResponse> {
    return this.send('DELETE', `pet/${id}`);
  }

  /** Sends one request and records it (request + response) in the HTML report. */
  private async send(method: HttpMethod, path: string, data?: Pet): Promise<APIResponse> {
    return test.step(`${method} ${path}`, async () => {
      const info = test.info();

      await info.attach(`${method} ${path}: request`, {
        body: JSON.stringify({ method, path, body: data ?? null }, null, 2),
        contentType: 'application/json',
      });

      const response = await this.request.fetch(path, { method, data });

      // Show the body as JSON when it is JSON; otherwise (e.g. an empty 404) keep the raw text.
      const text = await response.text();
      let body: unknown = text;
      try {
        body = JSON.parse(text);
      } catch {
        // not JSON: keep the raw text
      }

      await info.attach(`${method} ${path}: response ${response.status()}`, {
        body: JSON.stringify(
          {
            url: response.url(),
            status: response.status(),
            statusText: response.statusText(),
            headers: response.headers(),
            body,
          },
          null,
          2,
        ),
        contentType: 'application/json',
      });

      return response;
    });
  }
}

// The shape of the data the Petstore API sends and receives.

export type PetStatus = 'available' | 'pending' | 'sold';

export type Category = {
  id: number;
  name: string;
};

export type Tag = {
  id: number;
  name: string;
};

export type Pet = {
  id: number;
  category: Category;
  name: string;
  photoUrls: string[];
  tags: Tag[];
  status: PetStatus;
};

/** The small "message" object the API returns for deletes and errors, e.g. "Pet not found". */
export type ApiMessage = {
  code: number;
  type: string;
  message: string;
};

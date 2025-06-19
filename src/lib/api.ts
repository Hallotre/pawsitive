const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://v2.api.noroff.dev';

const API_HEADERS = {
  'Authorization': `Bearer ${process.env.API_BEARER_TOKEN}`,
  'X-Noroff-API-Key': process.env.API_KEY || '',
  'Content-Type': 'application/json',
};

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  size: string;
  color: string;
  description: string;
  image?: {
    url: string;
    alt: string;
  };
  created: string;
  updated: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    isFirstPage: boolean;
    isLastPage: boolean;
    currentPage: number;
    previousPage: number | null;
    nextPage: number | null;
    pageCount: number;
    totalCount: number;
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_HEADERS,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Pet API functions
export async function getPets(page: number = 1, limit: number = 12): Promise<ApiResponse<Pet[]>> {
  return apiRequest<Pet[]>(`/pets?page=${page}&limit=${limit}`);
}

export async function getPetById(id: string): Promise<ApiResponse<Pet>> {
  return apiRequest<Pet>(`/pets/${id}`);
}

export async function searchPets(query: string, page: number = 1): Promise<ApiResponse<Pet[]>> {
  const searchParams = new URLSearchParams({
    q: query,
    page: page.toString(),
  });
  return apiRequest<Pet[]>(`/pets?${searchParams.toString()}`);
}

// Authentication functions (for admin features)
export async function login(email: string, password: string) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name: string, email: string, password: string) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

// Admin pet management functions
export async function createPet(petData: Omit<Pet, 'id' | 'created' | 'updated'>) {
  return apiRequest('/pets', {
    method: 'POST',
    body: JSON.stringify(petData),
  });
}

export async function updatePet(id: string, petData: Partial<Pet>) {
  return apiRequest(`/pets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(petData),
  });
}

export async function deletePet(id: string) {
  return apiRequest(`/pets/${id}`, {
    method: 'DELETE',
  });
} 
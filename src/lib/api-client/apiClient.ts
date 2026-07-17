import { getSession } from 'next-auth/react';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export const apiClient = async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { params, headers, ...customOptions } = options;

  let url = endpoint.startsWith('http') ? endpoint : `/api/v1${endpoint}`;

  if (params) {
    const urlObj = new URL(url, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        urlObj.searchParams.append(key, String(value));
      }
    });
    url = urlObj.toString();
  }

  const session = await getSession();

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (session?.user?.id) {
    // Note: Next-Auth handles cookies automatically for local routes, but we can explicitly inject headers if needed
    defaultHeaders['x-user-id'] = session.user.id;
  }

  // Generate a Request ID
  defaultHeaders['x-request-id'] = crypto.randomUUID();
  defaultHeaders['x-correlation-id'] = crypto.randomUUID();

  const config: RequestInit = {
    ...customOptions,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw new ApiError(response.status, errorData?.error?.message || 'API request failed', errorData);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();
  
  // Unwrap standard response wrapper if present
  if (data && 'success' in data && 'data' in data) {
    return data.data as T;
  }
  
  return data as T;
};

export const api = {
  get: <T>(url: string, params?: RequestOptions['params'], options?: RequestOptions) => 
    apiClient<T>(url, { method: 'GET', params, ...options }),
    
  post: <T>(url: string, data?: any, options?: RequestOptions) => 
    apiClient<T>(url, { method: 'POST', body: JSON.stringify(data), ...options }),
    
  put: <T>(url: string, data?: any, options?: RequestOptions) => 
    apiClient<T>(url, { method: 'PUT', body: JSON.stringify(data), ...options }),
    
  patch: <T>(url: string, data?: any, options?: RequestOptions) => 
    apiClient<T>(url, { method: 'PATCH', body: JSON.stringify(data), ...options }),
    
  delete: <T>(url: string, options?: RequestOptions) => 
    apiClient<T>(url, { method: 'DELETE', ...options }),
};

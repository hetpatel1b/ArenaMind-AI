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

export const apiClient = async <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
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

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

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

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    // Network-level errors (e.g. "Failed to fetch" when the server is unreachable)
    throw new ApiError(0, err instanceof Error ? err.message : 'Network request failed');
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw new ApiError(
      response.status,
      errorData?.error?.message || 'API request failed',
      errorData
    );
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

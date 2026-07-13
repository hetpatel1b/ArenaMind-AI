import { NextResponse } from 'next/server';
import { PaginatedMeta } from '@/types/api.types';

/**
 * Standardized API response format as per TRD API specifications.
 */

export function successResponse<T>(data: T, status = 200, meta?: Record<string, unknown>) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta ? { meta } : {}),
    },
    { status }
  );
}

export function paginatedResponse<T>(data: T[], meta: PaginatedMeta, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      meta,
    },
    { status }
  );
}

export function errorResponse(message: string, code: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}

import { NextResponse } from 'next/server';
import { PaginatedMeta } from '@/types/api.types';
import crypto from 'crypto';

/**
 * Standardized API response format as per TRD API specifications.
 */

function generateBaseResponse() {
  return {
    timestamp: new Date().toISOString(),
    requestId: crypto.randomUUID(),
  };
}

export function successResponse<T>(
  data: T,
  status = 200,
  meta?: Record<string, SafeAny>,
  headers?: HeadersInit
) {
  return NextResponse.json(
    {
      success: true,
      data,
      error: null,
      ...(meta ? { meta } : {}),
      ...generateBaseResponse(),
    },
    { status, headers }
  );
}

export function paginatedResponse<T>(data: T[], meta: PaginatedMeta, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      error: null,
      meta,
      ...generateBaseResponse(),
    },
    { status }
  );
}

export function errorResponse(message: string, code: string, status = 400, details?: SafeAny) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: {
        code,
        message,
        details,
      },
      ...generateBaseResponse(),
    },
    { status }
  );
}

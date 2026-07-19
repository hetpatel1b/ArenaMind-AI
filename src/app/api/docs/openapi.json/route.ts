import { NextResponse } from 'next/server';
import { generateOpenApiDocument } from '@/lib/api/openapi';
import '@/lib/api/openapi-routes'; // execute route registrations
// Import modules to ensure schemas are registered
import '@/lib/modules/incidents/dto';
import '@/lib/modules/resources/dto';
import '@/lib/modules/crowd/dto';
import '@/lib/modules/accessibility/dto';
import '@/lib/modules/alerts/dto';
import '@/lib/modules/reports/dto';

export async function GET() {
  try {
    const doc = generateOpenApiDocument();
    return NextResponse.json(doc);
  } catch (err) {
    console.error('Error generating OpenAPI spec', err);
    return NextResponse.json({ error: 'Failed to generate API docs' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandler } from '@/lib/api/route-factory';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProvisioningService } from '@/lib/modules/provisioning/service';
import { prisma } from '@/lib/db/client';

export const POST = createRouteHandler(
  async (req: NextRequest) => {
    // Manually authenticate against Supabase, bypassing the RouteFactory Prisma requirement
    // because the User record does not exist in the application database yet.
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Enforce idempotency: If the user already has a workspace, do not provision again.
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (existingUser) {
      return NextResponse.json({
        message: 'Workspace already provisioned',
        stadiumId: existingUser.stadiumId,
      });
    }

    // Provision the workspace
    const provisioningService = new ProvisioningService();
    const result = await provisioningService.provisionDemoWorkspace(
      user.id,
      user.user_metadata?.full_name || 'Demo Operator'
    );

    return NextResponse.json(result, { status: 201 });
  },
  {
    requireAuth: false, // We handle auth manually inside to avoid Prisma user check
    rateLimit: { windowMs: 60000, maxRequests: 5 }, // Strict rate limiting to prevent spam
  }
);

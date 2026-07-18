'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

import { ProvisioningService } from '@/lib/modules/provisioning/service';
import { prisma } from '@/lib/db/client';
import bcrypt from 'bcrypt';

export async function registerOperator(data: {
  email: string;
  password: string;
  name: string;
  organization: string;
}) {
  try {
    const supabase = await createServerSupabaseClient();

    const { error: signUpError, data: authData } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.name,
          organization: data.organization,
          role: 'operations_manager_demo',
        },
      },
    });

    if (signUpError) {
      return { error: signUpError.message };
    }

    if (!authData.user) {
      return { error: 'Failed to retrieve user from Supabase.' };
    }

    const userId = authData.user.id;

    // Provision the workspace if it doesn't exist
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      const provisioningService = new ProvisioningService();
      await provisioningService.provisionDemoWorkspace(userId, data.name || 'Demo Operator');
    }

    // Update the Prisma User with the email and bcrypt password so NextAuth can log them in
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred during registration.' };
  }
}

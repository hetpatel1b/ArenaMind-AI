import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { api } from './apiClient';

export interface BaseMutationOptions<TData, TVariables, TContext> extends Omit<
  UseMutationOptions<TData, Error, TVariables, TContext>,
  'mutationFn'
> {
  optimisticUpdate?: (
    queryClient: ReturnType<typeof useQueryClient>,
    variables: TVariables
  ) => TContext | void | Promise<TContext | void>;
  invalidateKeys?: readonly (readonly unknown[])[];
}

export function useGenericMutation<TData = unknown, TVariables = unknown, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: BaseMutationOptions<TData, TVariables, TContext>
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables, TContext>({
    mutationFn,
    onMutate: async (variables) => {
      if (options?.optimisticUpdate) {
        // Cancel any outgoing refetches to avoid overwriting optimistic update
        if (options.invalidateKeys) {
          for (const key of options.invalidateKeys) {
            await queryClient.cancelQueries({ queryKey: key });
          }
        }

        // Execute optimistic update
        const context = await options.optimisticUpdate(queryClient, variables);
        return context as TContext;
      }
      return {} as TContext;
    },
    onError: (err, variables, context: SafeAny) => {
      // Rollback optimistic updates using context
      if (context?.previousData) {
        Object.entries(context.previousData).forEach(([key, value]) => {
          queryClient.setQueryData(JSON.parse(key), value);
        });
      }
      if (options?.onError) {
        // @ts-expect-error TypeScript cannot infer full context type in wrapper
        options.onError(err, variables, context);
      }
    },
    onSettled: (data, error, variables, context) => {
      // Always refetch after error or success to synchronize
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      if (options?.onSettled) {
        // @ts-expect-error TypeScript cannot infer full context type in wrapper
        options.onSettled(data, error, variables, context);
      }
    },
    ...options,
  });
}

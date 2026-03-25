import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Accident = Tables<'accidents'>;
export type AccidentInsert = TablesInsert<'accidents'>;
export type AccidentUpdate = TablesUpdate<'accidents'>;

export function useAccidents() {
  return useQuery({
    queryKey: ['accidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accidents')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Accident[];
    },
  });
}

export function useAccidentStats() {
  const { data: accidents, ...rest } = useAccidents();

  const stats = accidents
    ? {
        total: accidents.length,
        bySeverity: {
          minor: accidents.filter((a) => a.severity === 'minor').length,
          moderate: accidents.filter((a) => a.severity === 'moderate').length,
          severe: accidents.filter((a) => a.severity === 'severe').length,
          fatal: accidents.filter((a) => a.severity === 'fatal').length,
        },
        byStatus: {
          pending: accidents.filter((a) => a.status === 'pending').length,
          verified: accidents.filter((a) => a.status === 'verified').length,
          dispatched: accidents.filter((a) => a.status === 'dispatched').length,
          resolved: accidents.filter((a) => a.status === 'resolved').length,
        },
        byType: accidents.reduce((acc, a) => {
          acc[a.type] = (acc[a.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      }
    : null;

  return { stats, accidents, ...rest };
}

export function useCreateAccident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (accident: AccidentInsert) => {
      const { data, error } = await supabase
        .from('accidents')
        .insert(accident)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accidents'] });
    },
  });
}

export function useUpdateAccident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: AccidentUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('accidents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accidents'] });
    },
  });
}

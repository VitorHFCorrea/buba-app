import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ApprenticeSession } from '@/types/apprentice';

export const useApprenticeStars = () => {
  const [stars, setStars] = useState<number>(0);
  const [memoryRecord, setMemoryRecord] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<ApprenticeSession | null>(null);

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (session?.apprentice_id) {
      loadStars();
    }
  }, [session]);

  const loadSession = () => {
    const sessionData = localStorage.getItem('apprentice_session');
    if (sessionData) {
      const parsedSession = JSON.parse(sessionData) as ApprenticeSession;
      setSession(parsedSession);
    }
  };

  const loadStars = async () => {
    if (!session?.apprentice_id) return;

    try {
      const { data, error } = await supabase
        .from('apprentices')
        .select('stars, memory_record')
        .eq('id', session.apprentice_id)
        .single();

      if (error) throw error;
      
      setStars(data?.stars || 0);
      setMemoryRecord(data?.memory_record || 0);
    } catch (error) {
      console.error('Error loading stars:', error);
    } finally {
      setLoading(false);
    }
  };

  const addStars = async (amount: number) => {
    if (!session?.apprentice_id) return;

    try {
      const newStars = stars + amount;
      
      const { error } = await supabase
        .from('apprentices')
        .update({ stars: newStars })
        .eq('id', session.apprentice_id);

      if (error) throw error;
      
      setStars(newStars);
      return newStars;
    } catch (error) {
      console.error('Error adding stars:', error);
      throw error;
    }
  };

  const updateMemoryRecord = async (level: number) => {
    if (!session?.apprentice_id) return false;

    try {
      const isNewRecord = level > memoryRecord;
      
      if (isNewRecord) {
        const { error } = await supabase
          .from('apprentices')
          .update({ memory_record: level })
          .eq('id', session.apprentice_id);

        if (error) throw error;
        
        setMemoryRecord(level);
      }
      
      return isNewRecord;
    } catch (error) {
      console.error('Error updating memory record:', error);
      throw error;
    }
  };

  return {
    stars,
    memoryRecord,
    loading,
    session,
    addStars,
    updateMemoryRecord,
    refreshStars: loadStars,
  };
};

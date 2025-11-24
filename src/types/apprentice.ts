export interface Apprentice {
  id: string;
  tutor_id: string;
  name: string;
  age: number;
  gender?: 'masculino' | 'feminino' | 'outro' | 'prefiro_nao_dizer';
  support_level?: 'nivel_1' | 'nivel_2' | 'nivel_3';
  relationship?: 'filho' | 'filha' | 'aluno' | 'aluna' | 'paciente' | 'neto' | 'neta' | 'sobrinho' | 'sobrinha' | 'primo' | 'prima' | 'amigo' | 'amiga';
  username: string;
  pin: string;
  stars: number;
  created_at: string;
  updated_at: string;
}

export interface ApprenticeCredentials {
  username: string;
  pin: string;
}

export interface ApprenticeLoginResponse {
  success: boolean;
  apprentice_id?: string;
  name?: string;
  tutor_id?: string;
  error?: string;
  message?: string;
  attempts_left?: number;
}

export interface ApprenticeSession {
  apprentice_id: string;
  name: string;
  tutor_id: string;
  logged_in_at: number;
}

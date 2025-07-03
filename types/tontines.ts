// Types TypeScript alignés sur l'API
export interface Tontine {
  id: string;
  nom: string;
  description?: string;
  montantMinMise: string;
  montantMaxMise: string;
  reglesRetrait?: any;
  dateCreation: string;
  statut: 'active' | 'fermee' | 'suspendue';
  fraisAdhesion: string;
  date_modification: string;
  administrateurId: string;
  participants: TontineParticipant[];
}

export interface TontineParticipant {
  id: string;
  client: any;
  tontine: string;
  dateAdhesion: string;
  montantCotisation: string;
  statut: string;
  rang?: number;
  soldeActuel?: string;
}

// Interface corrigée selon l'API
export interface CreateTontineData {
  nom: string;
  description?: string;
  montantMinMise: string;
  montantMaxMise: string;
  fraisAdhesion: string;
  administrateurId: string;
  statut?: 'active' | 'fermee' | 'suspendue';
}

export interface UpdateTontineData {
  nom?: string;
  montantMinMise?: string;
  montantMaxMise?: string;
  reglesRetrait?: any;
  statut?: 'active' | 'fermee' | 'suspendue';
  fraisAdhesion?: string;
  administrateurId?: string;
}
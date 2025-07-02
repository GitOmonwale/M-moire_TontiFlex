// src/types/tontines.ts

export interface Tontine {
    id: string; // UUID
    nom: string;
    description?: string;
    nombre_participants: string; // readonly
    montantMinMise: string; // decimal
    montantMaxMise: string; // decimal
    reglesRetrait?: any; // Object for withdrawal rules
    dateCreation?: string; // datetime
    statut: 'active' | 'fermee' | 'suspendue';
    fraisAdhesion?: string; // decimal
    date_modification: string; // readonly datetime
    administrateurId: string; // UUID
    participants: TontineParticipant[]; // readonly
  }
  
  export interface TontineParticipant {
    id: string;
    client: {
      id: string;
      nom_complet: string;
      email: string;
      numero_telephone: string;
    };
    date_adhesion: string;
    montant_cotisation: string;
    rang_distribution?: number;
    statut_participation: 'actif' | 'suspendu' | 'retire';
    solde_actuel: string;
    total_cotisations_versees: string;
    cotisations_manquees: number;
    prochaine_distribution?: string;
  }
  
  export interface TontineCreateData {
    nom: string;
    description?: string;
    sfd?: number; // ID du SFD
    montant_min_cotisation: number;
    montant_max_cotisation: number;
    frais_adhesion?: number;
    commission_sfd?: number;
    nombre_max_participants?: number;
    est_active?: boolean;
  }
  
  export interface TontineUpdateData {
    nom?: string;
    montantMinMise?: string;
    montantMaxMise?: string;
    reglesRetrait?: any;
    dateCreation?: string;
    statut?: 'active' | 'fermee' | 'suspendue';
    fraisAdhesion?: string;
    administrateurId?: string;
  }
  
  export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  }
  
  export interface TontineFilters {
    page?: number;
    search?: string;
    statut?: 'active' | 'fermee' | 'suspendue';
    sfd?: string;
  }
  
  export interface ApiError {
    message: string;
    details?: any;
    status?: number;
  }
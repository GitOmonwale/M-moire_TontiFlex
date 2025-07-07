// Types TypeScript basés sur l'API
export interface SFDInfo {
  id: string;
  nom: string;
}

export interface AgentSFDAdmin {
  nom: string; // maxLength: 100
  prenom: string; // maxLength: 100
  telephone: string; // pattern: ^\+?1?\d{9,15}$, maxLength: 15
  email: string; // email, maxLength: 254
  adresse: string; // Adresse physique complète
  profession: string; // maxLength: 100
  est_actif: boolean; // Indique si l'agent est actuellement actif
  sfd: SFDInfo; // Informations de la SFD rattachée
}

export interface CreateAgentSFDData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  motDePasse: string; // Requis uniquement pour la création
  adresse: string;
  profession: string;
  sfd_id: string; // ID de la SFD de rattachement
  est_actif?: boolean;
}

export interface UpdateAgentSFDData {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  motDePasse?: string;
  adresse?: string;
  profession?: string;
  sfd_id?: string;
  est_actif?: boolean;
}

export interface PaginatedAgentSFDAdminList {
  count: number;
  next: string | null;
  previous: string | null;
  results: AgentSFDAdmin[];
}

export interface AgentSFDFilters {
  page?: number;
  search?: string;
  sfd_id?: string;
  est_actif?: boolean;
}
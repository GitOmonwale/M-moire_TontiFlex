import {
    Home,
    Users,
    PiggyBank,
    FileText,
    Bell,
    User,
    CreditCard,
    File,
    Book,
    LogIn
  } from 'lucide-react';
  import { RoleKey } from '@/constants/roles';
  
  export interface SidebarItem {
    id: number;
    label: string;
    icon: React.ElementType;
    link: string;
    description?: string;
    badge?: number;
  }
  
  export const sidebarItemsByRole: Record<RoleKey, SidebarItem[]> = {
    ADMINPLAT: [
      {
        id: 1,
        label: 'Utilisateurs',
        icon: Users,
        link: '/admin/users',
        description: 'Gestion des utilisateurs'
      },
      {
        id: 2,
        label: 'Articles',
        icon: Book,
        link: '/admin/blog',
        description: 'Gestion des articles'
      }
    ],
    ADMIN_SFD: [
      {
        id: 1,
        label: 'Tableau de bord',
        icon: Home,
        link: '/dashboards/dashboard-adminsfd',
        description: 'Vue d\'ensemble'
      },
      {
        id: 2,
        label: 'Tontines',
        icon: FileText,
        link: '/dashboards/dashboard-adminsfd/tontines',
        description: 'Gestion des transactions'
      },
      // {
      //   id: 3,
      //   label: 'Créer Tontine',
      //   icon: CreditCard,
      //   link: '/dashboards/dashboard-adminsfd/tontines/create',
      //   description: 'Créer une tontine'
      // },
      {
        id: 3,
        label: 'Prêts',
        icon: File,
        link: '/dashboards/dashboard-adminsfd/loans',
        description: 'Gestion des prêts'
      },
      {
        id: 4,
        label: 'Activités',
        icon: FileText,
        link: '/dashboards/dashboard-adminsfd/activity-logs',
        description: 'Historique des activités'
      },
      {
        id: 5,
        label: 'Statistiques',
        icon: User,
        link: '/dashboards/dashboard-adminsfd/statistics',
        description: 'Statistiques'
      }
    ],
    CLIENT: [
      {
        id: 1,
        label: 'Tableau de bord',
        icon: Home,
        link: '/dashboards/dashboard-client',
        description: 'Vue d\'ensemble'
      },
      {
        id: 2,
        label: 'Mes Tontines',
        icon: Users,
        link: '/dashboards/dashboard-client/my-tontines',
        description: 'Gérer vos tontines'
      },
      {
        id: 3,
        label: 'Épargnes',
        icon: PiggyBank,
        link: '/dashboards/dashboard-client/savings',
        description: 'Vos épargnes'
      },
      {
        id: 4,
        label: 'Prêts',
        icon: PiggyBank,
        link: '/dashboards/dashboard-client/loans',
        description: 'Vos prêts'
      },
      {
        id: 5,
        label: 'Notifications',
        icon: Bell,
        link: '/dashboards/dashboard-client/client-notifications',
        description: 'Alertes',
        badge: 3
      },
      {
        id: 6,
        label: 'Profil',
        icon: User,
        link: '/dashboards/dashboard-client/profile',
        description: 'Paramètres'
      }
    ],
    AGENT_SFD: [
      {
        id: 1,
        label: 'Tableau de bord',
        icon: Home,
        link: '/dashboards/dashboard-agent',
        description: 'Vue d\'ensemble'
      },
      {
        id: 2,
        label: 'Adhésions',
        icon: Home,
        link: '/dashboards/dashboard-agent/membership-requests',
        description: 'Gérer les demandes d\'adhésion'
      },
      {
        id: 3,
        label: 'Création comptes',
        icon: Users,
        link: '/dashboards/dashboard-agent/saving-accounts',
        description: 'Gérer les demandes de création de comptes'
      },
      {
        id: 4,
        label: 'Retraits',
        icon: PiggyBank,
        link: '/dashboards/dashboard-agent/withdrawal-requests',
        description: 'Gérer les demandes de retraits'
      },
      {
        id: 5,
        label: 'Historique',
        icon: PiggyBank,
        link: '/dashboards/dashboard-agent/history',
        description: 'Historique des actions'
      }
    ],
    SUPERVISOR: []
  };
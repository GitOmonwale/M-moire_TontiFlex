'use client'
import * as React from 'react';
import { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Shield, 
  Settings, 
  Activity,
  Database,
  Search,
  Filter,
  MoreVertical,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  Download,
  RefreshCw,
  Globe
} from 'lucide-react';
import Link from 'next/link';

// Types
type UserRole = 'client' | 'agent_sfd' | 'superviseur_sfd' | 'admin_sfd' | 'admin_platform';
type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  sfd: string;
  joinDate: string;
  lastLogin: string;
  tontines?: number;
  savings?: number;
  validatedActions?: number;
  managedLoans?: number;
  managedSFD?: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  newThisMonth: number;
  suspendedUsers: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'primary' | 'secondary' | 'destructive';
  trend?: number;
}

interface UserRowProps {
  user: User;
  onSelectUser: (id: number, isSelected: boolean) => void;
  isSelected: boolean;
}

const UserManagement = (): React.ReactElement => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Données simulées des utilisateurs
  const users: User[] = [
    {
      id: 1,
      name: "Jean Dupont",
      email: "jean.dupont@email.com",
      phone: "+229 97 12 34 56",
      role: "client",
      status: "active",
      sfd: "CLCAM",
      joinDate: "2024-01-15",
      lastLogin: "2024-12-01T10:30:00",
      tontines: 2,
      savings: 1
    },
    {
      id: 2,
      name: "Marie Agbodji",
      email: "marie.agbodji@clcam.bj",
      phone: "+229 96 45 67 89",
      role: "agent_sfd",
      status: "active",
      sfd: "CLCAM",
      joinDate: "2023-11-20",
      lastLogin: "2024-12-01T14:15:00",
      validatedActions: 234
    },
    {
      id: 3,
      name: "Pierre Koudou",
      email: "pierre.koudou@coopec.bj",
      phone: "+229 95 78 90 12",
      role: "superviseur_sfd",
      status: "active",
      sfd: "Coopec",
      joinDate: "2023-08-10",
      lastLogin: "2024-12-01T09:45:00",
      managedLoans: 45
    },
    {
      id: 4,
      name: "Fatou Bello",
      email: "fatou.bello@fescoop.bj",
      phone: "+229 94 23 45 67",
      role: "admin_sfd",
      status: "active",
      sfd: "Fescoop",
      joinDate: "2023-06-05",
      lastLogin: "2024-11-30T16:20:00",
      managedSFD: "Fescoop"
    },
    {
      id: 5,
      name: "Codjo Akpaki",
      email: "codjo.akpaki@email.com",
      phone: "+229 93 56 78 90",
      role: "client",
      status: "suspended",
      sfd: "CLCAM",
      joinDate: "2024-02-28",
      lastLogin: "2024-11-25T11:00:00",
      tontines: 1,
      savings: 0
    }
  ];

  const stats: Stats = {
    totalUsers: 12847,
    activeUsers: 11923,
    newThisMonth: 234,
    suspendedUsers: 45
  };

  const roleLabels: Record<UserRole, string> = {
    client: 'Client',
    agent_sfd: 'Agent SFD',
    superviseur_sfd: 'Superviseur SFD',
    admin_sfd: 'Admin SFD',
    admin_platform: 'Admin Plateforme'
  };

  const statusLabels: Record<UserStatus, string> = {
    active: 'Actif',
    inactive: 'Inactif',
    suspended: 'Suspendu',
    pending: 'En attente'
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color = "primary", trend }) => (
    <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-archivo text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className={`text-xs font-archivo mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}% ce mois
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color === 'primary' ? 'bg-primary/10' : color === 'secondary' ? 'bg-accent/20' : 'bg-destructive/10'}`}>
          <Icon className={`w-6 h-6 ${color === 'primary' ? 'text-primary' : color === 'secondary' ? 'text-accent-foreground' : 'text-destructive'}`} />
        </div>
      </div>
    </div>
  );

  const UserRow: React.FC<UserRowProps> = ({ user, onSelectUser, isSelected }) => {
    const getStatusBadge = (status: UserStatus): React.ReactNode => {
      const styles = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        suspended: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800'
      };
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-archivo font-medium ${styles[status]}`}>
          {statusLabels[status]}
        </span>
      );
    };

    const getRoleBadge = (role: UserRole): React.ReactNode => {
      const styles = {
        client: 'bg-blue-100 text-blue-800',
        agent_sfd: 'bg-purple-100 text-purple-800',
        superviseur_sfd: 'bg-orange-100 text-orange-800',
        admin_sfd: 'bg-red-100 text-red-800',
        admin_platform: 'bg-gray-100 text-gray-800'
      };
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-archivo font-medium ${styles[role]}`}>
          {roleLabels[role]}
        </span>
      );
    };

    return (
      <tr className="hover:bg-accent/10 transition-colors">
        <td className="px-6 py-4">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-primary focus:ring-primary"
            checked={selectedUsers.includes(user.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedUsers([...selectedUsers, user.id]);
              } else {
                setSelectedUsers(selectedUsers.filter(id => id !== user.id));
              }
            }}
          />
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-archivo font-medium text-foreground">{user.name}</p>
              <p className="font-archivo text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="font-archivo text-sm text-foreground">{user.phone}</span>
        </td>
        <td className="px-6 py-4 text-nowrap">
          {getRoleBadge(user.role)}
        </td>
        <td className="px-6 py-4">
          {getStatusBadge(user.status)}
        </td>
        <td className="px-6 py-4">
          <span className="font-archivo text-sm text-foreground">{user.sfd}</span>
        </td>
        <td className="px-6 py-4">
          <span className="font-archivo text-sm text-muted-foreground">
            {new Date(user.joinDate).toLocaleDateString('fr-FR')}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className="font-archivo text-sm text-muted-foreground">
            {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-primary/10 rounded">
              <Eye className="w-4 h-4 text-primary" />
            </button>
            <button className="p-1 hover:bg-primary/10 rounded">
              <Edit className="w-4 h-4 text-primary" />
            </button>
            <button className="p-1 hover:bg-red-100 rounded">
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Gestion des utilisateurs
                </h1>
                <p className="font-archivo text-muted-foreground">
                  Gérez tous les utilisateurs de la plateforme TontiFlex
                </p>
              </div>
              <Link href="/dashboards/dashboard-admin_tontiflex/utilisateurs/new-user" className="flex items-center space-x-3">
                <button 
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="font-archivo text-sm">Nouveau utilisateur</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total utilisateurs"
              value={stats.totalUsers.toLocaleString('fr-FR')}
              icon={Users}
              trend={8}
            />
            <StatCard
              title="Utilisateurs actifs"
              value={stats.activeUsers.toLocaleString('fr-FR')}
              icon={CheckCircle}
              color="secondary"
              trend={5}
            />
            <StatCard
              title="Nouveaux ce mois"
              value={stats.newThisMonth}
              icon={UserPlus}
              trend={12}
            />
            <StatCard
              title="Comptes suspendus"
              value={stats.suspendedUsers}
              icon={XCircle}
              color="destructive"
              trend={-3}
            />
          </div>

          {/* Filtres et recherche */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-lg mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email ou téléphone..."
                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg font-archivo text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-archivo text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="all">Tous les rôles</option>
                  <option value="client">Clients</option>
                  <option value="agent_sfd">Agents SFD</option>
                  <option value="superviseur_sfd">Superviseurs SFD</option>
                  <option value="admin_sfd">Admins SFD</option>
                  <option value="admin_platform">Admins Plateforme</option>
                </select>
                
                <select
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-archivo text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="inactive">Inactifs</option>
                  <option value="suspended">Suspendus</option>
                  <option value="pending">En attente</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-archivo text-sm text-muted-foreground">
                  {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
                </span>
                <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                  <RefreshCw className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>

            {selectedUsers.length > 0 && (
              <div className="mt-4 flex items-center space-x-4 p-3 bg-primary/10 rounded-lg">
                <span className="font-archivo text-sm text-primary">
                  {selectedUsers.length} utilisateur{selectedUsers.length > 1 ? 's' : ''} sélectionné{selectedUsers.length > 1 ? 's' : ''}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-green-500 text-white rounded font-archivo text-sm hover:bg-green-600 transition-colors">
                    Activer
                  </button>
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded font-archivo text-sm hover:bg-yellow-600 transition-colors">
                    Suspendre
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded font-archivo text-sm hover:bg-red-600 transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table des utilisateurs */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(filteredUsers.map(u => u.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-archivo font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-archivo font-medium text-gray-500 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th className="px-6  py-3 text-left text-xs font-archivo font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-archivo font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-archivo font-medium text-gray-500 uppercase tracking-wider">
                      SFD
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-archivo font-medium text-gray-500 uppercase tracking-wider">
                      Inscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-archivo font-medium text-gray-500 uppercase tracking-wider">
                      Dernière connexion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-archivo font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <UserRow 
                      key={user.id} 
                      user={user} 
                      isSelected={selectedUsers.includes(user.id)}
                      onSelectUser={(id, isSelected) => {
                        if (isSelected) {
                          setSelectedUsers([...selectedUsers, id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(selectedId => selectedId !== id));
                        }
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
                <p className="font-archivo text-gray-500">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-archivo text-sm text-muted-foreground">Affichage de</span>
              <select className="px-2 py-1 border border-gray-200 rounded font-archivo text-sm">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span className="font-archivo text-sm text-muted-foreground">utilisateurs par page</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-200 rounded font-archivo text-sm hover:bg-gray-50 transition-colors">
                Précédent
              </button>
              <button className="px-3 py-1 bg-primary text-white rounded font-archivo text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-200 rounded font-archivo text-sm hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-3 py-1 border border-gray-200 rounded font-archivo text-sm hover:bg-gray-50 transition-colors">
                3
              </button>
              <button className="px-3 py-1 border border-gray-200 rounded font-archivo text-sm hover:bg-gray-50 transition-colors">
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
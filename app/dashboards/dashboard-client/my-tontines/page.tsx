'use client'
import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { 
  Building,
  Users,
  PiggyBank,
  CreditCard,
  TrendingUp,
  BarChart3,
  Settings,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Target,
  Activity,
  Award,
  Calendar,
  FileText,
  UserCheck,
  Briefcase,
  Smartphone,
  Bell,
  Download,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Données mockées pour l'administrateur SFD
const adminSFDData = {
  sfdInfo: {
    name: "SFD Porto-Novo",
    code: "SFD001",
    dateCreation: "2020-03-15",
    statut: "Actif",
    licence: "BCEAO-2020-001"
  },
  adminName: "Dr. Marie ADJAHO",
  stats: {
    tontinesActives: 12,
    totalClients: 1250,
    agentsActifs: 8,
    superviseursActifs: 3,
    volumeTransactions: 125000000,
    pretsEnAttente: 15,
    croissanceMensuelle: 8.5,
    tauxReussite: 94
  }
};

const tontinesRecentes = [
  {
    id: 1,
    nom: "Tontine Femmes Entrepreneures 2025",
    type: "Épargne",
    miseMin: 1000,
    miseMax: 10000,
    membres: 45,
    membresCibles: 50,
    dateCreation: "2025-06-15",
    statut: "active",
    soldeTotal: 850000
  },
  {
    id: 2,
    nom: "Tontine Commerce Cotonou",
    type: "Crédit",
    miseMin: 2000,
    miseMax: 15000,
    membres: 32,
    membresCibles: 40,
    dateCreation: "2025-06-10",
    statut: "active",
    soldeTotal: 1200000
  },
  {
    id: 3,
    nom: "Tontine Agricole",
    type: "Mixte",
    miseMin: 500,
    miseMax: 5000,
    membres: 28,
    membresCibles: 35,
    dateCreation: "2025-06-05",
    statut: "en_recrutement",
    soldeTotal: 420000
  }
];

const pretsEnAttente = [
  {
    id: 1,
    clientName: "Fatou KONE",
    montant: 250000,
    type: "Personnel",
    duree: 12,
    tauxInteret: 8.5,
    datedemande: "2025-06-20",
    superviseur: "Jean AHOUE",
    scoreClient: 85,
    garantie: "Caution solidaire"
  },
  {
    id: 2,
    clientName: "Aminata DIALLO",
    montant: 500000,
    type: "Commercial",
    duree: 24,
    tauxInteret: 12,
    datedemande: "2025-06-19",
    superviseur: "Marie SANTOS",
    scoreClient: 78,
    garantie: "Hypothèque"
  },
  {
    id: 3,
    clientName: "Ramatou BAKO",
    montant: 150000,
    type: "Agricole",
    duree: 8,
    tauxInteret: 6,
    datedemande: "2025-06-18",
    superviseur: "Paul DOSSA",
    scoreClient: 92,
    garantie: "Nantissement"
  }
];

const equipeActuelle = [
  {
    id: 1,
    nom: "Jean AHOUE",
    role: "Superviseur",
    email: "j.ahoue@sfdportonovo.bj",
    dateEmbauche: "2023-01-15",
    performance: 88,
    actionsRecentes: "12 prêts évalués",
    statut: "actif"
  },
  {
    id: 2,
    nom: "Marie SANTOS",
    role: "Superviseur", 
    email: "m.santos@sfdportonovo.bj",
    dateEmbauche: "2023-05-20",
    performance: 91,
    actionsRecentes: "8 prêts évalués",
    statut: "actif"
  },
  {
    id: 3,
    nom: "Paul DOSSA",
    role: "Agent",
    email: "p.dossa@sfdportonovo.bj",
    dateEmbauche: "2024-02-10",
    performance: 85,
    actionsRecentes: "45 validations",
    statut: "actif"
  },
  {
    id: 4,
    nom: "Claire FAGLA",
    role: "Agent",
    email: "c.fagla@sfdportonovo.bj",
    dateEmbauche: "2024-03-01",
    performance: 82,
    actionsRecentes: "38 validations",
    statut: "actif"
  }
];

const activitesRecentes = [
  {
    id: 1,
    type: "tontine_created",
    description: "Nouvelle tontine 'Femmes Entrepreneures 2025' créée",
    utilisateur: "Admin",
    date: "2025-06-20",
    icon: Plus
  },
  {
    id: 2,
    type: "pret_validated",
    description: "Prêt de 300,000 FCFA validé pour Zeinab OUEDRAOGO",
    utilisateur: "Admin",
    date: "2025-06-19",
    icon: CheckCircle
  },
  {
    id: 3,
    type: "user_added",
    description: "Nouvel agent Claire FAGLA ajouté à l'équipe",
    utilisateur: "Admin",
    date: "2025-06-18",
    icon: UserCheck
  },
  {
    id: 4,
    type: "stats_milestone",
    description: "Seuil de 1,250 clients atteint",
    utilisateur: "Système",
    date: "2025-06-17",
    icon: Target
  }
];

const AdminSFDDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30j");

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'en_recrutement':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'suspendue':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord Administrateur</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center">
                <Building className="mr-2" size={16} />
                {adminSFDData.sfdInfo.name}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2" size={16} />
                Bienvenue, {adminSFDData.adminName}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GlassButton variant="outline" size="sm">
              <Bell size={16} className="mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </GlassButton>
            <GlassButton variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              <span className="hidden sm:inline">Rapport mensuel</span>
            </GlassButton>
            <GlassButton variant="outline" size="sm">
              <Settings size={16} />
            </GlassButton>
          </div>
        </div>

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6 border-l-4 border-l-emerald-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tontines actives</p>
                <p className="text-2xl font-bold text-emerald-600">{adminSFDData.stats.tontinesActives}</p>
                <p className="text-xs text-gray-500">En fonctionnement</p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <PiggyBank className="text-emerald-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp size={16} className="mr-1" />
              +2 ce mois
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total clients</p>
                <p className="text-2xl font-bold text-blue-600">{adminSFDData.stats.totalClients.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Clients actifs</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <TrendingUp size={16} className="mr-1" />
              +{adminSFDData.stats.croissanceMensuelle}% ce mois
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Volume transactions</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(adminSFDData.stats.volumeTransactions / 1000000).toFixed(0)}M
                </p>
                <p className="text-xs text-gray-500">FCFA ce mois</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <TrendingUp size={16} className="mr-1" />
              +15% vs mois dernier
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Équipe active</p>
                <p className="text-2xl font-bold text-orange-600">
                  {adminSFDData.stats.agentsActifs + adminSFDData.stats.superviseursActifs}
                </p>
                <p className="text-xs text-gray-500">{adminSFDData.stats.agentsActifs} agents, {adminSFDData.stats.superviseursActifs} superviseurs</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Briefcase className="text-orange-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-orange-600">
              <Award size={16} className="mr-1" />
              Performance: {adminSFDData.stats.tauxReussite}%
            </div>
          </GlassCard>
        </div>

        {/* Grille principale */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Configuration des tontines */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <PiggyBank className="mr-3 text-emerald-600" size={24} />
                  Configuration des Tontines
                </h2>
                <Link href="/admin-sfd/tontines/create">
                  <GlassButton size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2" size={16} />
                    Créer une tontine
                  </GlassButton>
                </Link>
              </div>

              <div className="space-y-4">
                {tontinesRecentes.map((tontine) => (
                  <div key={tontine.id} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{tontine.nom}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Target className="mr-1" size={14} />
                            {tontine.type}
                          </span>
                          <span className="flex items-center">
                            <Users className="mr-1" size={14} />
                            {tontine.membres}/{tontine.membresCibles} membres
                          </span>
                          <span className="flex items-center">
                            <Calendar className="mr-1" size={14} />
                            {format(new Date(tontine.dateCreation), 'dd/MM/yyyy', { locale: fr })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", 
                          getStatutBadge(tontine.statut))}>
                          {tontine.statut === 'active' ? 'Active' : 
                           tontine.statut === 'en_recrutement' ? 'En recrutement' : 'Suspendue'}
                        </span>
                        <GlassButton variant="outline" size="sm">
                          <MoreVertical size={16} />
                        </GlassButton>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-white/60 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Mise min/max</p>
                        <p className="font-bold text-emerald-600">{tontine.miseMin.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">- {tontine.miseMax.toLocaleString()} FCFA</p>
                      </div>
                      <div className="text-center p-3 bg-white/60 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Solde total</p>
                        <p className="font-bold text-blue-600">{(tontine.soldeTotal / 1000).toLocaleString()}K</p>
                        <p className="text-xs text-gray-500">FCFA</p>
                      </div>
                      <div className="text-center p-3 bg-white/60 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Taux de remplissage</p>
                        <p className="font-bold text-purple-600">{Math.round((tontine.membres / tontine.membresCibles) * 100)}%</p>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-purple-500 h-1 rounded-full"
                            style={{ width: `${(tontine.membres / tontine.membresCibles) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <Link href={`/admin-sfd/tontines/${tontine.id}`}>
                        <GlassButton variant="outline" size="sm">
                          <Eye size={16} className="mr-1" />
                          Détails
                        </GlassButton>
                      </Link>
                      <Link href={`/admin-sfd/tontines/${tontine.id}/edit`}>
                        <GlassButton variant="outline" size="sm">
                          <Edit size={16} className="mr-1" />
                          Modifier
                        </GlassButton>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Link href="/admin-sfd/tontines">
                  <GlassButton variant="outline">
                    Voir toutes les tontines
                  </GlassButton>
                </Link>
              </div>
            </GlassCard>

            {/* Validation des prêts */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <CreditCard className="mr-3 text-emerald-600" size={24} />
                  Validation des Prêts ({pretsEnAttente.length})
                </h2>
                <Link href="/admin-sfd/prets">
                  <GlassButton variant="outline" size="sm">
                    <Eye size={16} className="mr-2" />
                    Voir tous
                  </GlassButton>
                </Link>
              </div>

              <div className="space-y-4">
                {pretsEnAttente.slice(0, 3).map((pret) => (
                  <div key={pret.id} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{pret.clientName}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          <span>Superviseur: {pret.superviseur}</span>
                          <span className="mx-2">•</span>
                          <span>{format(new Date(pret.datedemande), 'dd/MM/yyyy', { locale: fr })}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-600">
                          {pret.montant.toLocaleString()} FCFA
                        </p>
                        <p className="text-xs text-gray-500">{pret.type} - {pret.duree} mois</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Taux</p>
                        <p className="font-semibold">{pret.tauxInteret}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Score client</p>
                        <p className={cn("font-semibold", getPerformanceColor(pret.scoreClient))}>
                          {pret.scoreClient}/100
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Garantie</p>
                        <p className="font-semibold text-xs">{pret.garantie}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Durée</p>
                        <p className="font-semibold">{pret.duree} mois</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <GlassButton size="sm" className="bg-green-600 hover:bg-green-700 flex-1">
                        <CheckCircle size={16} className="mr-1" />
                        Approuver
                      </GlassButton>
                      <GlassButton variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50 flex-1">
                        <AlertTriangle size={16} className="mr-1" />
                        Rejeter
                      </GlassButton>
                      <Link href={`/admin-sfd/prets/${pret.id}`}>
                        <GlassButton variant="outline" size="sm">
                          <Eye size={16} />
                        </GlassButton>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar droite */}
          <div className="space-y-6">
            {/* Gestion d'équipe */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="mr-2 text-emerald-600" size={20} />
                  Gestion d'équipe
                </h3>
                <Link href="/admin-sfd/users">
                  <GlassButton variant="outline" size="sm">
                    <Plus size={16} />
                  </GlassButton>
                </Link>
              </div>
              
              <div className="space-y-3">
                {equipeActuelle.slice(0, 4).map((membre) => (
                  <div key={membre.id} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Users className="text-emerald-600" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{membre.nom}</p>
                      <p className="text-xs text-gray-600">{membre.role}</p>
                      <p className="text-xs text-gray-500">{membre.actionsRecentes}</p>
                    </div>
                    <div className="text-right">
                      <div className={cn("text-xs font-medium", getPerformanceColor(membre.performance))}>
                        {membre.performance}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Link href="/admin-sfd/users">
                  <GlassButton variant="outline" size="sm" className="w-full">
                    Gérer l'équipe
                  </GlassButton>
                </Link>
              </div>
            </GlassCard>

            {/* Statistiques rapides */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="mr-2 text-emerald-600" size={20} />
                Statistiques SFD
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taux de réussite</span>
                  <span className="font-bold text-emerald-600">{adminSFDData.stats.tauxReussite}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Croissance mensuelle</span>
                  <span className="font-bold text-blue-600">+{adminSFDData.stats.croissanceMensuelle}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Prêts en attente</span>
                  <span className="font-bold text-orange-600">{adminSFDData.stats.pretsEnAttente}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Moyenne équipe</span>
                  <span className="font-bold text-purple-600">87%</span>
                </div>
              </div>

              <div className="mt-4">
                <Link href="/admin-sfd/statistiques">
                  <GlassButton variant="outline" size="sm" className="w-full">
                    <BarChart3 size={16} className="mr-2" />
                    Voir détails
                  </GlassButton>
                </Link>
              </div>
            </GlassCard>

            {/* Activités récentes */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="mr-2 text-emerald-600" size={20} />
                Activités récentes
              </h3>
              
              <div className="space-y-3">
                {activitesRecentes.map((activite) => (
                  <div key={activite.id} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <activite.icon size={16} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activite.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-600">{activite.utilisateur}</p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">{format(new Date(activite.date), 'dd/MM', { locale: fr })}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Informations SFD */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="mr-2 text-emerald-600" size={20} />
                Informations SFD
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Code SFD</span>
                  <span className="font-medium">{adminSFDData.sfdInfo.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Licence BCEAO</span>
                  <span className="font-medium text-xs">{adminSFDData.sfdInfo.licence}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date création</span>
                  <span className="font-medium">{format(new Date(adminSFDData.sfdInfo.dateCreation), 'dd/MM/yyyy', { locale: fr })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Statut</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {adminSFDData.sfdInfo.statut}
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSFDDashboard;
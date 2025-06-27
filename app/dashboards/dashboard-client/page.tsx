'use client'
import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Filter, 
  Users, 
  PiggyBank, 
  CreditCard, 
  TrendingUp, 
  Calendar, 
  Target,
  Wallet,
  Activity,
  AlertCircle,
  CheckCircle,
  Plus,
  Eye,
  ArrowUp,
  ArrowDown,
  Clock,
  Smartphone,
  Building,
  Award,
  BarChart3,
  Bell,
  Settings,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { mockTransactionHistory, mockTontines } from '@/data/mockData';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const ModernDashboard = () => {
  const [filterType, setFilterType] = useState("tous");
  const [filterStatus, setFilterStatus] = useState("tous");
  const [timeRange, setTimeRange] = useState("30j");

  // Données enrichies pour le dashboard
  const dashboardStats = {
    totalTontines: 4,
    comptesEpargne: 2,
    montantEpargne: 1500000,
    soldeTotal: 245000,
    cotisationsMois: 46500,
    prochaineCotisation: "Aujourd'hui",
    scoreFiabilite: 85,
    rangTontine: 3,
    derniereCotisation: "2025-06-12",
    prochaineCycle: "2025-07-15"
  };

  const recentActivities = [
    {
      id: 1,
      type: "cotisation",
      description: "Cotisation Tontine Femmes Entrepreneures",
      amount: 1500,
      date: "2025-06-12",
      status: "confirmé",
      icon: Plus
    },
    {
      id: 2,
      type: "retrait",
      description: "Retrait compte épargne SFD Porto-Novo",
      amount: -5000,
      date: "2025-06-10",
      status: "en_attente",
      icon: ArrowDown
    },
    {
      id: 3,
      type: "depot",
      description: "Dépôt épargne via MTN Mobile Money",
      amount: 10000,
      date: "2025-06-08",
      status: "confirmé",
      icon: ArrowUp
    }
  ];

  const filteredTransactions = mockTransactionHistory.filter(transaction => {
    const typeMatch = filterType === "tous" || transaction.type.toLowerCase().includes(filterType.toLowerCase());
    const statusMatch = filterStatus === "tous" || transaction.statut.toLowerCase() === filterStatus.toLowerCase();
    return typeMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header moderne */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
            <p className="text-gray-600">Bienvenue sur TontiFlex - Gérez vos tontines et épargnes</p>
          </div>
          <div className="flex items-center gap-3">
            <GlassButton variant="outline" size="sm">
              <Bell size={16} className="mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </GlassButton>
            <GlassButton variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              <span className="hidden sm:inline">Exporter</span>
            </GlassButton>
            <GlassButton variant="outline" size="sm">
              <Settings size={16} />
            </GlassButton>
          </div>
        </div>

        {/* Stats cards principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6 border-l-4 border-l-emerald-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Solde total</p>
                <p className="text-2xl font-bold text-emerald-600">{dashboardStats.soldeTotal.toLocaleString()}</p>
                <p className="text-xs text-gray-500">FCFA</p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Wallet className="text-emerald-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <ArrowUp size={16} className="mr-1" />
              +12% ce mois
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tontines actives</p>
                <p className="text-2xl font-bold text-blue-600">{dashboardStats.totalTontines}</p>
                <p className="text-xs text-gray-500">SFD différents</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <Target size={16} className="mr-1" />
              Rang #{dashboardStats.rangTontine}
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Épargne totale</p>
                <p className="text-2xl font-bold text-purple-600">{dashboardStats.montantEpargne.toLocaleString()}</p>
                <p className="text-xs text-gray-500">FCFA</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <PiggyBank className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <BarChart3 size={16} className="mr-1" />
              {dashboardStats.comptesEpargne} comptes
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Score fiabilité</p>
                <p className="text-2xl font-bold text-orange-600">{dashboardStats.scoreFiabilite}%</p>
                <p className="text-xs text-gray-500">Excellent</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Award className="text-orange-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-orange-600">
              <TrendingUp size={16} className="mr-1" />
              +5 points
            </div>
          </GlassCard>
        </div>

        {/* Section principale en grille */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonnes principales */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mes tontines améliorées */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Users className="mr-3 text-emerald-600" size={24} />
                  Mes Tontines
                </h2>
                <Link href="/tontines">
                  <GlassButton size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2" size={16} />
                    Rejoindre
                  </GlassButton>
                </Link>
              </div>

              <div className="grid gap-4">
                {mockTontines.map((tontine) => (
                  <div key={tontine.id} className="bg-gradient-to-r from-white to-emerald-50 rounded-xl p-4 border border-emerald-100 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{tontine.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Building className="mr-1" size={14} />
                            {tontine.sfd}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-1" size={14} />
                            Carnet #3
                          </div>
                        </div>
                      </div>
                      <Link href={`/dashboards/dashboard-client/tontines/${tontine.id}`}>
                        <GlassButton variant="outline" size="sm">
                          <Eye className="mr-1" size={14} />
                          Détails
                        </GlassButton>
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-white/60 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Solde actuel</p>
                        <p className="font-bold text-emerald-600">{tontine.balance.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">FCFA</p>
                      </div>
                      <div className="text-center p-3 bg-white/60 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Mise journalière</p>
                        <p className="font-bold text-blue-600">1,500</p>
                        <p className="text-xs text-gray-500">FCFA</p>
                      </div>
                      <div className="text-center p-3 bg-white/60 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Prochaine cotisation</p>
                        <p className="font-bold text-orange-600">Aujourd'hui</p>
                        <div className="w-2 h-2 bg-orange-500 rounded-full mx-auto mt-1"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Historique des opérations moderne */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FileText className="mr-3 text-emerald-600" size={24} />
                  Historique des Opérations
                </h2>
                <div className="flex gap-3">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[120px] bg-white/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7j">7 jours</SelectItem>
                      <SelectItem value="30j">30 jours</SelectItem>
                      <SelectItem value="90j">3 mois</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[140px] bg-white/60">
                      <Filter className="mr-2" size={16} />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous types</SelectItem>
                      <SelectItem value="contribution">Contribution</SelectItem>
                      <SelectItem value="retrait">Retrait</SelectItem>
                      <SelectItem value="dépôt">Dépôt Épargne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-3">
                {filteredTransactions.slice(0, 8).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        transaction.montant > 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.montant > 0 ? (
                          <ArrowUp className="text-green-600" size={20} />
                        ) : (
                          <ArrowDown className="text-red-600" size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.type}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{format(new Date(transaction.date), 'dd MMM yyyy', { locale: fr })}</span>
                          <span>•</span>
                          <span>{transaction.tontine}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${transaction.montant > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.montant > 0 ? '+' : ''}{transaction.montant.toLocaleString()} FCFA
                      </p>
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.statut === 'Confirmé'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {transaction.statut}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Link href="/dashboards/dashboard-client/historique">
                  <GlassButton variant="outline">
                    Voir tout l'historique
                  </GlassButton>
                </Link>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar droite avec informations utiles */}
          <div className="space-y-6">
            {/* Actions rapides améliorées */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
              <div className="space-y-3">
                <GlassButton className="w-full h-12 text-left justify-start bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                  <Plus className="mr-3" size={20} />
                  <div>
                    <div className="font-medium">Cotiser</div>
                    <div className="text-xs opacity-90">Effectuer une contribution</div>
                  </div>
                </GlassButton>
                
                <GlassButton variant="outline" className="w-full h-12 text-left justify-start border-2">
                  <ArrowDown className="mr-3" size={20} />
                  <div>
                    <div className="font-medium">Retirer</div>
                    <div className="text-xs text-gray-500">Demander un retrait</div>
                  </div>
                </GlassButton>
                
                <GlassButton variant="outline" className="w-full h-12 text-left justify-start border-2">
                  <PiggyBank className="mr-3" size={20} />
                  <div>
                    <div className="font-medium">Épargner</div>
                    <div className="text-xs text-gray-500">Ouvrir un compte épargne</div>
                  </div>
                </GlassButton>
              </div>
            </GlassCard>

            {/* Activités récentes */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="mr-2 text-emerald-600" size={20} />
                Activités récentes
              </h3>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activity.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <activity.icon size={16} className={activity.amount > 0 ? 'text-green-600' : 'text-red-600'} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.description}</p>
                      <p className="text-xs text-gray-500">{format(new Date(activity.date), 'dd/MM', { locale: fr })}</p>
                    </div>
                    <div className={`text-sm font-bold ${activity.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {activity.amount > 0 ? '+' : ''}{Math.abs(activity.amount).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Rappels et alertes */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Bell className="mr-2 text-orange-600" size={20} />
                Rappels
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <AlertCircle className="text-orange-600 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Cotisation due</p>
                    <p className="text-xs text-orange-600">Tontine Femmes Entrepreneures - Aujourd'hui</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Clock className="text-blue-600 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Nouveau cycle</p>
                    <p className="text-xs text-blue-600">Débute le {format(new Date(dashboardStats.prochaineCycle), 'dd MMM', { locale: fr })}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="text-green-600 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm font-medium text-green-800">Score excellent</p>
                    <p className="text-xs text-green-600">Félicitations pour votre régularité!</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Statistiques personnelles */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mes statistiques</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cotisations ce mois</span>
                  <span className="font-bold text-gray-900">{dashboardStats.cotisationsMois.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Moyenne mensuelle</span>
                  <span className="font-bold text-gray-900">42,300 FCFA</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Jours de retard</span>
                  <span className="font-bold text-green-600">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Objectif annuel</span>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">72%</div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-3/4 h-2 bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Mobile Money */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Smartphone className="mr-2 text-emerald-600" size={20} />
                Mobile Money
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-500 rounded"></div>
                    <span className="text-sm font-medium">MTN Mobile Money</span>
                  </div>
                  <span className="text-xs text-green-600">Connecté</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded"></div>
                    <span className="text-sm font-medium">Moov Money</span>
                  </div>
                  <span className="text-xs text-green-600">Connecté</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;
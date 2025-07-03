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
import MyTontines from '@/components/tontines/MyTontines';
import Transactions from '@/components/tontines/Transactions';

const ModernDashboard = () => {
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
  const [filterType, setFilterType] = useState("tous");
  const [filterStatus, setFilterStatus] = useState("tous");
  const [timeRange, setTimeRange] = useState("30j");

  const filteredTransactions = mockTransactionHistory.filter(transaction => {
      const typeMatch = filterType === "tous" || transaction.type.toLowerCase().includes(filterType.toLowerCase());
      const statusMatch = filterStatus === "tous" || transaction.statut.toLowerCase() === filterStatus.toLowerCase();
      return typeMatch && statusMatch;
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats cards principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
        </div>

        {/* Section principale en grille */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonnes principales */}
          <div className="lg:col-span-2 space-y-8">
            <MyTontines />
          </div>
          {/* Sidebar droite avec informations utiles */}
          <div className="space-y-6">
            {/* Actions rapides améliorées */}
            <GlassCard className="p-6" hover={false}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
            <div className="space-y-3">
                  <GlassButton variant="outline" className="w-full h-12 text-left justify-start border-2">
                  <PiggyBank className="mr-3" size={20} />
                  <div>
                    <div className="font-medium">Épargner</div>
                    <div className="text-xs text-gray-500">Ouvrir un compte épargne</div>
                  </div>
                </GlassButton>
              </div>
            </GlassCard>

            {/* Rappels et alertes */}
            <GlassCard className="p-6" hover={false}>
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
          </div>
        </div>
        <div className='mt-8' >
        <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-black flex items-center">
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
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${transaction.montant > 0 ? 'bg-green-100' : 'bg-red-100'
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
                                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${transaction.statut === 'Confirmé'
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
                    <Link href="/dashboards/dashboard-client/operations-history">
                        <GlassButton variant="outline">
                            Voir tout l'historique
                        </GlassButton>
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;
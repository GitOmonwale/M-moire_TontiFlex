'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import {
  PiggyBank,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Building,
  Calendar,
  Eye,
  Target,
  Award,
  Clock,
  DollarSign,
  CreditCard,
  Smartphone,
  Filter,
  Search,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  BarChart3,
  FileText,
  Settings,
  Info,
  Plus,
  Minus,
  Shield,
  User,
  ChevronRight,
  Phone,
  MapPin,
  Activity,
  Zap
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, differenceInMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import WithdrawalForm from '@/components/forms/WithdrawalForm';
import DepositForm from '@/components/forms/DepositForm';

// Types (réutilisés de la page overview)
interface SavingsAccount {
  id: string;
  sfdName: string;
  sfdLogo: string;
  accountNumber: string;
  solde: number;
  dateCreation: string;
  statut: 'actif' | 'en_cours_creation' | 'suspendu';
  totalDepose: number;
  totalRetire: number;
  nombreTransactions: number;
  eligibiliteCredit: boolean;
  derniereMouvement: string;
  sfdDetails: {
    adresse: string;
    telephone: string;
  };
  documentsRequis: {
    pieceIdentite: { uploaded: boolean; dateUpload?: string };
    photoIdentite: { uploaded: boolean; dateUpload?: string };
  };
}

interface Transaction {
  id: string;
  accountId: string;
  type: 'depot' | 'retrait' | 'frais';
  montant: number;
  date: string;
  description: string;
  reference: string;
  methodePaiement?: 'mtn_money' | 'moov_money' | 'especes';
  numeroMobileMoney?: string;
  statut: 'confirme' | 'en_attente' | 'rejete';
  frais?: number;
  soldeAvant: number;
  soldeApres: number;
  notes?: string;
}

// Mock data pour un compte spécifique
const mockSavingsAccount: SavingsAccount = {
  id: 'ep_001',
  sfdName: 'FINADEV',
  sfdLogo: '/logos/finadev.png',
  accountNumber: 'FD-EP-240001',
  solde: 125000,
  dateCreation: '2024-03-15T00:00:00Z',
  statut: 'actif',
  totalDepose: 150000,
  totalRetire: 28250,
  nombreTransactions: 24,
  eligibiliteCredit: true,
  derniereMouvement: '2025-06-15T14:30:00Z',
  sfdDetails: {
    adresse: '123 Avenue de la République, Cotonou',
    telephone: '+229 21 30 45 67',
  },
  documentsRequis: {
    pieceIdentite: { uploaded: true, dateUpload: '2024-03-15T10:00:00Z' },
    photoIdentite: { uploaded: true, dateUpload: '2024-03-15T10:05:00Z' }
  }
};

const mockTransactionHistory: Transaction[] = [
  {
    id: 'tx_001',
    accountId: 'ep_001',
    type: 'depot',
    montant: 15000,
    date: '2025-06-15T14:30:00Z',
    description: 'Dépôt Mobile Money MTN',
    reference: 'TF-DEP-150625',
    methodePaiement: 'mtn_money',
    numeroMobileMoney: '*****4587',
    statut: 'confirme',
    frais: 25,
    soldeAvant: 110000,
    soldeApres: 125000,
    notes: 'Dépôt automatique depuis MTN Money'
  },
  {
    id: 'tx_002',
    accountId: 'ep_001',
    type: 'retrait',
    montant: 10000,
    date: '2025-06-10T09:15:00Z',
    description: 'Retrait pour urgence familiale',
    reference: 'TF-RET-100625',
    methodePaiement: 'moov_money',
    numeroMobileMoney: '*****7829',
    statut: 'confirme',
    frais: 150,
    soldeAvant: 120000,
    soldeApres: 110000,
    notes: 'Retrait approuvé par agent HASSAN'
  },
  {
    id: 'tx_003',
    accountId: 'ep_001',
    type: 'depot',
    montant: 520,
    date: '2025-06-01T00:00:00Z',
    description: 'Intérêts mensuels - Mai 2025',
    reference: 'TF-INT-010625',
    statut: 'confirme',
    soldeAvant: 119480,
    soldeApres: 120000,
    notes: 'Calcul automatique 5.5% annuel'
  },
  {
    id: 'tx_004',
    accountId: 'ep_001',
    type: 'depot',
    montant: 25000,
    date: '2025-05-28T16:45:00Z',
    description: 'Dépôt mensuel mai',
    reference: 'TF-DEP-280525',
    methodePaiement: 'mtn_money',
    numeroMobileMoney: '*****4587',
    statut: 'confirme',
    frais: 25,
    soldeAvant: 94480,
    soldeApres: 119480
  },
  {
    id: 'tx_005',
    accountId: 'ep_001',
    type: 'frais',
    montant: 500,
    date: '2025-05-15T12:00:00Z',
    description: 'Frais de tenue de compte',
    reference: 'TF-FEE-150525',
    statut: 'confirme',
    soldeAvant: 94980,
    soldeApres: 94480,
    notes: 'Frais trimestriels FINADEV'
  }
];

const SavingsAccountDetails = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // For debugging - will show in browser console
  console.log('Current savings account ID:', id);
  const [account, setAccount] = useState<SavingsAccount>(mockSavingsAccount);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactionHistory);
  const [filter, setFilter] = useState<'tous' | 'depot' | 'retrait'>('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const handleWithdraw = async (withdrawData: any) => {
    try {
      setLoading(true);
      console.log('Processing withdrawal:', withdrawData);
      // Here you would typically call your API to process the withdrawal
      // For example: await api.processWithdrawal(account.id, withdrawData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the UI to reflect the withdrawal
      // For now, we'll just show a success message
      alert('Retrait effectué avec succès');
      setIsWithdrawalModalOpen(false);

      // Refresh account data
      // await loadAccountData();
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('Une erreur est survenue lors du retrait');
    } finally {
      setLoading(false);
    }
  };
  const handleDeposit = async (depositData: any) => {
    try {
      setLoading(true);
      console.log('Processing deposit:', depositData);
      // Here you would typically call your API to process the deposit
      // For example: await api.processDeposit(account.id, depositData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the UI to reflect the deposit
      // For now, we'll just show a success message
      alert('Dépôt effectué avec succès');
      setIsDepositModalOpen(false);

      // Refresh account data
      // await loadAccountData();
    } catch (error) {
      console.error('Error processing deposit:', error);
      alert('Une erreur est survenue lors du dépôt');
    } finally {
      setLoading(false);
    }
  };

  // Calculs statistiques
  const monthsActive = differenceInMonths(new Date(), new Date(account.dateCreation));
  const averageMonthlyDeposit = account.totalDepose / Math.max(monthsActive, 1);
  const netGrowth = account.totalDepose - account.totalRetire;
  const growthPercentage = ((netGrowth / account.totalDepose) * 100).toFixed(1);

  // Filtrage des transactions
  const filteredTransactions = transactions.filter(transaction => {
    if (filter !== 'tous' && transaction.type !== filter) return false;
    if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'depot': return ArrowUp;
      case 'retrait': return ArrowDown;
      case 'frais': return Minus;
      default: return DollarSign;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'depot': return 'text-green-600 bg-green-100';
      case 'retrait': return 'text-red-600 bg-red-100';
      case 'frais': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'confirme': return 'bg-green-100 text-green-700 border-green-200';
      case 'en_attente': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejete': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-3 hover:bg-white/60 rounded-xl transition-colors backdrop-blur-sm border border-white/20"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Compte Courant</h1>
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium text-gray-600">{account.accountNumber}</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-500">Dernière activité: {format(new Date(account.derniereMouvement), 'dd/MM/yyyy', { locale: fr })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section principale - Solde et Actions */}
        <div className="grid lg:grid-cols-12 gap-8 mb-8">

          {/* Carte Solde Principal */}
          <div className="lg:col-span-5">
            <GlassCard className="p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <PiggyBank className="text-white" size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">{account.sfdName}</h3>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-3 py-1 text-xs font-medium rounded-full border",
                        account.statut === 'actif' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      )}>
                        {account.statut === 'actif' ? 'Actif' : 'En cours'}
                      </span>
                      {account.eligibiliteCredit && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                          <Award size={12} className="inline mr-1" />
                          Éligible crédit
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-600 mb-2">Solde disponible</p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {account.solde.toLocaleString()}
                  </p>
                  <p className="text-lg text-gray-500">FCFA</p>
                </div>

                {/* Actions rapides */}
                {account.statut === 'actif' && (
                  <div className="grid grid-cols-2 gap-3">
                    <GlassButton
                      onClick={() => setIsDepositModalOpen(true)}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    >
                      <ArrowUp size={16} className="mr-2" />
                      Déposer
                    </GlassButton>
                    <GlassButton
                      onClick={() => setIsWithdrawalModalOpen(true)}
                      variant="outline"
                    >
                      <ArrowDown size={16} className="mr-2" />
                      Retirer
                    </GlassButton>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Statistiques en grille */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4 h-full">

              {/* Total déposé */}
              <GlassCard className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total déposé</p>
                    <p className="text-2xl font-bold text-green-600">{account.totalDepose.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">FCFA</p>
                  </div>
                </div>
              </GlassCard>

              {/* Total retiré */}
              <GlassCard className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <ArrowDown className="text-red-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total retiré</p>
                    <p className="text-2xl font-bold text-red-600">{account.totalRetire.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">FCFA</p>
                  </div>
                </div>
              </GlassCard>

              {/* Nombre de transactions */}
              <GlassCard className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Activity className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Transactions</p>
                    <p className="text-2xl font-bold text-blue-600">{account.nombreTransactions}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
              </GlassCard>

              {/* Croissance nette */}
              <GlassCard className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Solde actuel</p>
                    <p className="text-2xl font-bold text-purple-600">{account.solde.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">FCFA</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Section principale */}
        <div className="grid lg:grid-cols-12 gap-8">

          {/* Contenu principal - Historique des transactions */}
          <div className="lg:col-span-8">
            <GlassCard className="p-6" hover={false}>

              {/* Header avec filtres */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Historique des transactions</h3>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 backdrop-blur-sm"
                    />
                  </div>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 backdrop-blur-sm"
                  >
                    <option value="tous">Tous</option>
                    <option value="depot">Dépôts</option>
                    <option value="retrait">Retraits</option>
                  </select>
                </div>
              </div>

              {/* Liste des transactions */}
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => {
                  const IconComponent = getTransactionIcon(transaction.type);
                  const colorClass = getTransactionColor(transaction.type);

                  return (
                    <div key={transaction.id} className="group p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/60 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center gap-4">

                        {/* Icône de transaction */}
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", colorClass)}>
                          <IconComponent size={20} />
                        </div>

                        {/* Informations principales */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 mb-1">{transaction.description}</p>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-1">
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  {format(new Date(transaction.date), 'dd MMM yyyy à HH:mm', { locale: fr })}
                                </span>
                                <span>•</span>
                                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{transaction.reference}</span>
                                {transaction.methodePaiement && (
                                  <>
                                    <span>•</span>
                                    <span className="capitalize flex items-center gap-1">
                                      <Smartphone size={12} />
                                      {transaction.methodePaiement.replace('_', ' ')}
                                      {transaction.numeroMobileMoney && (
                                        <span className="font-mono">({transaction.numeroMobileMoney})</span>
                                      )}
                                    </span>
                                  </>
                                )}
                              </div>
                              {transaction.notes && (
                                <p className="text-xs text-gray-400 italic">{transaction.notes}</p>
                              )}
                            </div>

                            {/* Montant et statut */}
                            <div className="text-right ml-4">
                              <p className={cn(
                                "font-bold text-xl mb-1",
                                transaction.type === 'retrait' || transaction.type === 'frais' ? 'text-red-600' : 'text-green-600'
                              )}>
                                {transaction.type === 'retrait' || transaction.type === 'frais' ? '-' : '+'}
                                {transaction.montant.toLocaleString()}
                                <span className="text-sm ml-1">FCFA</span>
                              </p>

                              <div className="flex items-center justify-end gap-2 mb-1">
                                <div className={cn(
                                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                                  getStatusBadge(transaction.statut)
                                )}>
                                  <CheckCircle size={10} className="mr-1" />
                                  {transaction.statut === 'confirme' ? 'Confirmé' :
                                    transaction.statut === 'en_attente' ? 'En attente' : 'Rejeté'}
                                </div>
                              </div>

                              <div className="text-xs text-gray-400">
                                Solde: {transaction.soldeApres.toLocaleString()} FCFA
                                {transaction.frais && transaction.frais > 0 && (
                                  <div className="text-orange-600">Frais: {transaction.frais} FCFA</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* État vide */}
              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="text-gray-400" size={32} />
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-2">Aucune transaction trouvée</p>
                  <p className="text-gray-500">Modifiez les filtres de recherche pour voir plus de résultats</p>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Sidebar - Informations et actions */}
          <div className="lg:col-span-4 space-y-6">

            {/* Éligibilité crédit */}
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  account.eligibiliteCredit ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white" : "bg-gray-100 text-gray-600"
                )}>
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Éligibilité crédit</h3>
                  <p className={cn(
                    "text-sm font-medium",
                    account.eligibiliteCredit ? "text-purple-600" : "text-gray-500"
                  )}>
                    {account.eligibiliteCredit ? 'Éligible' : 'Non éligible'}
                  </p>
                </div>
              </div>

              {account.eligibiliteCredit ? (
                <div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-purple-800 mb-2">
                      🎉 Félicitations ! Votre compte est éligible pour une demande de prêt.
                    </p>
                    <p className="text-xs text-purple-600">
                      Ancienneté du compte: {monthsActive} mois
                    </p>
                  </div>
                  <Link href={`/dashboards/dashboard-client/loans/new/${id}`}>
                    <GlassButton className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                      <CreditCard size={16} className="mr-2" />
                      Demander un prêt
                    </GlassButton>
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-700 mb-3">
                      Votre compte doit être actif depuis au moins 3 mois pour être éligible aux prêts.
                    </p>
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progression</span>
                        <span>{monthsActive}/3 mois</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((monthsActive / 3) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {Math.max(0, 3 - monthsActive)} mois restants
                    </p>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
      {
        isWithdrawalModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full relative max-w-xl">
              <button
                onClick={() => setIsWithdrawalModalOpen(false)}
                className="absolute top-5 right-5 text-black hover:text-gray-800 cursor-pointer"
              >
                ✕
              </button>
              <WithdrawalForm
                isOpen={isWithdrawalModalOpen}
                onClose={() => setIsWithdrawalModalOpen(false)}
                details={account}
                loading={loading}
                onSubmit={handleWithdraw}
              />
            </div>
          </div>
        )
      }
      {
        isDepositModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full relative max-w-xl">
              <button
                onClick={() => setIsDepositModalOpen(false)}
                className="absolute top-5 right-5 text-black hover:text-gray-800 cursor-pointer"
              >
                ✕
              </button>
              <DepositForm
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
                details={account}
                loading={loading}
                onSubmit={handleDeposit}
              />
            </div>
          </div>
        )
      }
    </div>
  );
};

export default SavingsAccountDetails;
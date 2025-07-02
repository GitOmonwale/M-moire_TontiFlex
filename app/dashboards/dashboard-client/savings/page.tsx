'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import {
  PiggyBank,
  Plus,
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
  PieChart,
  Star
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Types pour les comptes épargne
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
}

interface Transaction {
  id: string;
  accountId: string;
  type: 'depot' | 'retrait';
  montant: number;
  date: string;
  description: string;
  reference: string;
  methodePaiement?: 'mtn_money' | 'moov_money';
  numeroMobileMoney?: string;
  statut: 'confirme' | 'en_attente' | 'rejete';
  frais?: number;
  soldeAvant: number;
  soldeApres: number;
}

// Mock des comptes épargne
const mockSavingsAccounts: SavingsAccount[] = [
  {
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
    derniereMouvement: '2025-06-15T14:30:00Z'
  },
  {
    id: 'ep_002',
    sfdName: 'VITAL FINANCE',
    sfdLogo: '/logos/vital.png',
    accountNumber: 'VF-EP-240002',
    solde: 75000,
    dateCreation: '2024-05-20T00:00:00Z',
    statut: 'actif',
    totalDepose: 85000,
    totalRetire: 11200,
    nombreTransactions: 18,
    eligibiliteCredit: true,
    derniereMouvement: '2025-06-14T09:15:00Z'
  },
  {
    id: 'ep_003',
    sfdName: 'MICROCARITAS',
    sfdLogo: '/logos/microcaritas.png',
    accountNumber: 'MC-EP-240003',
    solde: 45000,
    dateCreation: '2024-08-10T00:00:00Z',
    statut: 'actif',
    totalDepose: 50000,
    totalRetire: 5850,
    nombreTransactions: 12,
    eligibiliteCredit: false,
    derniereMouvement: '2025-06-12T16:45:00Z'
  },
  {
    id: 'ep_004',
    sfdName: 'ACEP BÉNIN',
    sfdLogo: '/logos/acep.png',
    accountNumber: 'AC-EP-250001',
    solde: 0,
    dateCreation: '2025-06-10T00:00:00Z',
    statut: 'en_cours_creation',
    totalDepose: 0,
    totalRetire: 0,
    nombreTransactions: 0,
    eligibiliteCredit: false,
    derniereMouvement: '2025-06-10T10:00:00Z'
  }
];

// Mock des transactions récentes
const mockRecentTransactions: Transaction[] = [
  {
    id: 'tx_001',
    accountId: 'ep_001',
    type: 'depot',
    montant: 15000,
    date: '2025-06-15T14:30:00Z',
    description: 'Dépôt Mobile Money',
    reference: 'TF-DEP-150625',
    methodePaiement: 'mtn_money',
    numeroMobileMoney: '*****4587',
    statut: 'confirme',
    frais: 25,
    soldeAvant: 110000,
    soldeApres: 125000
  },
  {
    id: 'tx_002',
    accountId: 'ep_002',
    type: 'retrait',
    montant: 5000,
    date: '2025-06-14T09:15:00Z',
    description: 'Retrait urgence',
    reference: 'TF-RET-140625',
    methodePaiement: 'moov_money',
    numeroMobileMoney: '*****7829',
    statut: 'confirme',
    frais: 150,
    soldeAvant: 80000,
    soldeApres: 75000
  }
];

const SavingsAccountsOverview = () => {
  const [accounts, setAccounts] = useState<SavingsAccount[]>(mockSavingsAccounts);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(mockRecentTransactions);
  const [filter, setFilter] = useState<'tous' | 'actif' | 'en_cours'>('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'1m' | '3m' | '6m' | '1y'>('3m');

  // Calculs statistiques globales
  const stats = {
    totalSolde: accounts.reduce((sum, acc) => sum + acc.solde, 0),
    totalDepose: accounts.reduce((sum, acc) => sum + acc.totalDepose, 0),
    totalRetire: accounts.reduce((sum, acc) => sum + acc.totalRetire, 0),
    nombreComptes: accounts.length,
    comptesActifs: accounts.filter(acc => acc.statut === 'actif').length,
    comptesEligiblesCredit: accounts.filter(acc => acc.eligibiliteCredit).length,
  };

  // Filtrage des comptes
  const filteredAccounts = accounts.filter(account => {
    if (filter === 'actif' && account.statut !== 'actif') return false;
    if (filter === 'en_cours' && account.statut !== 'en_cours_creation') return false;
    if (searchTerm && !account.sfdName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Données pour les graphiques
  const sfdDistribution = accounts.reduce((acc, account) => {
    acc[account.sfdName] = (acc[account.sfdName] || 0) + account.solde;
    return acc;
  }, {} as Record<string, number>);

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'actif':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'en_cours_creation':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'suspendu':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'actif': return 'Actif';
      case 'en_cours_creation': return 'En cours';
      case 'suspendu': return 'Suspendu';
      default: return statut;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Comptes Épargne</h1>
              <p className="text-gray-600">Gérez vos épargnes auprès de différents SFD</p>
            </div>
            <div className="">
              <Link href="/dashboards/dashboard-client/savings/new">
                <GlassButton className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  <Plus size={16} className="mr-2" />
                  Nouveau compte
                </GlassButton>
              </Link>
            </div>
          </div>

          {/* Conseils d'Épargne (discreet banner) */}
          <GlassCard className="p-4 mb-6 bg-white/50 border-l-4 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="text-blue-600" size={20} />
                <p className="text-sm font-medium text-gray-900">Conseil :                 Diversifiez vos épargnes en ouvrant des comptes dans différents SFD pour réduire les risques.</p>
              </div>
            </div>
          </GlassCard>

          {/* Filtres et recherche */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'tous', label: 'Tous les comptes', count: stats.nombreComptes },
                { id: 'actif', label: 'Comptes actifs', count: stats.comptesActifs },
                { id: 'en_cours', label: 'En création', count: stats.nombreComptes - stats.comptesActifs }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    filter === filterOption.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white/60 text-gray-700 hover:bg-white/80 border border-white/20"
                  )}
                >
                  {filterOption.label}
                  <span className={cn(
                    "ml-2 px-2 py-0.5 rounded-full text-xs",
                    filter === filterOption.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  )}>
                    {filterOption.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-3 lg:ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher un SFD ou numéro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1m">1 mois</option>
                <option value="3m">3 mois</option>
                <option value="6m">6 mois</option>
                <option value="1y">1 an</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div>
          {/* Liste des comptes épargne */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Vos comptes ({filteredAccounts.length})
          </h2>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <GlassCard key={account.id} className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        <Building className="text-blue-600" size={28} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{account.sfdName}</h3>
                        <p className="text-sm text-gray-600 font-mono">{account.accountNumber}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn(
                            "px-2 py-1 text-xs font-medium rounded-full border",
                            getStatusBadge(account.statut)
                          )}>
                            {getStatusLabel(account.statut)}
                          </span>
                          {account.eligibiliteCredit && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200">
                              Éligible crédit
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-600">Solde:</span>
                      <p className="font-semibold text-gray-900">{account.solde.toLocaleString()} FCFA</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Transactions:</span>
                      <p className="font-semibold text-gray-900">{account.nombreTransactions}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Créé le:</span>
                      <p className="font-semibold text-gray-900">
                        {format(new Date(account.dateCreation), 'dd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total déposé:</span>
                      <p className="font-semibold text-gray-900">{account.totalDepose.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Dernier mouvement: {format(new Date(account.derniereMouvement), 'dd MMM à HH:mm', { locale: fr })}
                    </p>
                    <div className="flex gap-2">
                      {account.statut === 'actif' && (
                        <>
                          <GlassButton size="sm" variant="outline">
                            <ArrowUp size={16} className="mr-2" />
                            Déposer
                          </GlassButton>
                          <GlassButton size="sm" variant="outline">
                            <ArrowDown size={16} className="mr-2" />
                            Retirer
                          </GlassButton>
                        </>
                      )}
                      <Link href={`/dashboards/dashboard-client/savings/${account.id}`}>
                        <GlassButton size="sm">
                          <Eye size={16} className="mr-2" />
                          Détails
                        </GlassButton>
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              ))
            ) : (
              <GlassCard className="p-12 text-center">
                <PiggyBank className="mx-auto mb-4 text-gray-400" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun compte trouvé</h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'tous'
                    ? "Vous n'avez pas encore de compte épargne."
                    : `Aucun compte ne correspond au filtre "${filter}".`
                  }
                </p>
                <Link href="/dashboards/dashboard-client/savings/new">
                  <GlassButton>
                    <Plus size={16} className="mr-2" />
                    Créer un compte épargne
                  </GlassButton>
                </Link>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsAccountsOverview;
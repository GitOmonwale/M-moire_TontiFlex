// app/dashboard-sfd-admin/loans/page.tsx
'use client'
import React, { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  DollarSign, 
  User, 
  Calendar,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Download,
  TrendingUp,
  Shield,
  Star,
  MoreVertical,
  MessageSquare,
  Phone,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const LoansValidation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Données mockées des prêts en attente
  const loans = [
    {
      id: 'PR001',
      client: {
        nom: 'Marie JOHNSON',
        telephone: '+229 97 12 34 56',
        email: 'marie.johnson@email.com',
        adresse: 'Cotonou, Littoral',
        profession: 'Commerçante',
        dateNaissance: '1985-05-15'
      },
      montant: 150000,
      duree: 12,
      tauxInteret: 12.5,
      objet: 'Extension boutique de vêtements',
      garantie: 'Caution solidaire + Stock marchandises',
      revenuMensuel: 85000,
      chargesMensuelles: 35000,
      scoreCredit: 85,
      scoreFiabilite: 92,
      historiqueTontine: {
        cotisationsRegulières: true,
        retards: 1,
        totalCotise: 45000,
        anciennete: '8 mois'
      },
      superviseur: 'DOSSA Paulin',
      dateTransmission: '2025-06-10T14:30:00Z',
      statut: 'en_attente',
      commentaireSuperviseur: 'Cliente très fiable avec un historique excellent. Demande justifiée pour expansion commerciale.',
      documentsJoints: ['CNI', 'Justificatif revenus', 'Plan d\'affaires', 'Photos boutique']
    },
    {
      id: 'PR002',
      client: {
        nom: 'Fatou AHOUNOU',
        telephone: '+229 96 23 45 67',
        email: 'fatou.ahounou@email.com',
        adresse: 'Porto-Novo, Ouémé',
        profession: 'Couturière',
        dateNaissance: '1990-03-22'
      },
      montant: 75000,
      duree: 6,
      tauxInteret: 10.0,
      objet: 'Achat machine à coudre industrielle',
      garantie: 'Caution familiale',
      revenuMensuel: 45000,
      chargesMensuelles: 18000,
      scoreCredit: 78,
      scoreFiabilite: 88,
      historiqueTontine: {
        cotisationsRegulières: true,
        retards: 0,
        totalCotise: 32000,
        anciennete: '6 mois'
      },
      superviseur: 'AHOYO Bernadette',
      dateTransmission: '2025-06-09T09:15:00Z',
      statut: 'en_attente',
      commentaireSuperviseur: 'Excellent profil, zéro retard. Investissement productif qui augmentera ses revenus.',
      documentsJoints: ['CNI', 'Attestation formation', 'Devis équipement']
    },
    {
      id: 'PR003',
      client: {
        nom: 'Adjoa MENSAH',
        telephone: '+229 95 34 56 78',
        email: 'adjoa.mensah@email.com',
        adresse: 'Parakou, Borgou',
        profession: 'Agricultrice',
        dateNaissance: '1978-11-08'
      },
      montant: 200000,
      duree: 18,
      tauxInteret: 15.0,
      objet: 'Achat semences et engrais campagne agricole',
      garantie: 'Hypothèque terrain + Caution',
      revenuMensuel: 120000,
      chargesMensuelles: 45000,
      scoreCredit: 72,
      scoreFiabilite: 85,
      historiqueTontine: {
        cotisationsRegulières: false,
        retards: 3,
        totalCotise: 28000,
        anciennete: '10 mois'
      },
      superviseur: 'KPADE Michel',
      dateTransmission: '2025-06-08T16:45:00Z',
      statut: 'en_attente',
      commentaireSuperviseur: 'Quelques retards mais revenus saisonniers. Demande légitime pour campagne agricole.',
      documentsJoints: ['CNI', 'Titre foncier', 'Plan de culture', 'Devis intrants']
    },
    {
      id: 'PR004',
      client: {
        nom: 'Yvette GBAGUIDI',
        telephone: '+229 94 45 67 89',
        email: 'yvette.gbaguidi@email.com',
        adresse: 'Abomey, Zou',
        profession: 'Transformatrice alimentaire',
        dateNaissance: '1987-07-12'
      },
      montant: 100000,
      duree: 9,
      tauxInteret: 11.5,
      objet: 'Équipement transformation manioc',
      garantie: 'Caution solidaire groupe',
      revenuMensuel: 65000,
      chargesMensuelles: 25000,
      scoreCredit: 81,
      scoreFiabilite: 90,
      historiqueTontine: {
        cotisationsRegulières: true,
        retards: 0,
        totalCotise: 58000,
        anciennete: '12 mois'
      },
      superviseur: 'DOSSA Paulin',
      dateTransmission: '2025-06-07T11:20:00Z',
      statut: 'en_attente',
      commentaireSuperviseur: 'Excellente cliente, timing critique pour période de récolte.',
      documentsJoints: ['CNI', 'Attestation groupement', 'Devis équipement', 'Contrats clients']
    }
  ];

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.statut === statusFilter;
    const matchesAmount = amountFilter === 'all' || 
      (amountFilter === 'small' && loan.montant <= 50000) ||
      (amountFilter === 'medium' && loan.montant > 50000 && loan.montant <= 150000) ||
      (amountFilter === 'large' && loan.montant > 150000);
    
    return matchesSearch && matchesStatus && matchesAmount;
  });

  const handleValidation = async (loanId: string, decision: 'approve' | 'reject', comment?: string) => {
    try {
      // Simulation API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const action = decision === 'approve' ? 'approuvé' : 'rejeté';
      toast.success(`Prêt ${loanId} ${action} avec succès!`);
      
      // Ici vous pouvez mettre à jour l'état local ou recharger les données
      console.log(`Prêt ${loanId} ${action}`, { comment });
      
    } catch (error) {
      toast.error('Erreur lors de la validation');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_attente':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1">
          <Clock size={12} />
          En attente
        </span>;
        case 'validé':
          return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
            <AlertTriangle size={12} />
            Validé
          </span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Inconnu</span>;
    }
  };


  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-4 text-center border-l-4 border-l-yellow-500">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {loans.filter(l => l.statut === 'en_attente').length}
            </div>
            <div className="text-sm text-gray-600">En attente</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center border-l-4 border-l-red-500">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {loans.filter(l => l.statut === 'validé').length}
            </div>
            <div className="text-sm text-gray-600">Validés</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center border-l-4 border-l-emerald-500">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              {(loans.reduce((sum, l) => sum + l.montant, 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Montant total (FCFA)</div>
          </GlassCard>
        </div>

        {/* Filtres et actions */}
        <div className="my-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Barre de recherche */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher un prêt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-white/60 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              {/* Filtres */}
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 bg-white/60">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="validé">Validé</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={amountFilter} onValueChange={setAmountFilter}>
                  <SelectTrigger className="w-36 bg-white/60">
                    <SelectValue placeholder="Montant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous montants</SelectItem>
                    <SelectItem value="small">≤ 50K FCFA</SelectItem>
                    <SelectItem value="medium">50K - 150K FCFA</SelectItem>
                    <SelectItem value="large">150K FCFA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <GlassButton variant="outline" size="sm">
                <Download className="mr-2" size={16} />
                Exporter
              </GlassButton>
            </div>
          </div>
        </div>

        {/* Liste des prêts */}
        <div className="grid gap-6">
          {filteredLoans.map((loan) => (
            <GlassCard key={loan.id} className="p-6" hover={false}>
              <div className="grid lg:grid-cols-4 gap-6">
                
                {/* Informations client */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <User size={16} className="text-emerald-600" />
                      {loan.client.nom}
                    </h3>
                    <div className="flex gap-2 text-xs text-nowrap">
                      {getStatusBadge(loan.statut)}
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone size={12} />
                      {loan.client.telephone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={12} />
                      {loan.client.email}
                    </div>
                    <div>{loan.client.profession}</div>
                    <div className="text-xs text-gray-500">{loan.client.adresse}</div>
                  </div>
                </div>

                {/* Détails du prêt */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <DollarSign size={16} className="text-emerald-600" />
                    Demande de prêt
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant:</span>
                      <span className="font-bold text-emerald-600">{loan.montant.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée:</span>
                      <span>{loan.duree} mois</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taux:</span>
                      <span>{loan.tauxInteret}% /an</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      <strong>Objet:</strong> {loan.objet}
                    </div>
                  </div>
                </div>

                {/* Scores et évaluation */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-600" />
                    Évaluation
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Score crédit:</span>
                      <span className={`font-bold ${getScoreColor(loan.scoreCredit)}`}>
                        {loan.scoreCredit}/100
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Fiabilité:</span>
                      <span className={`font-bold ${getScoreColor(loan.scoreFiabilite)}`}>
                        {loan.scoreFiabilite}/100
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Revenus: {loan.revenuMensuel.toLocaleString()} FCFA/mois</div>
                      <div>Charges: {loan.chargesMensuelles.toLocaleString()} FCFA/mois</div>
                      <div>Tontine: {loan.historiqueTontine.retards} retard(s)</div>
                    </div>
                  </div>
                </div>

                {/* Actions et informations superviseur */}
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="text-gray-600 mb-1">Superviseur:</div>
                    <div className="font-medium">{loan.superviseur}</div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(loan.dateTransmission), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <GlassButton
                      size="sm"
                      onClick={() => {
                        setSelectedLoan(loan);
                        setShowDetails(true);
                      }}
                      className="w-full"
                    >
                      <Eye className="mr-2" size={14} />
                      Voir détails
                    </GlassButton>
                    
                    <div className="flex gap-2">
                      <GlassButton
                        size="sm"
                        onClick={() => handleValidation(loan.id, 'approve')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="mr-1" size={14} />
                        Approuver
                      </GlassButton>
                      
                      <GlassButton
                        size="sm"
                        variant="outline"
                        onClick={() => handleValidation(loan.id, 'reject')}
                        className="flex-1 border-red-300 text-red-600 bg-red-50 hover:bg-red-100"
                      >
                        <XCircle className="mr-1" size={14} />
                        Rejeter
                      </GlassButton>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredLoans.length === 0 && (
          <GlassCard className="p-12 text-center">
            <FileText className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 text-lg mb-2">Aucun prêt en attente</p>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || amountFilter !== 'all'
                ? 'Essayez de modifier vos filtres'
                : 'Tous les prêts ont été traités'
              }
            </p>
          </GlassCard>
        )}

        {/* Modal de détails (simplifié) */}
        {showDetails && selectedLoan && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">
                  Détails du prêt {selectedLoan.id}
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <XCircle size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Informations client</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nom:</strong> {selectedLoan.client.nom}</div>
                      <div><strong>Téléphone:</strong> {selectedLoan.client.telephone}</div>
                      <div><strong>Email:</strong> {selectedLoan.client.email}</div>
                      <div><strong>Profession:</strong> {selectedLoan.client.profession}</div>
                      <div><strong>Adresse:</strong> {selectedLoan.client.adresse}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Historique tontine</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Ancienneté:</strong> {selectedLoan.historiqueTontine.anciennete}</div>
                      <div><strong>Total cotisé:</strong> {selectedLoan.historiqueTontine.totalCotise.toLocaleString()} FCFA</div>
                      <div><strong>Retards:</strong> {selectedLoan.historiqueTontine.retards}</div>
                      <div><strong>Régularité:</strong> {selectedLoan.historiqueTontine.cotisationsRegulières ? 'Oui' : 'Non'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Commentaire du superviseur</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {selectedLoan.commentaireSuperviseur}
                  </p>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Documents joints</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLoan.documentsJoints.map((doc: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoansValidation;
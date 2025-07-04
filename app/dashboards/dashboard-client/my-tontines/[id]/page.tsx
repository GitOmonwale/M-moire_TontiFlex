'use client';
import React, { useState, useEffect } from 'react';
import { useParticipants } from '@/hooks/useParticipants';
import { useCarnetsCotisation } from '@/hooks/useCarnets';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { Calendar, CheckCircle, Star, Clock, Target, Award } from 'lucide-react';
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { format, addDays, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import ContributionForm from "@/components/forms/ContributionsForm";
import WithdrawalForm from "@/components/forms/WithdrawalForm";
import {
    ArrowLeft, Building, TrendingUp, CreditCard, FileText, AlertCircle, Plus, Minus, Wallet, Activity, Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const TontineDetailsPage = () => {
    const params = useParams();
    const router = useRouter();
    const participantId = "c18d3f68-6cd2-49ef-9748-30d6b412c309";

    const {
        participantDetails,
        loading,
        error,
        fetchParticipantDetailsComplets,
        cotiser
    } = useParticipants();

    const {
        calculerStatistiquesCarnet,
        cocherMises,
        genererNouveauCarnet,
        loading: carnetLoading
    } = useCarnetsCotisation();

    const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

    // État pour le formulaire de cotisation
    const [cotisationData, setCotisationData] = useState({
        nombre_mises: 1,
        numero_telephone: '',
        commentaire: ''
    });

    useEffect(() => {
        if (participantId) {
            fetchParticipantDetailsComplets(participantId);
        }
    }, []);

    // Fonction pour effectuer une cotisation selon la VRAIE logique système
    const effectuerCotisationAwa = async (nombreMises: number) => {
        try {
            const carnetsDisponibles = participantDetails?.carnets_cotisation || [];
            const carnetActuelData = carnetsDisponibles.find(c => {
                const joursEcoules = Math.floor((new Date().getTime() - new Date(c.cycle_debut).getTime()) / (1000 * 60 * 60 * 24));
                const misesPayees = c.mises_cochees.filter(Boolean).length;
                return joursEcoules < 31 && misesPayees < 31;
            });

            if (carnetActuelData) {
                // Prédire les cases qui seront cochées avec le hook useCarnetsCotisation
                const nouvellesMises = cocherMises(carnetActuelData, nombreMises);
                console.log(`🎯 Prochaines cases à cocher avec le hook useCarnetsCotisation :`,
                    nouvellesMises.map((coche, i) => coche && !carnetActuelData.mises_cochees[i] ? i + 1 : null).filter(Boolean)
                );
            }

            await cotiser(participantId, {
                nombre_mises: nombreMises,
                numero_telephone: cotisationData.numero_telephone,
                commentaire: `Cotisation - Cochage chronologique intelligent`
            });

            setIsContributionModalOpen(false);
            // Rafraîchir les données après cotisation
            await fetchParticipantDetailsComplets(participantId);
        } catch (error) {
            console.error('Erreur lors de la cotisation:', error);
        }
    };

    if (loading || carnetLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Chargement des détails...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-6">
                <GlassCard className="max-w-md w-full">
                    <div className="text-center py-8">
                        <AlertCircle className="mx-auto mb-4 text-red-500" size={64} />
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">Erreur de chargement</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <GlassButton
                            onClick={() => fetchParticipantDetailsComplets(participantId)}
                            size="lg"
                        >
                            Réessayer
                        </GlassButton>
                    </div>
                </GlassCard>
            </div>
        );
    }

    if (!participantDetails) {
        return (
            <div className="flex items-center justify-center p-6">
                <GlassCard className="max-w-md w-full">
                    <div className="text-center py-8">
                        <AlertCircle className="mx-auto mb-4 text-red-500" size={64} />
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">Participant introuvable</h2>
                        <p className="text-gray-600 mb-6">Les détails de participation demandés n'existent pas ou ne sont plus accessibles.</p>
                        <GlassButton onClick={() => router.push('/dashboard')} size="lg">
                            Retour au tableau de bord
                        </GlassButton>
                    </div>
                </GlassCard>
            </div>
        );
    }

    // Génération des carnets selon la VRAIE logique du système + carnets futurs prédictifs
    const carnetsDisponibles = participantDetails?.carnets_cotisation || [];

    // Générer des carnets futurs prédictifs pour affichage (désactivés)
    const genererCarnetsFuturs = () => {
        if (carnetsDisponibles.length === 0) return [];

        const dernierCarnet = carnetsDisponibles[carnetsDisponibles.length - 1];
        const dateDernierCarnet = new Date(dernierCarnet.cycle_debut);
        const carnetsFuturs = [];

        // Générer 3 carnets futurs prédictifs
        for (let i = 1; i <= (12 - carnetsDisponibles.length); i++) {
            const dateDebut = new Date(dateDernierCarnet);
            dateDebut.setDate(dateDebut.getDate() + (31 * i));

            carnetsFuturs.push({
                id: `futur-${i}`,
                cycle_debut: dateDebut.toISOString().split('T')[0],
                mises_cochees: Array(31).fill(false),
                mises_completees: 0,
                client_nom: participantDetails.client_nom,
                tontine_nom: participantDetails.tontine_nom,
                date_creation: dateDebut.toISOString(),
                date_modification: dateDebut.toISOString(),
                client: participantDetails.client,
                tontine: dernierCarnet.tontine,
                estCarnetFutur: true // Marqueur pour les carnets prédictifs
            });
        }

        return carnetsFuturs;
    };

    const carnetsFuturs = genererCarnetsFuturs();
    const tousLesCarnets = [...carnetsDisponibles, ...carnetsFuturs];

    const carnetsReels = tousLesCarnets
        .sort((a, b) => new Date(a.cycle_debut).getTime() - new Date(b.cycle_debut).getTime())
        .map((carnet, index) => {
            const dateDebut = new Date(carnet.cycle_debut);
            const dateFin = new Date(dateDebut);
            dateFin.setDate(dateFin.getDate() + 30); // 31 jours total

            const aujourdhui = new Date();
            const joursEcoules = Math.floor((aujourdhui.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24));

            // États du carnet selon la vraie logique
            const estExpire = joursEcoules >= 31;
            const estActif = !estExpire && joursEcoules >= 0 && !carnet.estCarnetFutur;
            const estFutur = joursEcoules < 0 || carnet.estCarnetFutur;

            const misesPayees = carnet.mises_cochees.filter(Boolean).length;
            const estPlein = misesPayees >= 31;

            // ✅ UTILISATION DU HOOK useCarnetsCotisation pour les statistiques (seulement pour les vrais carnets)
            const stats = !carnet.estCarnetFutur ? calculerStatistiquesCarnet(carnet) : {
                joursPayes: 0,
                joursRestants: 31,
                pourcentageCompletion: 0,
                premierJourLibre: 1
            };

            // Calcul des jours avant le début pour les carnets futurs
            const joursAvantDebut = estFutur ? Math.ceil((dateDebut.getTime() - aujourdhui.getTime()) / (1000 * 60 * 60 * 24)) : 0;

            return {
                ...carnet,
                numero: index + 1,
                dateDebut,
                dateFin,
                joursEcoules,
                joursAvantDebut,
                estExpire,
                estActif,
                estFutur,
                estPlein,
                misesPayees: stats.joursPayes,
                misesRestantes: stats.joursRestants,
                pourcentageCompletion: stats.pourcentageCompletion,
                prochaineCaseACocher: stats.premierJourLibre,
                statut: estFutur ? `Débute dans ${joursAvantDebut} jours` :
                    estExpire ? 'Fermé automatiquement' :
                        estPlein ? 'Plein (31/31)' :
                            estActif ? 'Actif' : 'Futur'
            };
        });

    const carnetActif = carnetsReels.find(c => c.estActif && !c.estPlein && !c.estCarnetFutur);
    const totalPayeGlobal = carnetsReels.filter(c => !c.estCarnetFutur).reduce((total, carnet) => total + carnet.misesPayees, 0);
    const totalPossibleGlobal = carnetsReels.filter(c => !c.estCarnetFutur).length * 31;
    const totalOublie = totalPossibleGlobal - totalPayeGlobal;

    return (
        <div className="">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header moderne */}
                <div className="mb-8 flex justify-between gap-16">
                    <div className="flex items-center mb-6">
                        <GlassButton
                            variant="outline"
                            onClick={() => router.back()}
                            className="mr-4 h-10 w-10 p-0 rounded-full"
                        >
                            <ArrowLeft size={18} />
                        </GlassButton>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">{participantDetails.tontine_nom}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <Building className="mr-2" size={16} />
                                    {participantDetails.sfd_nom}
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="mr-2" size={16} />
                                    Adhéré le {format(new Date(participantDetails.dateAdhesion), 'dd MMM yyyy', { locale: fr })}
                                </div>
                                <div className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
                                    Participant actif
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <GlassButton
                            className="w-full h-12 text-left justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 cursor-pointer"
                            onClick={() => setIsContributionModalOpen(true)}
                        >
                            <Plus className="mr-3" size={20} />
                            <div>
                                <div className="font-medium">Cotiser</div>
                            </div>
                        </GlassButton>

                        <GlassButton
                            variant="outline"
                            className="w-full h-12 text-left justify-start border-2 cursor-pointer"
                            onClick={() => setIsWithdrawalModalOpen(true)}
                        >
                            <CreditCard className="mr-3" size={20} />
                            <div>
                                <div className="font-medium">Retirer</div>
                            </div>
                        </GlassButton>
                    </div>
                </div>

                {/* Stats cards modernes */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <GlassCard className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Solde disponible</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {parseFloat(participantDetails.solde_disponible).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">FCFA</p>
                            </div>
                            <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Wallet className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Total cotisé</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {parseFloat(participantDetails.total_cotise).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">FCFA</p>
                            </div>
                            <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <TrendingUp className="text-green-600" size={24} />
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Mise journalière</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {parseFloat(participantDetails.montantMise).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">FCFA/mise</p>
                            </div>
                            <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Target className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Carnets</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    #{carnetsReels.filter(c => !c.estCarnetFutur).length}
                                </p>
                                <p className="text-xs text-gray-500">Réels + {carnetsReels.filter(c => c.estCarnetFutur).length} futurs</p>
                            </div>
                            <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Activity className="text-orange-600" size={24} />
                            </div>
                        </div>
                    </GlassCard>
                </div>

                <div className="flex w-full flex-col">
                    <Tabs aria-label="Options" className="w-full">
                        <Tab key="Carnets" title="Carnets de Cotisation">
                            <Card>
                                <CardBody>

                                    <div className="space-y-6">
                                        {/* Tous les carnets organisés par statut */}
                                        <div>

                                            {/* Grille unifiée pour tous les carnets */}
                                            <div className="grid grid-cols-3 gap-4">
                                                {carnetsReels.map(carnet => (
                                                    <GlassCard
                                                        hover={false}
                                                        key={carnet.id}
                                                        className={`p-4 ${carnet.estActif
                                                            ? ''
                                                            : carnet.estExpire
                                                                ? 'opacity-75'
                                                                : carnet.estFutur
                                                                    ? 'opacity-50 bg-gray-50 border-dashed border-2 border-gray-300'
                                                                    : ''
                                                            }`}
                                                    >
                                                        <div className="mb-3">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h5 className={`text-base font-semibold ${carnet.estActif ? 'text-gray-900' :
                                                                    carnet.estFutur ? 'text-gray-500' : 'text-gray-700'
                                                                    }`}>
                                                                    Carnet #{carnet.numero}
                                                                </h5>
                                                            </div>
                                                            <div className={`text-sm ${carnet.estFutur ? 'text-gray-500' : 'text-gray-600'}`}>
                                                                {format(carnet.dateDebut, 'dd MMM', { locale: fr })} - {format(carnet.dateFin, 'dd MMM yyyy', { locale: fr })}
                                                            </div>

                                                            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                                                                <div>
                                                                    <div className={`text-base font-bold ${carnet.estFutur ? 'text-gray-400' : 'text-green-600'}`}>
                                                                        {carnet.estFutur ? '0' : carnet.misesPayees}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">Payées</div>
                                                                </div>
                                                                <div>
                                                                    <div className={`text-base font-bold ${carnet.estFutur ? 'text-gray-400' :
                                                                        carnet.estExpire ? 'text-gray-400' : 'text-orange-600'
                                                                        }`}>
                                                                        {carnet.estFutur ? '31' : carnet.estExpire ? carnet.misesRestantes : carnet.misesRestantes}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {carnet.estExpire ? 'Oubliées' : carnet.estFutur ? 'En attente' : 'Libres'}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className={`text-base font-bold ${carnet.estFutur ? 'text-gray-400' : 'text-blue-600'}`}>
                                                                        {carnet.estFutur ? '0' : carnet.pourcentageCompletion}%
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">Complété</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Grille numérotée selon le type de carnet */}
                                                        <div className="grid grid-cols-7 gap-1 mb-3">
                                                            {(carnet.estFutur ? Array(31).fill(false) : carnet.mises_cochees).map((estCoche: boolean, index: number) => {
                                                                const numeroCase = index + 1;
                                                                const estCommissionSfd = index === 0 && estCoche && !carnet.estFutur;
                                                                const estProchainLibre = carnet.estActif && carnet.prochaineCaseACocher === numeroCase;

                                                                return (
                                                                    <div
                                                                        key={numeroCase}
                                                                        className={`w-4 h-4 rounded text-[8px] font-medium flex items-center justify-center transition-all ${carnet.estFutur
                                                                            ? 'bg-gray-200 border border-gray-300 text-gray-400'
                                                                            : estCommissionSfd
                                                                                ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                                                                                : estCoche
                                                                                    ? 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                                                                                    : estProchainLibre
                                                                                        ? 'bg-blue-200 text-blue-800 border border-blue-400 scale-110'
                                                                                        : 'bg-gray-200 text-gray-600'}`}
                                                                    >
                                                                        {numeroCase}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        {/* Actions ou statut selon le type de carnet */}
                                                        {carnet.estActif ? (
                                                            <div className="flex gap-2">
                                                                <GlassButton
                                                                    onClick={() => effectuerCotisationAwa(1)}
                                                                    disabled={loading || carnet.estPlein}
                                                                    className="flex-1 text-xs py-1"
                                                                    size="sm"
                                                                >
                                                                    Payer 1 mise
                                                                    {carnet.prochaineCaseACocher && (
                                                                        <span className="ml-1">→ {carnet.prochaineCaseACocher}</span>
                                                                    )}
                                                                </GlassButton>
                                                                <GlassButton
                                                                    onClick={() => effectuerCotisationAwa(5)}
                                                                    disabled={loading || carnet.misesRestantes < 5}
                                                                    variant="outline"
                                                                    className="flex-1 text-xs py-1"
                                                                    size="sm"
                                                                >
                                                                    Payer 5
                                                                </GlassButton>
                                                            </div>
                                                        ) : carnet.estExpire && carnet.misesRestantes > 0 ? (
                                                            <div className="text-center">
                                                                <div className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                                    ✨ Fresh start appliqué
                                                                </div>
                                                            </div>
                                                        ) : carnet.estFutur ? (
                                                            <div className="text-center">
                                                                <div className="inline-flex items-center px-2 py-1 bg-gray-200 text-gray-500 rounded-full text-xs">
                                                                    🔒 Carnet désactivé
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </GlassCard>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex flex-wrap gap-6 justify-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded"></div>
                                            <span className="text-sm text-gray-700 font-medium">Contribution payée</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded"></div>
                                            <span className="text-sm text-gray-700 font-medium">Commission SFD</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
                                            <span className="text-sm text-gray-700 font-medium">Prochaine case à cocher</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                            <span className="text-sm text-gray-700 font-medium">Non payé</span>
                                        </div>
                                    </div>

                                </CardBody>
                            </Card>
                        </Tab>

                        <Tab key="History" title="Historique des opérations">
                            <Card>
                                <CardBody>
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Historique des transactions</h3>
                                        {carnetsReels.filter(c => !c.estCarnetFutur) && carnetsReels.filter(c => !c.estCarnetFutur).length > 0 ? (
                                            <div className="space-y-3">
                                                {/* Affichage des dernières cotisations basé sur les carnets réels */}
                                                {carnetsReels.filter(c => !c.estCarnetFutur).slice(-5).reverse().map((carnet, index) => (
                                                    <div key={carnet.id} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:shadow-sm transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-100">
                                                                <CheckCircle className="text-green-600" size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">Carnet #{carnet.numero}</p>
                                                                <p className="text-sm text-gray-500">
                                                                    {carnet.misesPayees} mises payées • {format(carnet.dateDebut, 'dd MMM yyyy', { locale: fr })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-green-600">
                                                                +{(carnet.misesPayees * parseFloat(participantDetails.montantMise)).toLocaleString()} FCFA
                                                            </p>
                                                            <div className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                                {carnet.pourcentageCompletion}% complété
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                                                <p className="text-gray-600">Les transactions apparaîtront ici selon vos carnets de cotisation</p>
                                            </div>
                                        )}

                                    </div>
                                </CardBody>
                            </Card>
                        </Tab>
                    </Tabs>
                </div>
            </div>

            {/* Modal de cotisation avec nouveau système */}
            {
                isContributionModalOpen && (
                    <ContributionForm
                        isOpen={isContributionModalOpen}
                        onClose={() => setIsContributionModalOpen(false)}
                        participantDetails={participantDetails}
                        carnetActif={carnetActif}
                        carnetsDisponibles={carnetsDisponibles}
                        loading={loading}
                        onSubmit={effectuerCotisationAwa}
                        cocherMises={cocherMises}
                        genererNouveauCarnet={genererNouveauCarnet}
                    />
                )
            }

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
                                participantDetails={participantDetails}
                                loading={loading}
                                
                            />
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default TontineDetailsPage;
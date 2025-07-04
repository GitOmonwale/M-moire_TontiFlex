'use client';
import React, { useState } from 'react';
import { GlassButton } from '@/components/GlassButton';

interface ContributionFormProps {
  isOpen: boolean;
  onClose: () => void;
  participantDetails: any;
  carnetActif: any;
  carnetsDisponibles: any[];
  loading: boolean;
  onSubmit: (nombreMises: number, cotisationData: any) => Promise<void>;
  cocherMises: (carnet: any, nombreMises: number) => boolean[];
  genererNouveauCarnet: (client: string, tontine: string) => any;
}

const ContributionForm: React.FC<ContributionFormProps> = ({
  isOpen,
  onClose,
  participantDetails,
  carnetActif,
  carnetsDisponibles,
  loading,
  onSubmit,
  cocherMises,
  genererNouveauCarnet
}) => {
  // État pour le formulaire de cotisation
  const [cotisationData, setCotisationData] = useState({
    nombre_mises: 1,
    numero_telephone: '',
    commentaire: ''
  });

  const handleSubmit = async () => {
    await onSubmit(cotisationData.nombre_mises, cotisationData);
    // Réinitialiser le formulaire après soumission
    setCotisationData({
      nombre_mises: 1,
      numero_telephone: '',
      commentaire: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full relative max-w-xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-black hover:text-gray-800 cursor-pointer"
        >
          ✕
        </button>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Effectuer une cotisation</h2>
            <p className="text-gray-600">Système de cochage chronologique intelligent</p>
            {carnetActif && carnetActif.prochaineCaseACocher && (
              <div className="mt-2 text-sm text-blue-600 font-medium">
                Prochaine case à cocher : #{carnetActif.prochaineCaseACocher}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de mises à payer
              </label>
              <input
                type="number"
                min="1"
                max={carnetActif ? carnetActif.misesRestantes : 31}
                value={cotisationData.nombre_mises}
                onChange={(e) => setCotisationData(prev => ({
                  ...prev,
                  nombre_mises: parseInt(e.target.value) || 1
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <div className="mt-2 space-y-1 text-sm">
                <p className="text-gray-600">
                  <strong>Montant calculé :</strong> {
                    (cotisationData.nombre_mises * parseFloat(participantDetails.montantMise)).toLocaleString()
                  } FCFA
                </p>
                {carnetActif && carnetActif.prochaineCaseACocher && (
                  <p className="text-blue-600">
                    <strong>Cases qui seront cochées :</strong> {
                      (() => {
                        // ✅ UTILISATION DU HOOK useCarnetsCotisation pour prédire le cochage
                        const carnetActuelData = carnetsDisponibles.find(c => c.id === carnetActif.id);
                        if (carnetActuelData) {
                          const nouvellesMises = cocherMises(carnetActuelData, cotisationData.nombre_mises);
                          return nouvellesMises
                            .map((coche, i) => coche && !carnetActuelData.mises_cochees[i] ? i + 1 : null)
                            .filter(Boolean)
                            .join(', ');
                        }
                        return Array.from({ length: Math.min(cotisationData.nombre_mises, carnetActif.misesRestantes) },
                          (_, i) => carnetActif.prochaineCaseACocher + i)
                          .filter(x => x <= 31)
                          .join(', ');
                      })()
                    }
                  </p>
                )}
                {!carnetActif && (
                  <p className="text-orange-600">
                    <strong>Nouveau carnet :</strong> Un nouveau carnet sera créé automatiquement
                    {(() => {
                      // ✅ UTILISATION DU HOOK useCarnetsCotisation pour générer un nouveau carnet
                      const nouveauCarnet = genererNouveauCarnet(
                        participantDetails.client,
                        participantDetails.carnets_cotisation?.[0]?.tontine || ''
                      );
                      console.log('📅 Nouveau carnet qui sera créé :', nouveauCarnet);
                      return null;
                    })()}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone Mobile Money
              </label>
              <input
                type="tel"
                value={cotisationData.numero_telephone}
                onChange={(e) => setCotisationData(prev => ({
                  ...prev,
                  numero_telephone: e.target.value
                }))}
                placeholder="+22370123456"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commentaire (optionnel)
              </label>
              <textarea
                value={cotisationData.commentaire}
                onChange={(e) => setCotisationData(prev => ({
                  ...prev,
                  commentaire: e.target.value
                }))}
                placeholder="Commentaire sur cette cotisation..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={2}
              />
            </div>
            <div className="flex gap-3">
              <GlassButton
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Annuler
              </GlassButton>
              <GlassButton
                onClick={handleSubmit}
                disabled={loading || !cotisationData.numero_telephone}
                className="flex-1"
              >
                {loading ? 'Traitement...' : `Payer ${cotisationData.nombre_mises} mise(s)`}
              </GlassButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionForm;
'use client';
import React, { useState, useEffect } from 'react';
import { GlassButton } from '@/components/GlassButton';
import { useKKiaPay } from '@/hooks/useKKiaPay';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';

interface ContributionFormProps {
  isOpen: boolean;
  onClose: () => void;
  participantDetails: any;
  loading: boolean;
  onSubmit: (nombreMises: number, cotisationData: any) => Promise<any>;
  onPaymentSuccess?: (paymentData: any, cotisationData: any) => void;
  onPaymentError?: (error: any) => void;
}

const ContributionForm: React.FC<ContributionFormProps> = ({
  isOpen,
  onClose,
  participantDetails,
  loading,
  onSubmit,
  onPaymentSuccess,
  onPaymentError,
}) => {
  // État pour le formulaire de cotisation
  const [cotisationData, setCotisationData] = useState({
    nombre_mises: 1,
    numero_telephone: '',
    commentaire: ''
  });

  const { user } = useAuth();
  const [cotisationResponse, setCotisationResponse] = useState<any>(null);
  const [step, setStep] = useState<'form' | 'payment' | 'processing'>('form');

  // Hook KKiaPay
  const {
    isSDKLoaded,
    isLoading: kkiapayLoading,
    error: kkiapayError,
    openPayment,
    setupPaymentListeners
  } = useKKiaPay();

  // ✅ Configurer les listeners de paiement KKiaPay avec simulation webhook
  useEffect(() => {
    if (!isSDKLoaded) return;

    // Callback de succès avec simulation webhook optimisée
    const successCallback = async (kkiapayResponse: any) => {
      console.log('✅ Paiement réussi côté KKiaPay:', kkiapayResponse);
      setStep('processing');

      try {
        // 🚀 SIMULATION DE WEBHOOK FORCÉE
        await simulateWebhookToBackend(kkiapayResponse, cotisationResponse, cotisationData);

        // Callback de succès
        onPaymentSuccess?.(kkiapayResponse, cotisationData);

        // 🎉 TOAST DE SUCCÈS
        toast.success('🎉 Paiement confirmé !', {
          description: 'Votre cotisation a été enregistrée avec succès',
          duration: 4000
        });

        resetForm();
        onClose();

      } catch (error) {
        console.error('❌ Erreur simulation webhook:', error);
        // Ne pas fermer le modal en cas d'erreur
      } finally {
        setStep('form');
      }
    };

    const errorCallback = (error: any) => {
      console.log('❌ Paiement échoué:', error);
      setStep('form');

      onPaymentError?.(error);

      toast.error(`❌ Paiement échoué: ${error.message || 'Erreur inconnue'}`);
    };

    // Configurer les listeners
    setupPaymentListeners(successCallback, errorCallback);

  }, [isSDKLoaded, cotisationResponse, cotisationData]);

  // ✅ FONCTION DE SIMULATION WEBHOOK OPTIMISÉE
  const simulateWebhookToBackend = async (
    kkiapayResponse: any,
    cotisationResp: any,
    formData: any
  ) => {
    const baseUrl = 'https://tontiflexapp.onrender.com/api';

    // 📦 Construire la payload de webhook comme KKiaPay l'enverrait
    const webhookPayload = {
      // ✅ Données principales du webhook KKiaPay
      transactionId: kkiapayResponse.transactionId,
      event: 'payment.success',
      timestamp: new Date().toISOString(),
      amount: cotisationResp.transaction_kkiapay.montant,
      status: 'SUCCESS', // Format KKiaPay
      data: {
        transaction_id: cotisationResp.transaction_kkiapay.id,
        reference: cotisationResp.transaction_kkiapay.reference,
        user_id: user?.id,
        type: 'cotisation_tontine',
        form_data: formData,
        cotisation_ids: cotisationResp.cotisations.map((c: any) => c.id),
      }
    };
    console.log('📡 Envoi simulation webhook:', webhookPayload);

    // 🎯 Envoyer au même endpoint que le vrai webhook
    const response = await fetch(`${baseUrl}/payments/webhook/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Simulated-Webhook': 'true', // Header pour identifier la simulation
      },
      body: JSON.stringify(webhookPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur simulation webhook: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Réponse simulation webhook:', result);

    return result;
  };

  const handleSubmit = async () => {
    if (!cotisationData.numero_telephone) {
      toast.error('Veuillez saisir un numéro de téléphone');
      return;
    }

    try {
      setStep('payment');
      await new Promise(resolve => setTimeout(resolve, 0)); // Forcer rendu

      // Créer la cotisation via l'API
      console.log('📡 Création de la cotisation...');
      const response = await onSubmit(cotisationData.nombre_mises, cotisationData);
      setCotisationResponse(response);
      console.log('✅ Cotisation créée:', response);

      // Utiliser le montant de l'API pour plus de cohérence
      const montantTotal = response.transaction_kkiapay.montant;

      // Configurer KKiaPay avec tous les paramètres
      const kkiapayConfig = {
        key: 'd1297c10527a11f0a266e50dce82524c',
        sandbox: true,
        amount: montantTotal,
        phone: cotisationData.numero_telephone,
        description: `TontiFlex-${response.transaction_kkiapay.reference}`,
        callback: 'https://tontiflexapp.onrender.com/api/payments/webhook/',
        position: 'center' as const,
        theme: '#2196f3'
      };
      console.log('💳 Configuration KKiaPay :', kkiapayConfig);

      // Configurer les listeners avant d'ouvrir
      const successCallback = async (kkiapayResponse: any) => {
        console.log('✅ Succès détecté :', kkiapayResponse);
        setStep('processing');
        await simulateWebhookToBackend(kkiapayResponse, response, cotisationData);
        onPaymentSuccess?.(kkiapayResponse, cotisationData);
        toast.success('🎉 Paiement confirmé !');
        resetForm();
        onClose();
      };
      const errorCallback = (error: any) => {
        console.log('❌ Échec détecté :', error);
        setStep('form');
        onPaymentError?.(error);
        toast.error(`❌ Paiement échoué: ${error.message || 'Erreur inconnue'}`);
      };
      setupPaymentListeners(successCallback, errorCallback);

      // Ouvrir le widget
      await openPayment(kkiapayConfig);
    } catch (error) {
      console.error('❌ Erreur :', error);
      toast.error('Erreur lors de la création de la cotisation');
      setStep('form');
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setCotisationData({
      nombre_mises: 1,
      numero_telephone: '',
      commentaire: ''
    });
    setCotisationResponse(null);
    setStep('form');
  };

  // Fermer et réinitialiser
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Calculer le montant total
  const montantTotal = cotisationData.nombre_mises * parseFloat(participantDetails?.montantMise || '0');

  return (
    <div className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white rounded-xl shadow-lg p-6 w-full relative max-w-xl transform transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-black hover:text-gray-800 cursor-pointer"
          disabled={step === 'processing'}
        >
          ✕
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 'form' && 'Effectuer une cotisation'}
              {step === 'payment' && 'Paiement en cours'}
              {step === 'processing' && 'Synchronisation...'}
            </h2>
            <p className="text-gray-600">
              {step === 'form' && 'Remplissez le formulaire et payez via Mobile Money'}
              {step === 'payment' && 'Procédez au paiement dans la fenêtre KKiaPay'}
              {step === 'processing' && 'Synchronisation des données avec le serveur...'}
            </p>
          </div>

          {/* Indicateur de simulation webhook */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Mode simulation webhook activé
                </p>
                <p className="text-xs text-blue-600">
                  Les données de paiement seront envoyées directement au serveur
                </p>
              </div>
            </div>
          </div>

          {/* Indicateur de chargement du SDK */}
          {!isSDKLoaded && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center">
                <Loader2 className="animate-spin h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    Chargement du système de paiement...
                  </p>
                  <p className="text-xs text-orange-600">
                    Initialisation de KKiaPay en cours
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Erreur KKiaPay */}
          {kkiapayError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Erreur système de paiement
                  </p>
                  <p className="text-xs text-red-600">{kkiapayError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Formulaire */}
          {step === 'form' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de mises à payer
                </label>
                <input
                  type="number"
                  min="1"
                  max={31}
                  value={cotisationData.nombre_mises}
                  onChange={(e) => setCotisationData(prev => ({
                    ...prev,
                    nombre_mises: parseInt(e.target.value) || 1
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <div className="mt-2 space-y-1 text-sm">
                  <p className="text-gray-600">
                    <strong>Montant calculé :</strong> {montantTotal.toLocaleString()} FCFA
                  </p>
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
                  placeholder="+22970123456"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pour test: utilisez +22997000000
                </p>
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
            </div>
          )}

          {/* État de paiement */}
          {step === 'payment' && (
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <p className="text-gray-600 mb-2">
                Widget de paiement KKiaPay ouvert
              </p>
              <p className="text-sm text-gray-500">
                Complétez le paiement dans la fenêtre qui s'est ouverte
              </p>
            </div>
          )}

          {/* État de traitement */}
          {step === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="animate-spin mx-auto h-12 w-12 text-green-600 mb-4" />
              <p className="text-gray-600 mb-2">
                Synchronisation des données avec le serveur...
              </p>
              <p className="text-sm text-gray-500">
                Envoi des informations de paiement au backend
              </p>
            </div>
          )}

          {/* Boutons d'action */}
          {step === 'form' && (
            <div className="flex gap-3">
              <GlassButton
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Annuler
              </GlassButton>
              <GlassButton
                onClick={handleSubmit}
                disabled={
                  loading ||
                  kkiapayLoading ||
                  !isSDKLoaded ||
                  !cotisationData.numero_telephone
                }
                className="flex-1"
              >
                {loading || kkiapayLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payer {cotisationData.nombre_mises} mise(s)
                  </>
                )}
              </GlassButton>
            </div>
          )}

          {step === 'payment' && (
            <div className="flex gap-3">
              <GlassButton
                variant="outline"
                onClick={() => setStep('form')}
                className="flex-1"
              >
                Annuler le paiement
              </GlassButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContributionForm;
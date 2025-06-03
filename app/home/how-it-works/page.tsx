import React from 'react';
import { 
  Smartphone, 
  CreditCard, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  MessageSquare, 
  Clock 
} from 'lucide-react';

interface StepProps {
  number: string;
  title: string;
  description: string;
}

const StepCard: React.FC<StepProps> = ({ number, title, description }) => (
  <div className="text-center group">
    <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
      {number}
    </div>
    <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HowItWorks: React.FC = () => {
  return (
    <section id="comment-ca-marche" className="py-20 bg-gradient-to-br from-secondary via-white to-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez TontiFlex et commencez votre parcours financier en quelques clics
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  1
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent/50 rounded"></div>
              </div>
              <h3 className="text-3xl font-bold text-primary mb-4">Inscription rapide</h3>
              <p className="text-lg text-gray-600 mb-6">
                Créez votre compte TontiFlex en moins de 2 minutes. Il vous suffit de fournir :
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Nom et prénom</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Numéro de téléphone (pour les SMS)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Adresse et profession</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Mot de passe sécurisé</span>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-primary/20">
                <h4 className="text-xl font-semibold mb-4 text-center text-primary">Formulaire d'inscription</h4>
                <div className="space-y-4">
                  <div className="h-10 bg-white/30 rounded-lg animate-pulse"></div>
                  <div className="h-10 bg-white/30 rounded-lg animate-pulse"></div>
                  <div className="h-10 bg-white/30 rounded-lg animate-pulse"></div>
                  <div className="h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center text-white font-semibold">
                    Créer mon compte
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white/30 rounded-lg border border-accent/20">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-accent" />
                    <span className="text-sm text-primary">SMS de confirmation instantané</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-20">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  2
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent/50 rounded"></div>
              </div>
              <h3 className="text-3xl font-bold text-primary mb-4">Sélection SFD & Tontine</h3>
              <p className="text-lg text-gray-600 mb-6">
                Explorez nos SFD partenaires et choisissez la tontine qui correspond à vos objectifs financiers :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-primary/20">
                  <h5 className="font-semibold text-primary mb-2">Comparez les SFD</h5>
                  <p className="text-sm text-gray-600">Taux, conditions, avantages</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-accent/20">
                  <h5 className="font-semibold text-primary mb-2">Choisissez votre mise</h5>
                  <p className="text-sm text-gray-600">Montant journalier personnalisé</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-primary/20">
                <h4 className="text-xl font-semibold mb-4 text-center text-primary">Sélection SFD</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-primary/20 rounded-lg hover:border-primary/40 cursor-pointer backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full"></div>
                      <span className="font-medium text-primary">PADME</span>
                    </div>
                    <span className="text-sm text-gray-500">1000-50000 FCFA</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border-2 border-primary rounded-lg bg-white/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent rounded-full"></div>
                      <span className="font-medium text-primary">FECECAM</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-primary/20 rounded-lg hover:border-primary/40 cursor-pointer backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-secondary rounded-full"></div>
                      <span className="font-medium text-primary">VITAL FINANCE</span>
                    </div>
                    <span className="text-sm text-gray-500">500-25000 FCFA</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white/20 rounded-lg border border-accent/20 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary">Mise journalière:</span>
                    <span className="text-lg font-bold text-accent">5,000 FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  3
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent/50 rounded"></div>
              </div>
              <h3 className="text-3xl font-bold text-primary mb-4">Validation & Adhésion</h3>
              <p className="text-lg text-gray-600 mb-6">
                Votre demande est traitée par l'agent SFD qui vérifie vos informations :
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-white/20 rounded-lg border border-primary/20 backdrop-blur-sm">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">✓</div>
                  <div>
                    <h5 className="font-semibold text-primary">Vérification pièce d'identité</h5>
                    <p className="text-sm text-gray-600">Contrôle de correspondance des informations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white/20 rounded-lg border border-accent/20 backdrop-blur-sm">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">$</div>
                  <div>
                    <h5 className="font-semibold text-primary">Paiement frais d'adhésion</h5>
                    <p className="text-sm text-gray-600">1,000 à 5,000 FCFA via Mobile Money</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-primary/20">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Clock className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-primary">En cours de validation</h4>
                  <p className="text-gray-600">Agent SFD en cours de vérification</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/20 rounded-lg border border-accent/20 backdrop-blur-sm">
                    <span className="text-sm text-primary">Documents reçus</span>
                    <CheckCircle className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/20 rounded-lg border border-primary/20 backdrop-blur-sm">
                    <span className="text-sm text-primary">Vérification en cours...</span>
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/20 rounded-lg border border-accent/20 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-5 h-5 text-accent" />
                    <span className="font-medium text-primary">SMS reçu</span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "Félicitations ! Votre adhésion est validée. Payez 3,000 FCFA pour finaliser votre inscription."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  4
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent/50 rounded"></div>
              </div>
              <h3 className="text-3xl font-bold text-primary mb-4">Cotisez en toute liberté</h3>
              <p className="text-lg text-gray-600 mb-6">
                Une fois intégré, gérez vos finances 24h/24 avec une flexibilité totale :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-primary/20">
                  <Smartphone className="w-8 h-8 text-primary mb-2" />
                  <h5 className="font-semibold text-primary mb-1">Cotisations Mobile</h5>
                  <p className="text-sm text-gray-600">MTN & Moov Money</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-accent/20">
                  <TrendingUp className="w-8 h-8 text-accent mb-2" />
                  <h5 className="font-semibold text-primary mb-1">Suivi en temps réel</h5>
                  <p className="text-sm text-gray-600">Soldes et historiques</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-primary/20">
                  <CreditCard className="w-8 h-8 text-primary mb-2" />
                  <h5 className="font-semibold text-primary mb-1">Retraits faciles</h5>
                  <p className="text-sm text-gray-600">Validation rapide</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-accent/20">
                  <MessageSquare className="w-8 h-8 text-accent mb-2" />
                  <h5 className="font-semibold text-primary mb-1">Notifications SMS</h5>
                  <p className="text-sm text-gray-600">Alertes automatiques</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-primary/20">
                <h4 className="text-xl font-semibold mb-4 text-center text-primary">Tableau de bord</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/20 rounded-lg border border-primary/20 backdrop-blur-sm">
                    <div>
                      <h5 className="font-semibold text-primary">Tontine FECECAM</h5>
                      <p className="text-sm text-gray-600">Mise: 5,000 FCFA/jour</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-accent">155,000 FCFA</p>
                      <p className="text-xs text-gray-500">Solde actuel</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                      Cotiser
                    </button>
                    <button className="p-3 bg-white/20 backdrop-blur-sm border-2 border-primary/20 text-primary rounded-lg font-semibold text-sm hover:border-primary transition-all">
                      Retirer
                    </button>
                  </div>

                  <div className="p-3 bg-white/20 rounded-lg border border-accent/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">Prochaine échéance:</span>
                      <span className="text-sm font-bold text-accent">Dans 2 jours</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 p-3 bg-white/20 rounded-lg border border-primary/20 backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-sm text-primary font-medium">Compte épargne disponible</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Flow */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 p-6 bg-gradient-to-r from-primary to-accent rounded-2xl text-white">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="font-semibold">Inscription</span>
              </div>
              <ArrowRight className="w-6 h-6" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse animation-delay-100"></div>
                <span className="font-semibold">Sélection</span>
              </div>
              <ArrowRight className="w-6 h-6" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse animation-delay-200"></div>
                <span className="font-semibold">Validation</span>
              </div>
              <ArrowRight className="w-6 h-6" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse animation-delay-300"></div>
                <span className="font-semibold">Utilisation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
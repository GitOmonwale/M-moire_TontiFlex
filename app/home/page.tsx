import Link from "next/link";
import Image from "next/image";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { mockFAQs } from "@/data/mockData";
import { 
  Smartphone, Shield, Users,CreditCard,TrendingUp, CheckCircle,Menu,X,ArrowRight,Star,Lock,Globe,MessageSquare,Phone,Mail,MapPin,Clock
} from 'lucide-react';
import { features } from "@/constants";
import HowItWorks from "./how-it-works/page";

const Home = () => {
  const images = [

    {
      src: "/images/img-1.jpeg",
      alt: "Femme avec téléphone",
      size: "w-32 h-56"
    },
    {
      src: "/images/img-2.jpeg",
      alt: "Homme avec téléphone",
      size: "w-36 h-40"
    },
      {
      src: "/images/img-3.jpeg",
      alt: "Homme avec téléphone",
      size: "w-28 h-44"
    },
        {
      src: "/images/img-4.jpeg",
      alt: "Homme avec téléphone",
      size: "w-44 h-28"
    },
    {
      src: "/images/img-5.jpeg",
      alt: "Femme avec téléphone",
      size: "w-48 h-32"
    }
  ];

  const valuePropositions = [
    {
      icon: Shield,
      title: "Tontines Digitales",
      description: "Vos fonds sont protégés selon les normes BCEAO/UEMOA"
    },
    {
      icon: Smartphone,
      title: "Accès Mobile",
      description: "Gérez vos tontines depuis votre smartphone, n'importe où"
    },
    {
      icon: CreditCard,
      title: "Paiements Mobile Money",
      description: "Contributions faciles via MTN et Moov Money"
    },
    {
      icon: Users,
      title: "Communauté Solidaire",
      description: "Rejoignez des groupes de femmes entrepreneures"
    }
  ];

  const howItWorksSteps = [
    {
      icon: Users,
      title: "Inscrivez-vous",
      description: "Créez votre compte en quelques clics"
    },
    {
      icon: CheckCircle,
      title: "Rejoignez une tontine",
      description: "Choisissez la tontine qui correspond à vos besoins"
    },
    {
      icon: CreditCard,
      title: "Effectuez vos contributions",
      description: "Payez facilement via Mobile Money"
    },
    {
      icon: Smartphone,
      title: "Suivez vos finances",
      description: "Consultez vos soldes et historiques à tout moment"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container m-auto px-4 py-16 grid grid-cols-2">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-primary font-archivo mb-6 animate-fade-in">
            Simplifiez vos tontines, épargnez en sécurité
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
La première plateforme digitale qui connecte tous les SFD du Bénin pour vos tontines, épargnes et prêts. Cotisez via Mobile Money 24h/24.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <GlassButton
                size="lg"
                className="text-lg px-8 py-4"
              >
                Commencer maintenant
                <ArrowRight className="ml-2" size={20} />
              </GlassButton>
            </Link>
            <Link href={"/tontines"}>
              <GlassButton
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4"
              >
                Découvrir les tontines
              </GlassButton>
            </Link>
          </div>
        </div>
    <div className="flex flex-wrap gap-4 max-w-2xl mx-auto p-4 justify-center items-center">
      {images.map((image, index) => (
        <div 
          key={index}
          className={`${image.size} rounded-2xl overflow-hidden shadow-lg transform rotate-${Math.floor(Math.random() * 12) - 6}`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={400}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
      </section>


      {/* Value Propositions */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
          Pourquoi choisir TontiFlex ?
        </h2>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, Home) => (
            <GlassCard key={Home} className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container px-4 py-16 bg-white/30 rounded-3xl mx-4">
        <HowItWorks />
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
          Questions Fréquentes
        </h2>
        <div className="max-w-3xl mx-auto">
          <GlassCard>
            <Accordion type="single" collapsible className="w-full">
              {mockFAQs.map((faq, Home) => (
                <AccordionItem key={Home} value={`item-${Home}`}>
                  <AccordionTrigger className="text-left text-primary font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <GlassCard className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Prête à transformer votre épargne ?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Rejoignez des milliers de femmes qui font déjà confiance à TontiFlex
          </p>
          <Link href={"/register"}>
            <GlassButton
              size="lg"
              className="text-lg px-12 py-4"
            >
              S'inscrire gratuitement
            </GlassButton>
          </Link>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="bg-primary/5 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="text-xl font-bold text-primary">TontiFlex</span>
              </div>
              <p className="text-gray-600">
                Digitalisation des tontines pour les femmes rurales du Bénin
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-4">Services</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/tontines" className="hover:text-primary">Tontines</a></li>
                <li><a href="/savings" className="hover:text-primary">Épargne</a></li>
                <li><a href="/loan" className="hover:text-primary">Crédit</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/support" className="hover:text-primary">Centre d'aide</a></li>
                <li>+229 XX XX XX XX</li>
                <li>support@tontiflex.bj</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-4">Partenaires Mobile Money</h4>
              <div className="flex space-x-4">
                <div className="bg-yellow-400 text-black px-3 py-1 rounded text-sm font-bold">MTN</div>
                <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">Moov</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-300 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2025 TontiFlex. Tous droits réservés. Conforme aux normes BCEAO/UEMOA.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

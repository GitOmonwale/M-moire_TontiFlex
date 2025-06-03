'use client';
import React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight } from "lucide-react";
import router from "next/router";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Connexion réussie ! Bienvenue !");
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-gradient-to-br from-secondary via-white to-accent items-center grid grid-cols-2">
    
        <Image
          width={1200}
          height={1000}
          src="/images/img-6.jpeg"
          alt="Login illustration"
          className="w-full h-full object-cover"
        />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <GlassCard>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Connexion</h1>
              <p className="text-gray-600">Ravi de vous revoir. ✨</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-primary font-medium">
                  <Mail className="inline mr-2" size={16} />
                  Email ou Téléphone
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com ou +229 XX XX XX XX"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="bg-white/50 border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-primary font-medium">
                  <Lock className="inline mr-2" size={16} />
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  className="bg-white/50 border-primary/20"
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  className="text-primary hover:underline text-sm"
                  onClick={() => toast.info("Fonctionnalité bientôt disponible")}
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <GlassButton
                type="submit"
                size="lg"
                className="w-full flex items-center justify-center"
              >
                Se connecter
                <ArrowRight className="ml-2" size={16} />
              </GlassButton>

              <div className="text-center">
                <p className="text-gray-600">
                  Pas encore de compte ?{" "}
                  <Link href={"/auth/login/register"}>
                    <button
                    type="button"
                    className="text-primary hover:underline font-medium"
                  >
                    S'inscrire gratuitement
                  </button>
                  </Link>
                </p>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Login;

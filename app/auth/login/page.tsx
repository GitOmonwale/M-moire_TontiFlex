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
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    /* try {
       await login({
         email: formData.email,
         password: formData.password,
         rememberMe: formData.rememberMe,
       });
       const redirectPath = getAndClearRedirect();
 
       toast.success("Connexion réussie !");
       setRedirecting(true);
       router.push(redirectPath || "/dashbord/dashbord-user");
     } catch (err) {
       toast.error('Échec de la connexion');
       setError('Email ou mot de passe incorrect');
     } finally {
       setLoading(false);
     }*/
       toast.success("Connexion réussie !");
      setTimeout(() => router.push("/dashboard"), 1500);
  };

  return (
    <div className="h-full items-center grid grid-cols-2">
      <Image
        width={1200}
        height={1000}
        src="/images/img-6.jpeg"
        alt="Login illustration"
        className="w-full h-full object-cover"
      />
      <div className="container m-auto px-4 py-16">
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
                  name="email"
                  placeholder="votre@email.com ou +229 XX XX XX XX"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-white/50 border-primary/20"
                />
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
                    <Link href={"/auth/register"}>
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

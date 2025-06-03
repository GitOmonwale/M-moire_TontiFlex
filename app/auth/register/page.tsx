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
import { User, Phone, Mail, MapPin, Briefcase, Lock } from "lucide-react";
import { useRouter } from "next/navigation";


const Register = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        profession: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.acceptTerms) {
            toast.error("Veuillez accepter les conditions d'utilisation");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }
        toast.success("Inscription réussie ! Bienvenue sur TontiFlex");
        setTimeout(() => router.push("/dashboard"), 1500);
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-accent grid grid-cols-2">
            <Image
                width={1200}
                height={1000}
                src="/images/img-6.jpeg"
                alt="Login illustration"
                className="w-full h-full object-cover"
            />
            <div className="container mx-auto px-8 py-16">
                <div className="max-w-2xl mx-auto">
                    <GlassCard>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-primary mb-2">Créer un compte</h1>
                            <p className="text-gray-600">Rejoignez la communauté TontiFlex</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-primary font-medium">
                                        <User className="inline mr-2" size={16} />
                                        Prénom
                                    </Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="Votre prénom"
                                        value={formData.firstName}
                                        onChange={(e) => handleChange("firstName", e.target.value)}
                                        required
                                        className="bg-white/50 border-primary/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-primary font-medium">
                                        <User className="inline mr-2" size={16} />
                                        Nom de famille
                                    </Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="Votre nom"
                                        value={formData.lastName}
                                        onChange={(e) => handleChange("lastName", e.target.value)}
                                        required
                                        className="bg-white/50 border-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-primary font-medium">
                                    <Phone className="inline mr-2" size={16} />
                                    Téléphone
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+229 XX XX XX XX"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    required
                                    className="bg-white/50 border-primary/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-primary font-medium">
                                    <Mail className="inline mr-2" size={16} />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    required
                                    className="bg-white/50 border-primary/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-primary font-medium">
                                    <MapPin className="inline mr-2" size={16} />
                                    Adresse
                                </Label>
                                <Input
                                    id="address"
                                    type="text"
                                    placeholder="Votre adresse complète"
                                    value={formData.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                    required
                                    className="bg-white/50 border-primary/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="profession" className="text-primary font-medium">
                                    <Briefcase className="inline mr-2" size={16} />
                                    Profession
                                </Label>
                                <Input
                                    id="profession"
                                    type="text"
                                    placeholder="Votre profession"
                                    value={formData.profession}
                                    onChange={(e) => handleChange("profession", e.target.value)}
                                    required
                                    className="bg-white/50 border-primary/20"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-primary font-medium">
                                        <Lock className="inline mr-2" size={16} />
                                        Confirmer
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirmer mot de passe"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                        required
                                        className="bg-white/50 border-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={(e) => handleChange("acceptTerms", e.target.checked.toString())}
                                        className="w-4 h-4 rounded border-primary/20 text-primary focus:ring-primary"
                                    />
                                    <label
                                        htmlFor="acceptTerms"
                                        className="text-sm text-gray-700 cursor-pointer"
                                    >
                                        J'accepte les conditions d'utilisation et la politique de confidentialité conforme aux normes BCEAO/UEMOA.
                                    </label>
                                </div>
                                {!formData.acceptTerms && (
                                    <p className="text-xs text-red-500">
                                        Vous devez accepter les conditions d'utilisation pour continuer
                                    </p>
                                )}
                            </div>

                            <GlassButton
                                type="submit"
                                size="lg"
                                className="w-full"
                            >
                                Créer mon compte
                            </GlassButton>

                            <div className="text-center">
                                <p className="text-gray-600">
                                    Déjà inscrite ?{" "}
                                    <Link href={"/auth/login"}>
                                        <button
                                            type="button"
                                            className="text-primary hover:underline font-medium"
                                        >
                                            Se connecter
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

export default Register;
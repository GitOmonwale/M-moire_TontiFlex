import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, User, Lock, Smartphone } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">TontiFlex</h1>
          <p className="text-muted-foreground mt-2">Espace d'administration</p>
        </div>
        
        <Tabs defaultValue="sfd" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sfd">Administrateur SFD</TabsTrigger>
            <TabsTrigger value="platform">Admin Plateforme</TabsTrigger>
          </TabsList>
          
          {/* Formulaire Administrateur SFD */}
          <TabsContent value="sfd">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Building2 className="h-6 w-6" />
                  Espace SFD
                </CardTitle>
                <CardDescription>
                  Connectez-vous à votre espace d'administration SFD
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sfd-email">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="sfd-email"
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="sfd-password">Mot de passe</Label>
                    <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="sfd-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Se connecter
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Formulaire Admin Plateforme */}
          <TabsContent value="platform">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Building2 className="h-6 w-6" />
                  Admin Plateforme
                </CardTitle>
                <CardDescription>
                  Accès à l'administration de la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@tonriflex.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="admin-password">Mot de passe</Label>
                    <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="2fa">Code de vérification (2FA)</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="2fa"
                      type="text"
                      placeholder="Code à 6 chiffres"
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Se connecter
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Vous êtes membre ?{' '}
            <Link href="/auth/login" className="text-primary underline underline-offset-4 hover:text-primary/80">
              Connectez-vous ici
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

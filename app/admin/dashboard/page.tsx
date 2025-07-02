import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboardPage() {
  // Données factices pour les graphiques
  const stats = {
    totalUsers: 1242,
    activeUsers: 892,
    totalSFDs: 15,
    totalTransactions: 4567,
  };

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Tableau de bord administratif</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">Exporter les données</Button>
            <Button>Générer un rapport</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Aperçu</TabsListener>
            <TabsTrigger value="analytics">Analytiques</TabsListener>
            <TabsTrigger value="users">Utilisateurs</TabsListener>
            <TabsTrigger value="sfds">SFDs</TabsListener>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilisateurs totaux</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+20% par rapport au mois dernier</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">SFDs enregistrés</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSFDs}</div>
                  <p className="text-xs text-muted-foreground">+2 ce mois-ci</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+30% par rapport au mois dernier</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Aperçu des transactions</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                    <LineChart className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Graphique des transactions</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Répartition des utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                    <PieChart className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Graphique des utilisateurs</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Activité des utilisateurs</CardTitle>
                  <CardDescription>Activité des 30 derniers jours</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                  <BarChart className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Graphique d'activité</span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques des SFDs</CardTitle>
                  <CardDescription>Performances par SFD</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                  <BarChart className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Graphique des SFDs</span>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>Liste des utilisateurs enregistrés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted/50 rounded-md">
                  <Users className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Tableau des utilisateurs</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sfds" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestion des SFDs</CardTitle>
                    <CardDescription>Liste des Sociétés de Financement Décentralisé</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/admin/sfds/new">
                      Ajouter un SFD
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted/50 rounded-md">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Tableau des SFDs</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

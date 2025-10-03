import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  School,
  BookOpen,
  CreditCard,
  UserCheck,
  Bell,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { toast } from 'sonner';

const AdminDashboard = ({ user }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState('mois');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/admin/dashboard?periode=${periode}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setDashboardData(response.data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      toast.error('Erreur lors du chargement du dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [periode]);

  // Auto-refresh toutes les 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [periode]);

  const getPriorityColor = (priorite) => {
    switch(priorite) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertTypeColor = (type) => {
    switch(type) {
      case 'critique': return 'destructive';
      case 'attention': return 'default';
      case 'info': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  const { kpi, alertes_critiques, actions_requises, activite_recente, evenements_calendrier, statistiques_classes, tendances } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble • Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={periode} onValueChange={setPeriode}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jour">Aujourd'hui</SelectItem>
              <SelectItem value="semaine">Cette semaine</SelectItem>
              <SelectItem value="mois">Ce mois</SelectItem>
              <SelectItem value="trimestre">Ce trimestre</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={fetchDashboardData}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Activity className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Effectif Total</p>
                <p className="text-3xl font-bold">{kpi.effectif_total.toLocaleString()}</p>
                <p className="text-blue-100 text-xs mt-1">
                  {tendances.evolution_effectifs.variation} vs mois dernier
                </p>
              </div>
              <Users className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Taux Présence</p>
                <p className="text-3xl font-bold">{kpi.taux_presence}%</p>
                <p className="text-green-100 text-xs mt-1">Présence globale</p>
              </div>
              <UserCheck className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Paiements Mois</p>
                <p className="text-3xl font-bold">{kpi.paiements_mois}%</p>
                <p className="text-purple-100 text-xs mt-1">
                  {kpi.paiements_montant}M GNF collectés
                </p>
              </div>
              <CreditCard className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Alertes Actives</p>
                <p className="text-3xl font-bold">{kpi.alertes_actives}</p>
                <p className="text-orange-100 text-xs mt-1">Nécessitent attention</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Alertes Critiques */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Alertes Critiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertes_critiques.map((alerte) => (
                <div key={alerte.id} className="border-l-4 border-red-500 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900">{alerte.titre}</h4>
                      <p className="text-xs text-gray-600 mt-1">{alerte.description}</p>
                    </div>
                    <Badge variant={getAlertTypeColor(alerte.type)} className="ml-2">
                      {alerte.type}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {alertes_critiques.length === 0 && (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-600">Aucune alerte critique</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions Requises */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-600">
              <Clock className="w-5 h-5 mr-2" />
              Actions Requises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actions_requises.map((action) => (
                <div key={action.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900">{action.titre}</h4>
                      <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                      {action.echeance && (
                        <p className="text-xs text-orange-600 mt-1">
                          Échéance: {new Date(action.echeance).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Badge variant="default" className="ml-2">
                      {action.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activité Récente */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <Activity className="w-5 h-5 mr-2" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activite_recente.map((activite) => (
                <div key={activite.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activite.type === 'connexion' ? 'bg-green-500' :
                    activite.type === 'modification' ? 'bg-blue-500' :
                    activite.type === 'creation' ? 'bg-purple-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activite.utilisateur_nom}</p>
                    <p className="text-xs text-gray-600">{activite.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activite.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques et Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Classes par Présence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Top Classes - Présence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tendances.top_classes_presence.map((classe, index) => (
                <div key={classe.classe} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{classe.classe}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full" 
                        style={{ width: `${classe.taux}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">{classe.taux}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Classes nécessitant attention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Classes - Points d'Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tendances.classes_attention.map((classe) => (
                <div key={classe.classe} className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-orange-900">{classe.classe}</h4>
                      <p className="text-sm text-orange-700 mt-1">{classe.raison}</p>
                    </div>
                    <Badge variant="destructive" className="bg-orange-100 text-orange-800">
                      {classe.taux_absence}% d'absences
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendrier et Événements */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Calendrier Administratif
          </CardTitle>
          <CardDescription>
            Prochains événements et échéances importantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evenements_calendrier.map((event) => (
              <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{event.titre}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {event.type.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(event.date_debut).toLocaleDateString()}
                  {event.date_fin && (
                    <span> - {new Date(event.date_fin).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques par Classe - Tableau */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <School className="w-5 h-5 mr-2" />
            Statistiques par Classe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-semibold">Classe</th>
                  <th className="text-center p-3 font-semibold">Effectif</th>
                  <th className="text-center p-3 font-semibold">Moyenne</th>
                  <th className="text-center p-3 font-semibold">Présence</th>
                  <th className="text-left p-3 font-semibold">Enseignant Principal</th>
                  <th className="text-center p-3 font-semibold">Évaluations</th>
                </tr>
              </thead>
              <tbody>
                {statistiques_classes.map((stat) => (
                  <tr key={stat.classe} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{stat.classe}</td>
                    <td className="text-center p-3">{stat.effectif}</td>
                    <td className="text-center p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        stat.moyenne_generale >= 16 ? 'bg-green-100 text-green-800' :
                        stat.moyenne_generale >= 14 ? 'bg-blue-100 text-blue-800' :
                        stat.moyenne_generale >= 12 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {stat.moyenne_generale}/20
                      </span>
                    </td>
                    <td className="text-center p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        stat.taux_presence >= 95 ? 'bg-green-100 text-green-800' :
                        stat.taux_presence >= 90 ? 'bg-blue-100 text-blue-800' :
                        stat.taux_presence >= 85 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {stat.taux_presence}%
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{stat.enseignant_principal}</td>
                    <td className="text-center p-3">{stat.nombre_evaluations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
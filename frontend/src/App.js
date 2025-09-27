import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Users, FileText, CreditCard, Calendar, UserPlus, Plus, Eye, Check, X, School, BookOpen, DollarSign, ClipboardCheck } from 'lucide-react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL + '/api';

// Configuration axios
axios.defaults.baseURL = API_BASE_URL;

// Composant d'authentification
const AuthComponent = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    mot_de_passe: '',
    confirmer_mot_de_passe: '',
    nom: '',
    prenoms: '',
    role: 'parent',
    telephone: '',
    code_admin: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(endpoint, formData);
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        onAuthSuccess(response.data.user);
        toast.success(isLogin ? 'Connexion réussie!' : 'Inscription réussie!');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur d\'authentification');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <School className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-blue-800">École Smart</h1>
          </div>
          <CardTitle>{isLogin ? 'Connexion' : 'Inscription'}</CardTitle>
          <CardDescription>
            Plateforme de gestion scolaire pour la Guinée
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                data-testid="email-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mot_de_passe">Mot de passe</Label>
              <Input
                id="mot_de_passe"
                name="mot_de_passe"
                type="password"
                value={formData.mot_de_passe}
                onChange={handleInputChange}
                required
                data-testid="password-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmer_mot_de_passe">Confirmer le mot de passe</Label>
              <Input
                id="confirmer_mot_de_passe"
                name="confirmer_mot_de_passe"
                type="password"
                value={formData.confirmer_mot_de_passe}
                onChange={handleInputChange}
                required
                data-testid="confirm-password-input"
              />
            </div>

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenoms">Prénoms</Label>
                    <Input
                      id="prenoms"
                      name="prenoms"
                      value={formData.prenoms}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="enseignant">Enseignant</SelectItem>
                      <SelectItem value="administrateur">Administrateur (Code requis)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.role === 'administrateur' && (
                  <div className="space-y-2">
                    <Label htmlFor="code_admin">Code Administrateur</Label>
                    <Input
                      id="code_admin"
                      name="code_admin"
                      value={formData.code_admin}
                      onChange={handleInputChange}
                      placeholder="Code spécial administrateur"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Contactez votre administrateur système pour obtenir ce code
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone (optionnel)</Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    placeholder="+224 6XX XXX XXX"
                  />
                </div>
              </>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={loading}
              data-testid="auth-submit-btn"
            >
              {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'S\'inscrire')}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:underline"
              >
                {isLogin ? 'Créer un compte' : 'Déjà un compte ? Se connecter'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Composant Sidebar
const Sidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BookOpen },
    { id: 'eleves', label: 'Élèves', icon: Users },
    { id: 'factures', label: 'Factures', icon: FileText },
    { id: 'paiements', label: 'Paiements', icon: CreditCard },
    { id: 'presences', label: 'Présences', icon: ClipboardCheck }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <School className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-xl font-bold text-blue-800">École Smart</h1>
        </div>
        <p className="text-sm text-gray-600 mt-2">{user.nom} {user.prenoms}</p>
        <Badge variant="secondary" className="mt-1">{user.role}</Badge>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onLogout}
          data-testid="logout-btn"
        >
          Déconnexion
        </Button>
      </div>
    </div>
  );
};

// Composant Dashboard
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement des statistiques...</div>;
  }

  return (
    <div className="space-y-6" data-testid="dashboard-content">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Tableau de bord</h2>
        <p className="text-gray-600 mt-2">Vue d'ensemble de votre école</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Élèves</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.eleves?.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Factures Émises</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.finances?.total_factures || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Factures Impayées</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.finances?.factures_impayees || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Créances (GNF)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats?.finances?.total_creances || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par classe */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des élèves par classe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {stats?.eleves?.repartition_classes?.map((item, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-blue-600">{item._id}</p>
                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                <p className="text-sm text-gray-600">élèves</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Composant Gestion des Élèves
const ElevesComponent = ({ user }) => {
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenoms: '',
    date_naissance: '',
    sexe: '',
    classe: '',
    telephone_parent: '',
    adresse: ''
  });

  const classes = ['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2', '6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Tle'];

  useEffect(() => {
    fetchEleves();
  }, []);

  const fetchEleves = async () => {
    try {
      const response = await axios.get('/eleves');
      setEleves(response.data.eleves);
    } catch (error) {
      toast.error('Erreur lors du chargement des élèves');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEleve = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/eleves', formData);
      toast.success('Élève créé avec succès');
      setShowCreateDialog(false);
      setFormData({
        nom: '',
        prenoms: '',
        date_naissance: '',
        sexe: '',
        classe: '',
        telephone_parent: '',
        adresse: ''
      });
      fetchEleves();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la création');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement des élèves...</div>;
  }

  return (
    <div className="space-y-6" data-testid="eleves-section">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Élèves</h2>
          <p className="text-gray-600 mt-2">Gérer les inscriptions et informations des élèves</p>
        </div>
        
        {(user.role === 'administrateur' || user.role === 'enseignant') && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700" data-testid="add-student-btn">
                <UserPlus className="h-4 w-4 mr-2" />
                Nouvel Élève
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Créer un nouvel élève</DialogTitle>
                <DialogDescription>
                  Remplissez les informations de l'élève
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateEleve} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenoms">Prénoms</Label>
                    <Input
                      id="prenoms"
                      value={formData.prenoms}
                      onChange={(e) => setFormData({...formData, prenoms: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_naissance">Date de naissance</Label>
                  <Input
                    id="date_naissance"
                    type="date"
                    value={formData.date_naissance}
                    onChange={(e) => setFormData({...formData, date_naissance: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sexe</Label>
                    <Select value={formData.sexe} onValueChange={(value) => setFormData({...formData, sexe: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculin">Masculin</SelectItem>
                        <SelectItem value="feminin">Féminin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Classe</Label>
                    <Select value={formData.classe} onValueChange={(value) => setFormData({...formData, classe: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map(classe => (
                          <SelectItem key={classe} value={classe}>{classe}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone_parent">Téléphone Parent</Label>
                  <Input
                    id="telephone_parent"
                    value={formData.telephone_parent}
                    onChange={(e) => setFormData({...formData, telephone_parent: e.target.value})}
                    placeholder="+224 6XX XXX XXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Créer
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Liste des élèves */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des élèves ({eleves.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Nom & Prénoms</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Sexe</TableHead>
                  <TableHead>Téléphone Parent</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eleves.map((eleve) => (
                  <TableRow key={eleve._id}>
                    <TableCell className="font-mono text-sm">{eleve.matricule}</TableCell>
                    <TableCell className="font-medium">
                      {eleve.nom} {eleve.prenoms}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{eleve.classe}</Badge>
                    </TableCell>
                    <TableCell className="capitalize">{eleve.sexe}</TableCell>
                    <TableCell>{eleve.telephone_parent || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={eleve.statut_inscription ? "default" : "secondary"}>
                        {eleve.statut_inscription ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {eleves.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun élève enregistré
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Composant Gestion des Factures
const FacturesComponent = ({ user }) => {
  const [factures, setFactures] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    eleve_id: '',
    titre: '',
    description: '',
    montant_total: '',
    date_echeance: '',
    type_frais: ['scolarite']
  });

  useEffect(() => {
    fetchFactures();
    fetchEleves();
  }, []);

  const fetchFactures = async () => {
    try {
      const response = await axios.get('/factures');
      setFactures(response.data.factures);
    } catch (error) {
      toast.error('Erreur lors du chargement des factures');
    } finally {
      setLoading(false);
    }
  };

  const fetchEleves = async () => {
    try {
      const response = await axios.get('/eleves');
      setEleves(response.data.eleves);
    } catch (error) {
      console.error('Erreur chargement élèves:', error);
    }
  };

  const handleCreateFacture = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/factures', {
        ...formData,
        montant_total: parseFloat(formData.montant_total)
      });
      toast.success('Facture créée avec succès');
      setShowCreateDialog(false);
      setFormData({
        eleve_id: '',
        titre: '',
        description: '',
        montant_total: '',
        date_echeance: '',
        type_frais: ['scolarite']
      });
      fetchFactures();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la création');
    }
  };

  const getStatusBadge = (statut) => {
    const styles = {
      'emise': 'bg-yellow-100 text-yellow-800',
      'payee_partiellement': 'bg-orange-100 text-orange-800',
      'payee_totalement': 'bg-green-100 text-green-800',
      'annulee': 'bg-red-100 text-red-800'
    };
    
    const labels = {
      'emise': 'Émise',
      'payee_partiellement': 'Partiellement payée',
      'payee_totalement': 'Payée',
      'annulee': 'Annulée'
    };

    return (
      <Badge className={styles[statut] || 'bg-gray-100 text-gray-800'}>
        {labels[statut] || statut}
      </Badge>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement des factures...</div>;
  }

  return (
    <div className="space-y-6" data-testid="factures-section">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Factures</h2>
          <p className="text-gray-600 mt-2">Créer et gérer les factures des élèves</p>
        </div>
        
        {(user.role === 'administrateur' || user.role === 'enseignant') && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700" data-testid="create-invoice-btn">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Facture
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle facture</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateFacture} className="space-y-4">
                <div className="space-y-2">
                  <Label>Élève</Label>
                  <Select value={formData.eleve_id} onValueChange={(value) => setFormData({...formData, eleve_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un élève" />
                    </SelectTrigger>
                    <SelectContent>
                      {eleves.map(eleve => (
                        <SelectItem key={eleve._id} value={eleve._id}>
                          {eleve.nom} {eleve.prenoms} - {eleve.classe}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="titre">Titre de la facture</Label>
                  <Input
                    id="titre"
                    value={formData.titre}
                    onChange={(e) => setFormData({...formData, titre: e.target.value})}
                    placeholder="Ex: Frais de scolarité Octobre 2024"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="montant_total">Montant (GNF)</Label>
                  <Input
                    id="montant_total"
                    type="number"
                    value={formData.montant_total}
                    onChange={(e) => setFormData({...formData, montant_total: e.target.value})}
                    placeholder="50000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_echeance">Date d'échéance</Label>
                  <Input
                    id="date_echeance"
                    type="date"
                    value={formData.date_echeance}
                    onChange={(e) => setFormData({...formData, date_echeance: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optionnelle)</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Détails supplémentaires..."
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Créer
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Liste des factures */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des factures ({factures.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Facture</TableHead>
                  <TableHead>Élève</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Montant Total</TableHead>
                  <TableHead>Montant Payé</TableHead>
                  <TableHead>Reste à Payer</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {factures.map((facture) => (
                  <TableRow key={facture._id}>
                    <TableCell className="font-mono text-sm">{facture.numero_facture}</TableCell>
                    <TableCell>
                      {facture.eleve ? (
                        <div>
                          <div className="font-medium">{facture.eleve.nom} {facture.eleve.prenoms}</div>
                          <div className="text-sm text-gray-500">{facture.eleve.classe}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Élève non trouvé</span>
                      )}
                    </TableCell>
                    <TableCell>{facture.titre}</TableCell>
                    <TableCell className="font-medium">
                      {facture.montant_total.toLocaleString()} GNF
                    </TableCell>
                    <TableCell className="text-green-600">
                      {facture.montant_paye.toLocaleString()} GNF
                    </TableCell>
                    <TableCell className="text-red-600">
                      {facture.montant_restant.toLocaleString()} GNF
                    </TableCell>
                    <TableCell>
                      {new Date(facture.date_echeance).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(facture.statut)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {factures.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune facture créée
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Composant Gestion des Paiements
const PaiementsComponent = ({ user }) => {
  const [paiements, setPaiements] = useState([]);
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [formData, setFormData] = useState({
    facture_id: '',
    montant: '',
    numero_payeur: '',
    nom_payeur: ''
  });

  useEffect(() => {
    fetchPaiements();
    fetchFacturesImpayees();
  }, []);

  const fetchPaiements = async () => {
    try {
      const response = await axios.get('/paiements');
      setPaiements(response.data.paiements);
    } catch (error) {
      toast.error('Erreur lors du chargement des paiements');
    } finally {
      setLoading(false);
    }
  };

  const fetchFacturesImpayees = async () => {
    try {
      const response = await axios.get('/factures?impayees_seulement=true');
      setFactures(response.data.factures);
    } catch (error) {
      console.error('Erreur chargement factures:', error);
    }
  };

  const handleInitiatePaiement = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/paiements/initier', {
        ...formData,
        montant: parseFloat(formData.montant)
      });
      
      if (response.data.success) {
        toast.success(`Paiement ${response.data.operateur} initié avec succès!`);
        setShowPayDialog(false);
        setFormData({
          facture_id: '',
          montant: '',
          numero_payeur: '',
          nom_payeur: ''
        });
        fetchPaiements();
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'initiation du paiement');
    }
  };

  const simulatePaymentSuccess = async (paiementId) => {
    if (user.role !== 'administrateur') {
      toast.error('Action réservée aux administrateurs');
      return;
    }

    try {
      const response = await axios.put(`/paiements/${paiementId}/simuler-succes`);
      if (response.data.success) {
        toast.success('Paiement simulé avec succès!');
        fetchPaiements();
      }
    } catch (error) {
      toast.error('Erreur lors de la simulation');
    }
  };

  const getStatusBadge = (statut) => {
    const styles = {
      'initie': 'bg-blue-100 text-blue-800',
      'en_cours': 'bg-yellow-100 text-yellow-800', 
      'reussi': 'bg-green-100 text-green-800',
      'echec': 'bg-red-100 text-red-800',
      'annule': 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      'initie': 'Initié',
      'en_cours': 'En cours',
      'reussi': 'Réussi',
      'echec': 'Échec',
      'annule': 'Annulé'
    };

    return (
      <Badge className={styles[statut] || 'bg-gray-100 text-gray-800'}>
        {labels[statut] || statut}
      </Badge>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement des paiements...</div>;
  }

  return (
    <div className="space-y-6" data-testid="paiements-section">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Paiements</h2>
          <p className="text-gray-600 mt-2">Paiements mobiles Orange Money et MTN Money</p>
        </div>
        
        <Dialog open={showPayDialog} onOpenChange={setShowPayDialog}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700" data-testid="initiate-payment-btn">
              <CreditCard className="h-4 w-4 mr-2" />
              Initier Paiement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Initier un paiement mobile</DialogTitle>
              <DialogDescription>
                Orange Money ou MTN Money selon le numéro
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInitiatePaiement} className="space-y-4">
              <div className="space-y-2">
                <Label>Facture à payer</Label>
                <Select value={formData.facture_id} onValueChange={(value) => {
                  const selectedFacture = factures.find(f => f._id === value);
                  setFormData({
                    ...formData, 
                    facture_id: value,
                    montant: selectedFacture ? selectedFacture.montant_restant.toString() : ''
                  });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une facture" />
                  </SelectTrigger>
                  <SelectContent>
                    {factures.map(facture => (
                      <SelectItem key={facture._id} value={facture._id}>
                        {facture.numero_facture} - {facture.eleve?.nom} {facture.eleve?.prenoms} 
                        ({facture.montant_restant.toLocaleString()} GNF)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="montant">Montant (GNF)</Label>
                <Input
                  id="montant"
                  type="number"
                  value={formData.montant}
                  onChange={(e) => setFormData({...formData, montant: e.target.value})}
                  placeholder="10000"
                  min="100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero_payeur">Numéro payeur</Label>
                <Input
                  id="numero_payeur"
                  value={formData.numero_payeur}
                  onChange={(e) => setFormData({...formData, numero_payeur: e.target.value})}
                  placeholder="+224 6XX XXX XXX"
                  required
                />
                <p className="text-xs text-gray-500">
                  Orange: 60X-65X | MTN: 66X-67X
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom_payeur">Nom du payeur (optionnel)</Label>
                <Input
                  id="nom_payeur"
                  value={formData.nom_payeur}
                  onChange={(e) => setFormData({...formData, nom_payeur: e.target.value})}
                  placeholder="Nom complet"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowPayDialog(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  Initier Paiement
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des paiements */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements ({paiements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Élève</TableHead>
                  <TableHead>Facture</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Opérateur</TableHead>
                  <TableHead>Numéro Payeur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paiements.map((paiement) => (
                  <TableRow key={paiement._id}>
                    <TableCell className="font-mono text-sm">{paiement.reference_interne}</TableCell>
                    <TableCell>
                      {paiement.eleve ? (
                        <div>
                          <div className="font-medium">{paiement.eleve.nom} {paiement.eleve.prenoms}</div>
                          <div className="text-sm text-gray-500">{paiement.eleve.classe}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Élève non trouvé</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {paiement.facture?.numero_facture || 'N/A'}
                    </TableCell>
                    <TableCell className="font-medium">
                      {paiement.montant.toLocaleString()} GNF
                    </TableCell>
                    <TableCell>
                      <Badge variant={paiement.operateur === 'ORANGE' ? 'default' : 'secondary'}>
                        {paiement.operateur}
                      </Badge>
                    </TableCell>
                    <TableCell>{paiement.numero_payeur}</TableCell>
                    <TableCell>
                      {getStatusBadge(paiement.statut)}
                    </TableCell>
                    <TableCell>
                      {new Date(paiement.date_initiation).toLocaleString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {user.role === 'administrateur' && paiement.statut === 'initie' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => simulatePaymentSuccess(paiement._id)}
                          data-testid="simulate-success-btn"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Simuler Succès
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {paiements.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun paiement enregistré
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Composant Gestion des Présences
const PresencesComponent = ({ user }) => {
  const [presences, setPresences] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    eleve_id: '',
    date_cours: new Date().toISOString().split('T')[0],
    matiere: '',
    present: true,
    motif_absence: ''
  });

  const matieres = [
    'Français', 'Mathématiques', 'Sciences', 'Histoire-Géographie', 
    'Anglais', 'EPS', 'Arts Plastiques', 'Musique', 'Informatique', 'Autre'
  ];

  useEffect(() => {
    fetchPresences();
    fetchEleves();
  }, []);

  const fetchPresences = async () => {
    try {
      const response = await axios.get('/presences');
      setPresences(response.data.presences);
    } catch (error) {
      toast.error('Erreur lors du chargement des présences');
    } finally {
      setLoading(false);
    }
  };

  const fetchEleves = async () => {
    try {
      const response = await axios.get('/eleves');
      setEleves(response.data.eleves);
    } catch (error) {
      console.error('Erreur chargement élèves:', error);
    }
  };

  const handleCreatePresence = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/presences', formData);
      toast.success('Présence enregistrée avec succès');
      setShowCreateDialog(false);
      setFormData({
        eleve_id: '',
        date_cours: new Date().toISOString().split('T')[0],
        matiere: '',
        present: true,
        motif_absence: ''
      });
      fetchPresences();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'enregistrement');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement des présences...</div>;
  }

  return (
    <div className="space-y-6" data-testid="presences-section">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Présences</h2>
          <p className="text-gray-600 mt-2">Enregistrer les présences et absences des élèves</p>
        </div>
        
        {(user.role === 'administrateur' || user.role === 'enseignant') && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700" data-testid="add-presence-btn">
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Nouvelle Présence
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Enregistrer une présence</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreatePresence} className="space-y-4">
                <div className="space-y-2">
                  <Label>Élève</Label>
                  <Select value={formData.eleve_id} onValueChange={(value) => setFormData({...formData, eleve_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un élève" />
                    </SelectTrigger>
                    <SelectContent>
                      {eleves.map(eleve => (
                        <SelectItem key={eleve._id} value={eleve._id}>
                          {eleve.nom} {eleve.prenoms} - {eleve.classe}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_cours">Date du cours</Label>
                  <Input
                    id="date_cours"
                    type="date"
                    value={formData.date_cours}
                    onChange={(e) => setFormData({...formData, date_cours: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Matière</Label>
                  <Select value={formData.matiere} onValueChange={(value) => setFormData({...formData, matiere: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une matière" />
                    </SelectTrigger>
                    <SelectContent>
                      {matieres.map(matiere => (
                        <SelectItem key={matiere} value={matiere}>{matiere}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select 
                    value={formData.present ? 'present' : 'absent'} 
                    onValueChange={(value) => setFormData({...formData, present: value === 'present'})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Présent</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {!formData.present && (
                  <div className="space-y-2">
                    <Label htmlFor="motif_absence">Motif d'absence</Label>
                    <Input
                      id="motif_absence"
                      value={formData.motif_absence}
                      onChange={(e) => setFormData({...formData, motif_absence: e.target.value})}
                      placeholder="Raison de l'absence..."
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    Enregistrer
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Liste des présences */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des présences ({presences.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Élève</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Matière</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Motif</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {presences.map((presence) => (
                  <TableRow key={presence._id}>
                    <TableCell>
                      {new Date(presence.date_cours).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {presence.eleve ? (
                        <div className="font-medium">{presence.eleve.nom} {presence.eleve.prenoms}</div>
                      ) : (
                        <span className="text-gray-400">Élève non trouvé</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{presence.eleve?.classe}</Badge>
                    </TableCell>
                    <TableCell>{presence.matiere}</TableCell>
                    <TableCell>
                      <Badge variant={presence.present ? "default" : "destructive"}>
                        {presence.present ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Présent
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3 mr-1" />
                            Absent
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {presence.motif_absence || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {presences.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune présence enregistrée
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Composant principal de l'application
const App = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérification du token au démarrage
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
      } catch (error) {
        console.error('Erreur parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setActiveTab('dashboard');
    toast.success('Déconnexion réussie');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <School className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de École Smart...</p>
        </div>
      </div>
    );
  }

  // Interface d'authentification
  if (!user) {
    return <AuthComponent onAuthSuccess={handleAuthSuccess} />;
  }

  // Interface principale
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <div className="flex-1 overflow-hidden">
        <main className="p-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'eleves' && <ElevesComponent user={user} />}
          {activeTab === 'factures' && <FacturesComponent user={user} />}
          {activeTab === 'paiements' && <PaiementsComponent user={user} />}
          {activeTab === 'presences' && <PresencesComponent user={user} />}
        </main>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
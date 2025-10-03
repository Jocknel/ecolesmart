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
import { AlertCircle, Users, FileText, CreditCard, Calendar, UserPlus, Plus, Eye, EyeOff, Check, X, School, BookOpen, DollarSign, ClipboardCheck, Key, Shield, Upload, Download, Link } from 'lucide-react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL + '/api';

// Configuration axios
axios.defaults.baseURL = API_BASE_URL;

// Composant Page d'accueil publique complète et moderne
const PublicLandingPage = ({ onNavigateToLogin, onNavigateToPreRegistration }) => {
  const [activeSection, setActiveSection] = useState('accueil');

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('accueil')}>
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mr-3 shadow-lg">
                <span className="text-white font-bold text-lg">LSE</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-blue-800">Lycée Sainte-Étoile</span>
                <p className="text-xs text-gray-600">Excellence • Innovation • Réussite</p>
              </div>
            </div>
            
            {/* Navigation Menu */}
            <nav className="hidden md:flex space-x-8">
              {[
                { id: 'accueil', label: 'Accueil' },
                { id: 'apropos', label: 'À propos' },
                { id: 'programmes', label: 'Programmes' },
                { id: 'actualites', label: 'Actualités' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 pb-1 border-b-2 ${
                    activeSection === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            
            {/* Action Button */}
            <Button 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-200"
              onClick={onNavigateToLogin}
            >
              <span className="mr-2">→</span> Connexion
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="accueil" className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-1 h-16 bg-gradient-to-b from-green-400 to-blue-400 mr-4"></div>
                <div>
                  <h1 className="text-5xl lg:text-6xl font-bold mb-4">
                    Bienvenue au<br />
                    <span className="bg-gradient-to-r from-green-400 to-blue-300 bg-clip-text text-transparent">
                      Lycée Sainte-Étoile
                    </span>
                  </h1>
                </div>
              </div>
              
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                Excellence académique • Éducation humaine • Technologies modernes
              </p>
              
              <div className="grid sm:grid-cols-3 gap-6 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">15+</div>
                  <div className="text-sm text-blue-200">Années d'expérience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">1200+</div>
                  <div className="text-sm text-blue-200">Élèves formés</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">95%</div>
                  <div className="text-sm text-blue-200">Taux de réussite</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                  onClick={onNavigateToPreRegistration}
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Pré-inscription 2024-2025
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-300"
                  onClick={onNavigateToLogin}
                >
                  <span className="mr-2">→</span>
                  Espace Personnel
                </Button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-96 h-96 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <School className="w-48 h-48 text-white/80" />
                </div>
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-green-400/20 rounded-full"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-400/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* À Propos Section */}
      <section id="apropos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">À Propos du Lycée Sainte-Étoile</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un établissement d'excellence qui forme les leaders de demain avec des valeurs solides et une éducation de qualité internationale.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Excellence Académique</h3>
              <p className="text-gray-600">
                Programmes rigoureux conformes aux standards internationaux avec un suivi personnalisé de chaque élève pour garantir leur réussite.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Éducation Humaine</h3>
              <p className="text-gray-600">
                Formation complète incluant les valeurs morales, le respect, la solidarité et la préparation à la citoyenneté responsable.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Technologies Modernes</h3>
              <p className="text-gray-600">
                Équipements modernes, salles informatiques, laboratoires scientifiques et plateforme numérique pour un apprentissage du 21ème siècle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programmes Section */}
      <section id="programmes" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Programmes Éducatifs</h2>
            <p className="text-xl text-gray-600">
              Un parcours complet de l'enseignement primaire au baccalauréat
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Enseignement Primaire</h3>
                <p className="text-gray-600 mb-4">
                  CP1, CP2, CE1, CE2, CM1, CM2 - Fondements solides avec méthodes pédagogiques modernes.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Français</Badge>
                  <Badge variant="secondary">Mathématiques</Badge>
                  <Badge variant="secondary">Sciences</Badge>
                  <Badge variant="secondary">Anglais</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Collège</h3>
                <p className="text-gray-600 mb-4">
                  6ème, 5ème, 4ème, 3ème - Préparation au BEPC avec accompagnement personnalisé.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Sciences Physiques</Badge>
                  <Badge variant="secondary">Histoire-Géo</Badge>
                  <Badge variant="secondary">SVT</Badge>
                  <Badge variant="secondary">Informatique</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <School className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Lycée</h3>
                <p className="text-gray-600 mb-4">
                  2nde, 1ère, Terminale - Spécialisations scientifiques et littéraires pour le Baccalauréat.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Sciences</Badge>
                  <Badge variant="secondary">Littéraire</Badge>
                  <Badge variant="secondary">Philosophie</Badge>
                  <Badge variant="secondary">Économie</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Actualités Section */}
      <section id="actualites" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Actualités & Événements</h2>
            <p className="text-xl text-gray-600">
              Restez informés de la vie de notre établissement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <Calendar className="w-16 h-16 text-white" />
              </div>
              <CardContent className="p-6">
                <div className="text-sm text-blue-600 font-semibold mb-2">15 Septembre 2024</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Rentrée Scolaire 2024-2025</h3>
                <p className="text-gray-600">
                  Cérémonie d'ouverture officielle de l'année scolaire avec présentation des nouveaux programmes et infrastructures.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Users className="w-16 h-16 text-white" />
              </div>
              <CardContent className="p-6">
                <div className="text-sm text-green-600 font-semibold mb-2">22 Octobre 2024</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Journée Portes Ouvertes</h3>
                <p className="text-gray-600">
                  Venez découvrir nos installations, rencontrer nos enseignants et échanger avec nos élèves ambassadeurs.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white" />
              </div>
              <CardContent className="p-6">
                <div className="text-sm text-purple-600 font-semibold mb-2">5 Novembre 2024</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Concours d'Excellence</h3>
                <p className="text-gray-600">
                  Compétition académique inter-classes pour récompenser les meilleurs élèves dans toutes les matières.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Contactez-Nous</h2>
            <p className="text-xl text-blue-100">
              Nous sommes là pour répondre à toutes vos questions
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-8">Informations de Contact</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white font-bold">📍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Adresse</h4>
                    <p className="text-blue-100">
                      Avenue de la République, Quartier Kaloum<br />
                      Conakry, République de Guinée
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white font-bold">📞</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Téléphone</h4>
                    <p className="text-blue-100">
                      +224 664 123 456<br />
                      +224 622 987 654
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white font-bold">✉️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-blue-100">
                      contact@lycee-sainte-etoile.gn<br />
                      direction@lycee-sainte-etoile.gn
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white font-bold">🕒</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Heures d'ouverture</h4>
                    <p className="text-blue-100">
                      Lundi - Vendredi: 7h30 - 17h30<br />
                      Samedi: 8h00 - 12h00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Demande d'Information</h3>
                  <form className="space-y-4">
                    <div>
                      <Input 
                        placeholder="Votre nom complet" 
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                      />
                    </div>
                    <div>
                      <Input 
                        type="email" 
                        placeholder="Votre email" 
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                      />
                    </div>
                    <div>
                      <Input 
                        placeholder="Téléphone" 
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                      />
                    </div>
                    <div>
                      <Select>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Sujet de votre demande" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inscription">Inscription</SelectItem>
                          <SelectItem value="programme">Programmes</SelectItem>
                          <SelectItem value="visite">Visite de l'école</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <textarea 
                        placeholder="Votre message" 
                        rows="4" 
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/70 resize-none"
                      ></textarea>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3">
                      Envoyer le Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mr-3">
                  <span className="text-white font-bold">LSE</span>
                </div>
                <span className="text-xl font-bold">Lycée Sainte-Étoile</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Formant les leaders de demain avec excellence et humanité depuis 2009.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <span className="text-xs">📘</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <span className="text-xs">📱</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <span className="text-xs">📧</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Liens Rapides</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => scrollToSection('apropos')} className="hover:text-white transition-colors">À Propos</button></li>
                <li><button onClick={() => scrollToSection('programmes')} className="hover:text-white transition-colors">Programmes</button></li>
                <li><button onClick={onNavigateToPreRegistration} className="hover:text-white transition-colors">Pré-inscription</button></li>
                <li><button onClick={onNavigateToLogin} className="hover:text-white transition-colors">Connexion</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Suivi Scolaire</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bulletins en Ligne</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Paiements</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support Parents</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📍 Kaloum, Conakry</li>
                <li>📞 +224 664 123 456</li>
                <li>✉️ contact@lycee-sainte-etoile.gn</li>
                <li>🕒 Lun-Ven: 7h30-17h30</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Lycée Sainte-Étoile. Tous droits réservés. | Développé avec ❤️ pour l'éducation guinéenne</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Composant Page de Pré-inscription avec étapes
const PreRegistrationPage = ({ onBack, onNavigateToLogin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1: Informations Élève
    nom_complet: '',
    date_naissance: '',
    
    // Étape 2: Contacts
    email: '',
    telephone: '',
    
    // Étape 3: Scolarité
    niveau_souhaite: '',
    etablissement_actuel: '',
    
    // Étape 4: Parent/Tuteur
    nom_parent: '',
    prenoms_parent: '',
    telephone_parent: '',
    email_parent: '',
    
    // Étape 5: Documents
    documents: [],
    
    // Étape 6: Validation
    accepte_conditions: false
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, title: 'Informations Élève', subtitle: 'Identité de l\'élève' },
    { id: 2, title: 'Contacts', subtitle: 'Coordonnées' },
    { id: 3, title: 'Scolarité', subtitle: 'Parcours scolaire' },
    { id: 4, title: 'Parent/Tuteur', subtitle: 'Contact responsable' },
    { id: 5, title: 'Documents', subtitle: 'Pièces justificatives' },
    { id: 6, title: 'Validation', subtitle: 'Confirmation' }
  ];

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors on change
    if (fieldErrors[name]) {
      const newErrors = { ...fieldErrors };
      delete newErrors[name];
      setFieldErrors(newErrors);
    }
  };

  const validateStep = (step) => {
    const errors = {};
    
    switch(step) {
      case 1:
        if (!formData.nom_complet || formData.nom_complet.length < 3) {
          errors.nom_complet = 'Le nom complet est requis (minimum 3 caractères)';
        }
        if (!formData.date_naissance) {
          errors.date_naissance = 'La date de naissance est requise';
        }
        break;
      case 2:
        if (!formData.email || !formData.email.includes('@')) {
          errors.email = 'Un email valide est requis';
        }
        if (!formData.telephone) {
          errors.telephone = 'Le numéro de téléphone est requis';
        }
        break;
      case 3:
        if (!formData.niveau_souhaite) {
          errors.niveau_souhaite = 'Le niveau souhaité est requis';
        }
        break;
      case 4:
        if (!formData.nom_parent) {
          errors.nom_parent = 'Le nom du parent/tuteur est requis';
        }
        if (!formData.telephone_parent) {
          errors.telephone_parent = 'Le téléphone du parent/tuteur est requis';
        }
        break;
      case 6:
        if (!formData.accepte_conditions) {
          errors.accepte_conditions = 'Vous devez accepter les conditions';
        }
        break;
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setLoading(true);
      try {
        // Here you would submit to your pre-registration endpoint
        await axios.post('/auth/pre-register', formData);
        toast.success('Pré-inscription enregistrée avec succès! Vous recevrez une confirmation par email.');
        onBack(); // Return to landing page
      } catch (error) {
        toast.error('Erreur lors de la pré-inscription. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nom_complet">Nom complet *</Label>
              <Input
                id="nom_complet"
                value={formData.nom_complet}
                onChange={(e) => handleInputChange('nom_complet', e.target.value)}
                placeholder="Nom et prénoms de l'élève"
                className={fieldErrors.nom_complet ? 'border-red-500' : ''}
              />
              {fieldErrors.nom_complet && (
                <p className="text-sm text-red-500">{fieldErrors.nom_complet}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date_naissance">Date de naissance *</Label>
              <Input
                id="date_naissance"
                type="date"
                value={formData.date_naissance}
                onChange={(e) => handleInputChange('date_naissance', e.target.value)}
                className={fieldErrors.date_naissance ? 'border-red-500' : ''}
              />
              {fieldErrors.date_naissance && (
                <p className="text-sm text-red-500">{fieldErrors.date_naissance}</p>
              )}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@exemple.com"
                className={fieldErrors.email ? 'border-red-500' : ''}
              />
              {fieldErrors.email && (
                <p className="text-sm text-red-500">{fieldErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone *</Label>
              <Input
                id="telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) => handleInputChange('telephone', e.target.value)}
                placeholder="+224 6XX XXX XXX"
                className={fieldErrors.telephone ? 'border-red-500' : ''}
              />
              {fieldErrors.telephone && (
                <p className="text-sm text-red-500">{fieldErrors.telephone}</p>
              )}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="niveau_souhaite">Niveau souhaité *</Label>
              <Select value={formData.niveau_souhaite} onValueChange={(value) => handleInputChange('niveau_souhaite', value)}>
                <SelectTrigger className={fieldErrors.niveau_souhaite ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Choisir le niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconde">Seconde</SelectItem>
                  <SelectItem value="premiere">Première</SelectItem>
                  <SelectItem value="terminale">Terminale</SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors.niveau_souhaite && (
                <p className="text-sm text-red-500">{fieldErrors.niveau_souhaite}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="etablissement_actuel">Établissement actuel</Label>
              <Input
                id="etablissement_actuel"
                value={formData.etablissement_actuel}
                onChange={(e) => handleInputChange('etablissement_actuel', e.target.value)}
                placeholder="Nom de l'établissement actuel (optionnel)"
              />
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom_parent">Nom *</Label>
                <Input
                  id="nom_parent"
                  value={formData.nom_parent}
                  onChange={(e) => handleInputChange('nom_parent', e.target.value)}
                  placeholder="Nom du parent/tuteur"
                  className={fieldErrors.nom_parent ? 'border-red-500' : ''}
                />
                {fieldErrors.nom_parent && (
                  <p className="text-sm text-red-500">{fieldErrors.nom_parent}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prenoms_parent">Prénoms</Label>
                <Input
                  id="prenoms_parent"
                  value={formData.prenoms_parent}
                  onChange={(e) => handleInputChange('prenoms_parent', e.target.value)}
                  placeholder="Prénoms du parent/tuteur"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telephone_parent">Téléphone *</Label>
              <Input
                id="telephone_parent"
                type="tel"
                value={formData.telephone_parent}
                onChange={(e) => handleInputChange('telephone_parent', e.target.value)}
                placeholder="+224 6XX XXX XXX"
                className={fieldErrors.telephone_parent ? 'border-red-500' : ''}
              />
              {fieldErrors.telephone_parent && (
                <p className="text-sm text-red-500">{fieldErrors.telephone_parent}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email_parent">Email parent</Label>
              <Input
                id="email_parent"
                type="email"
                value={formData.email_parent}
                onChange={(e) => handleInputChange('email_parent', e.target.value)}
                placeholder="email@exemple.com (optionnel)"
              />
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Documents à fournir</h3>
              <p className="text-sm text-gray-600 mb-4">
                Vous devrez fournir ces documents lors de la finalisation de l'inscription :
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-1 max-w-md mx-auto">
                <li>• Acte de naissance de l'élève</li>
                <li>• Bulletin scolaire de l'année précédente</li>
                <li>• Photo d'identité récente</li>
                <li>• Certificat médical</li>
                <li>• Pièce d'identité du parent/tuteur</li>
              </ul>
            </div>
          </div>
        );
      
      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif de votre pré-inscription</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Élève :</strong> {formData.nom_complet}</div>
                <div><strong>Date de naissance :</strong> {formData.date_naissance}</div>
                <div><strong>Email :</strong> {formData.email}</div>
                <div><strong>Téléphone :</strong> {formData.telephone}</div>
                <div><strong>Niveau souhaité :</strong> {formData.niveau_souhaite}</div>
                <div><strong>Parent/Tuteur :</strong> {formData.nom_parent} {formData.prenoms_parent}</div>
                <div><strong>Téléphone parent :</strong> {formData.telephone_parent}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={formData.accepte_conditions}
                  onChange={(e) => handleInputChange('accepte_conditions', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-gray-600">
                  J'accepte les conditions générales et autorise le traitement de mes données personnelles 
                  dans le cadre de cette pré-inscription *
                </span>
              </label>
              {fieldErrors.accepte_conditions && (
                <p className="text-sm text-red-500">{fieldErrors.accepte_conditions}</p>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full mr-3">
                <span className="text-white font-bold">LSE</span>
              </div>
              <span className="text-xl font-bold text-blue-800">Lycée Sainte-Étoile</span>
            </div>
            
            <Button 
              variant="outline"
              onClick={onNavigateToLogin}
            >
              <span className="mr-2">→</span> Connexion
            </Button>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Pré-inscription Élève</h1>
          <p className="text-gray-600">
            Remplissez ce formulaire pour pré-inscrire votre enfant. 
            Tous les champs marqués d'un astérisque (*) sont obligatoires.
          </p>
        </div>
        
        {/* Steps Progress */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold
                  ${currentStep >= step.id 
                    ? 'bg-green-600 text-white' 
                    : currentStep === step.id 
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                  {step.id}
                </div>
                <div className="ml-2 hidden md:block">
                  <div className={`text-xs font-medium ${currentStep >= step.id ? 'text-green-600' : 'text-gray-600'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.subtitle}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-300 ml-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-blue-800">
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              Étape {currentStep} sur {steps.length} - {steps[currentStep - 1].subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
            
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <Button variant="outline" onClick={handlePrevious}>
                  Précédent
                </Button>
              ) : (
                <Button variant="outline" onClick={onBack}>
                  Retour
                </Button>
              )}
              
              {currentStep < steps.length ? (
                <Button 
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Suivant
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? 'Envoi...' : 'Confirmer la pré-inscription'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Composant de récupération de mot de passe
const PasswordResetComponent = ({ onBack }) => {
  const [step, setStep] = useState('request'); // 'request' ou 'confirm'
  const [email, setEmail] = useState('');
  const [resetData, setResetData] = useState({
    token: '',
    nouveau_mot_de_passe: '',
    confirmer_mot_de_passe: ''
  });
  const [loading, setLoading] = useState(false);

  // Vérifier s'il y a un token dans l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setStep('confirm');
      setResetData(prev => ({ ...prev, token }));
    }
  }, []);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/auth/password-reset-request', { email });
      toast.success('Un lien de réinitialisation a été envoyé à votre email');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la demande');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/auth/password-reset-confirm', resetData);
      toast.success('Mot de passe réinitialisé avec succès!');
      onBack();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Key className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-blue-800">École Smart</h1>
          </div>
          <CardTitle>
            {step === 'request' ? 'Récupération de mot de passe' : 'Nouveau mot de passe'}
          </CardTitle>
          <CardDescription>
            {step === 'request' 
              ? 'Entrez votre email pour recevoir un lien de récupération'
              : 'Créez un nouveau mot de passe sécurisé'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'request' ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={loading}
              >
                {loading ? 'Envoi...' : 'Envoyer le lien'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Retour à la connexion
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleConfirmReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nouveau_mot_de_passe">Nouveau mot de passe</Label>
                <Input
                  id="nouveau_mot_de_passe"
                  type="password"
                  value={resetData.nouveau_mot_de_passe}
                  onChange={(e) => setResetData({...resetData, nouveau_mot_de_passe: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmer_mot_de_passe">Confirmer le mot de passe</Label>
                <Input
                  id="confirmer_mot_de_passe"
                  type="password"
                  value={resetData.confirmer_mot_de_passe}
                  onChange={(e) => setResetData({...resetData, confirmer_mot_de_passe: e.target.value})}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700" 
                disabled={loading}
              >
                {loading ? 'Réinitialisation...' : 'Réinitialiser'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Composant d'authentification modal
const AuthComponent = ({ onAuthSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [needs2FA, setNeeds2FA] = useState(false);
  const [code2FA, setCode2FA] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
  const [fieldErrors, setFieldErrors] = useState({});

  // Si on doit afficher la récupération de mot de passe
  if (showPasswordReset) {
    return <PasswordResetComponent onBack={() => setShowPasswordReset(false)} />;
  }

  // Validation en temps réel des champs
  const validateField = (name, value) => {
    const errors = { ...fieldErrors };
    
    switch (name) {
      case 'email':
        if (value && !value.includes('@')) {
          errors.email = 'Format d\'email invalide';
        } else {
          delete errors.email;
        }
        break;
      case 'mot_de_passe':
        if (value && value.length < 6) {
          errors.mot_de_passe = 'Minimum 6 caractères requis';
        } else {
          delete errors.mot_de_passe;
        }
        break;
      case 'confirmer_mot_de_passe':
        if (value && value !== formData.mot_de_passe) {
          errors.confirmer_mot_de_passe = 'Les mots de passe ne correspondent pas';
        } else {
          delete errors.confirmer_mot_de_passe;
        }
        break;
      case 'nom':
        if (value && value.length < 2) {
          errors.nom = 'Minimum 2 caractères requis';
        } else {
          delete errors.nom;
        }
        break;
      case 'prenoms':
        if (value && value.length < 2) {
          errors.prenoms = 'Minimum 2 caractères requis';
        } else {
          delete errors.prenoms;
        }
        break;
      case 'telephone':
        if (value && value.length > 0) {
          const phoneRegex = /^(\+224|224)?[6-7][0-9]{8}$/;
          const cleanPhone = value.replace(/[\s\-\.]/g, '');
          if (!phoneRegex.test(cleanPhone)) {
            errors.telephone = 'Format: +224 6XX XXX XXX';
          } else {
            delete errors.telephone;
          }
        } else {
          delete errors.telephone;
        }
        break;
    }
    
    setFieldErrors(errors);
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation côté client renforcée pour l'inscription
      if (!isLogin) {
        // Validation email
        if (!formData.email || !formData.email.includes('@')) {
          toast.error('Veuillez saisir un email valide');
          setLoading(false);
          return;
        }
        
        // Validation mot de passe
        if (formData.mot_de_passe.length < 6) {
          toast.error('Le mot de passe doit contenir au moins 6 caractères');
          setLoading(false);
          return;
        }
        
        if (formData.mot_de_passe !== formData.confirmer_mot_de_passe) {
          toast.error('Les mots de passe ne correspondent pas');
          setLoading(false);
          return;
        }
        
        // Validation nom et prénoms
        if (!formData.nom || formData.nom.length < 2) {
          toast.error('Le nom doit contenir au moins 2 caractères');
          setLoading(false);
          return;
        }
        
        if (!formData.prenoms || formData.prenoms.length < 2) {
          toast.error('Les prénoms doivent contenir au moins 2 caractères');
          setLoading(false);
          return;
        }
        
        // Validation téléphone si fourni
        if (formData.telephone && formData.telephone.length > 0) {
          const phoneRegex = /^(\+224|224)?[6-7][0-9]{8}$/;
          const cleanPhone = formData.telephone.replace(/[\s\-\.]/g, '');
          if (!phoneRegex.test(cleanPhone)) {
            toast.error('Numéro de téléphone invalide. Format correct: +224 6XX XXX XXX');
            setLoading(false);
            return;
          }
        }
        
        if (formData.role === 'administrateur' && !formData.code_admin) {
          toast.error('Code administrateur requis pour ce rôle. Contactez l\'administration.');
          setLoading(false);
          return;
        }
      } else {
        // Validation pour la connexion
        if (!formData.email || !formData.email.includes('@')) {
          toast.error('Veuillez saisir un email valide');
          setLoading(false);
          return;
        }
        
        if (!formData.mot_de_passe) {
          toast.error('Veuillez saisir votre mot de passe');
          setLoading(false);
          return;
        }
      }

      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const requestData = { ...formData };
      
      // Ajouter le code 2FA si nécessaire
      if (isLogin && needs2FA && code2FA) {
        if (code2FA.length !== 6) {
          toast.error('Le code 2FA doit contenir 6 chiffres');
          setLoading(false);
          return;
        }
        requestData.code_2fa = code2FA;
      }
      
      const response = await axios.post(endpoint, requestData);
      
      if (response.data.access_token) {
        // Stocker les données utilisateur
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        
        // Messages de succès personnalisés selon le rôle
        const roleMessages = {
          'administrateur': 'Connexion réussie! Bienvenue dans votre espace d\'administration.',
          'enseignant': 'Connexion réussie! Accédez à vos classes et élèves.',
          'parent': 'Connexion réussie! Suivez le parcours scolaire de vos enfants.',
          'eleve': 'Connexion réussie! Consultez vos notes et devoirs.'
        };
        
        const welcomeMessage = isLogin 
          ? roleMessages[response.data.user.role] || 'Connexion réussie!'
          : `Compte créé avec succès! Bienvenue ${response.data.user.nom} ${response.data.user.prenoms}.`;
        
        // Vérifier si changement de mot de passe requis
        if (response.data.requires_password_change) {
          toast.warning('⚠️ Changement de mot de passe requis. Vous devez changer votre mot de passe temporaire.', {
            duration: 5000
          });
        } else {
          toast.success(welcomeMessage, { duration: 4000 });
        }
        
        // Redirection avec un petit délai pour que l'utilisateur voie le message
        setTimeout(() => {
          onAuthSuccess(response.data.user, !isLogin);
        }, 1000);
      }
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      
      // Gestion spéciale pour la 2FA
      if (error.response?.status === 202) {
        setNeeds2FA(true);
        toast.info('🔐 Code 2FA requis. Entrez le code de votre application d\'authentification.', {
          duration: 5000
        });
        setLoading(false);
        return;
      }
      
      // Gestion des erreurs spécifiques
      const status = error.response?.status;
      const errorDetail = error.response?.data?.detail;
      
      if (status === 401) {
        if (errorDetail === 'Email ou mot de passe incorrect') {
          toast.error('❌ Email ou mot de passe incorrect. Vérifiez vos identifiants.', {
            duration: 5000
          });
        } else if (errorDetail === 'Compte désactivé') {
          toast.error('❌ Votre compte a été désactivé. Contactez l\'administration.', {
            duration: 5000
          });
        } else if (errorDetail === 'Code 2FA incorrect') {
          toast.error('❌ Code 2FA incorrect. Vérifiez le code dans votre application.', {
            duration: 5000
          });
        } else {
          toast.error('❌ Authentification échouée. Vérifiez vos identifiants.', {
            duration: 5000
          });
        }
      } else if (status === 400) {
        if (typeof errorDetail === 'string') {
          if (errorDetail.includes('utilisateur avec cet email existe déjà')) {
            toast.error('Cet email est déjà utilisé. Connectez-vous ou utilisez "Mot de passe oublié" si nécessaire.', {
              duration: 6000
            });
          } else if (errorDetail.includes('Code administrateur')) {
            toast.error('Code administrateur requis ou invalide. Contactez votre établissement pour obtenir ce code.', {
              duration: 6000
            });
          } else if (errorDetail.includes('mot de passe')) {
            toast.error('Le mot de passe ne respecte pas les critères requis. Minimum 6 caractères.', {
              duration: 5000
            });
          } else if (errorDetail.includes('email')) {
            toast.error('Format d\'email invalide. Veuillez saisir une adresse email valide.', {
              duration: 5000
            });
          } else if (errorDetail.includes('telephone') || errorDetail.includes('téléphone')) {
            toast.error('Numéro de téléphone invalide. Format attendu: +224 XXX XXX XXX', {
              duration: 5000
            });
          } else {
            toast.error(`Erreur: ${errorDetail}`, { duration: 5000 });
          }
        } else if (Array.isArray(errorDetail)) {
          // Gestion des erreurs de validation Pydantic
          const firstError = errorDetail[0];
          const field = firstError?.loc?.[1] || 'champ';
          let message = firstError?.msg || 'Erreur de validation';
          
          // Messages plus clairs selon le type d'erreur
          if (message.includes('value is not a valid email')) {
            message = 'Format d\'email invalide';
          } else if (message.includes('ensure this value has at least')) {
            message = 'Trop court - minimum requis non respecté';
          } else if (message.includes('ensure this value has at most')) {
            message = 'Trop long - maximum autorisé dépassé';
          }
          
          const fieldNames = {
            'email': 'Email',
            'mot_de_passe': 'Mot de passe', 
            'nom': 'Nom',
            'prenoms': 'Prénoms',
            'telephone': 'Téléphone',
            'confirmer_mot_de_passe': 'Confirmation mot de passe'
          };
          
          toast.error(`${fieldNames[field] || 'Champ'}: ${message}`, {
            duration: 5000
          });
        } else {
          toast.error('Données invalides. Vérifiez tous les champs et réessayez.', {
            duration: 5000
          });
        }
      } else if (status === 422) {
        toast.error('❌ Format de données incorrect. Vérifiez tous les champs requis.', {
          duration: 5000
        });
      } else if (status >= 500) {
        toast.error('❌ Erreur serveur. Réessayez dans quelques instants ou contactez le support.', {
          duration: 6000
        });
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error('❌ Problème de connexion. Vérifiez votre connexion internet.', {
          duration: 6000
        });
      } else {
        toast.error('❌ Une erreur inattendue s\'est produite. Réessayez.', {
          duration: 5000
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    const redirectUrl = encodeURIComponent(window.location.origin);
    window.location.href = `https://auth.emergentagent.com/?redirect=${redirectUrl}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 p-4">
      <Card className="w-full max-w-md bg-white rounded-lg shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mr-3">
              <span className="text-white font-bold text-lg">LSE</span>
            </div>
            <h1 className="text-2xl font-bold text-blue-800">Lycée Sainte-Étoile</h1>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Connexion à la plateforme scolaire' : 'Inscription'}
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            {isLogin ? 'Accédez à votre espace personnel' : 'Créer votre compte'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{isLogin ? 'Identifiant' : 'Email'}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={isLogin ? "Email, téléphone ou matricule" : "votre.email@exemple.com"}
                required
                data-testid="email-input"
                className={fieldErrors.email ? 'border-red-500' : ''}
              />
              {fieldErrors.email && (
                <p className="text-sm text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mot_de_passe">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="mot_de_passe"
                  name="mot_de_passe"
                  type={showPassword ? "text" : "password"}
                  value={formData.mot_de_passe}
                  onChange={(e) => handleInputChange('mot_de_passe', e.target.value)}
                  placeholder={isLogin ? "Votre mot de passe" : "Minimum 6 caractères"}
                  required
                  data-testid="password-input"
                  className={fieldErrors.mot_de_passe ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {fieldErrors.mot_de_passe && (
                <p className="text-sm text-red-500">{fieldErrors.mot_de_passe}</p>
              )}
            </div>

            {needs2FA && isLogin && (
              <div className="space-y-2">
                <Label htmlFor="code_2fa">Code 2FA</Label>
                <Input
                  id="code_2fa"
                  type="text"
                  value={code2FA}
                  onChange={(e) => setCode2FA(e.target.value)}
                  placeholder="Entrez le code à 6 chiffres"
                  required
                  maxLength="6"
                />
                <p className="text-xs text-gray-500">
                  Entrez le code généré par votre application d'authentification
                </p>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmer_mot_de_passe">Confirmer le mot de passe</Label>
                <Input
                  id="confirmer_mot_de_passe"
                  name="confirmer_mot_de_passe"
                  type="password"
                  value={formData.confirmer_mot_de_passe}
                  onChange={(e) => handleInputChange('confirmer_mot_de_passe', e.target.value)}
                  placeholder="Confirmez votre mot de passe"
                  required
                  data-testid="confirm-password-input"
                  className={fieldErrors.confirmer_mot_de_passe ? 'border-red-500' : ''}
                />
                {fieldErrors.confirmer_mot_de_passe && (
                  <p className="text-sm text-red-500">{fieldErrors.confirmer_mot_de_passe}</p>
                )}
              </div>
            )}

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      placeholder="Votre nom de famille"
                      required
                      className={fieldErrors.nom ? 'border-red-500' : ''}
                    />
                    {fieldErrors.nom && (
                      <p className="text-sm text-red-500">{fieldErrors.nom}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenoms">Prénoms</Label>
                    <Input
                      id="prenoms"
                      name="prenoms"
                      value={formData.prenoms}
                      onChange={(e) => handleInputChange('prenoms', e.target.value)}
                      placeholder="Vos prénoms"
                      required
                      className={fieldErrors.prenoms ? 'border-red-500' : ''}
                    />
                    {fieldErrors.prenoms && (
                      <p className="text-sm text-red-500">{fieldErrors.prenoms}</p>
                    )}
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
                      <SelectItem value="eleve">Élève</SelectItem>
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
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    placeholder="+224 6XX XXX XXX"
                    className={fieldErrors.telephone ? 'border-red-500' : ''}
                  />
                  {fieldErrors.telephone && (
                    <p className="text-sm text-red-500">{fieldErrors.telephone}</p>
                  )}
                </div>
              </>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                
                <button
                  type="button"
                  onClick={() => setShowPasswordReset(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3" 
              disabled={loading}
              data-testid="auth-submit-btn"
            >
              <span className="mr-2">→</span>
              {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'S\'inscrire')}
            </Button>

            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-3 text-sm text-gray-500">ou</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleAuth}
              disabled={loading}
              data-testid="google-auth-btn"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLogin ? 'Se connecter avec Google' : 'S\'inscrire avec Google'}
            </Button>

            {!isLogin && (
              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Déjà un compte ? Se connecter
                </button>
              </div>
            )}

            {onBack && (
              <div className="text-center mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="text-sm"
                >
                  Retour à l'accueil
                </Button>
              </div>
            )}
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
    { id: 'notes', label: 'Notes & Moyennes', icon: BookOpen },
    { id: 'bulletins', label: 'Bulletins', icon: FileText },
    { id: 'devoirs-ressources', label: 'Devoirs & Ressources', icon: FileText },
    { id: 'emplois-du-temps', label: 'Emplois du temps', icon: Calendar },
    { id: 'calendrier', label: 'Calendrier', icon: Calendar },
    { id: 'factures', label: 'Factures', icon: FileText },
    { id: 'paiements', label: 'Paiements', icon: CreditCard },
    { id: 'presences', label: 'Présences', icon: ClipboardCheck }
  ];

  // Ajouter l'item admin seulement pour les administrateurs
  if (user.role === 'administrateur') {
    menuItems.push({ id: 'admin', label: 'Administration', icon: AlertCircle });
  }

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

// Composant Dashboard amélioré pour production
const Dashboard = ({ user }) => {
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
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleSpecificContent = () => {
    if (!user) return null;

    switch(user.role) {
      case 'administrateur':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Élèves</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.eleves?.total || 0}
                    </p>
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
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.finances?.total_factures || 0}
                    </p>
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
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.finances?.factures_impayees || 0}
                    </p>
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
                      {stats?.finances?.total_creances?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'enseignant':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Mes Classes</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                    <p className="text-xs text-gray-500">6ème, 5ème, 4ème</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Mes Élèves</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.eleves?.total || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <ClipboardCheck className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Absences cette semaine</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.presences?.absences_cette_semaine || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'parent':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Mes Enfants</p>
                    <p className="text-2xl font-bold text-gray-900">2</p>
                    <p className="text-xs text-gray-500">Consultez leurs bulletins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Factures en cours</p>
                    <p className="text-2xl font-bold text-gray-900">1</p>
                    <p className="text-xs text-gray-500">À régler</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'eleve':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ma Classe</p>
                    <p className="text-2xl font-bold text-gray-900">{user.classe || '3ème'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Devoirs en cours</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <School className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Moyenne Générale</p>
                    <p className="text-2xl font-bold text-gray-900">14.5</p>
                    <p className="text-xs text-gray-500">/20</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <School className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="dashboard-content">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Tableau de bord</h2>
        <p className="text-gray-600 mt-2">
          {user?.role === 'administrateur' && 'Vue d\'ensemble de votre école'}
          {user?.role === 'enseignant' && 'Vos classes et élèves'}
          {user?.role === 'parent' && 'Suivi de vos enfants'}
          {user?.role === 'eleve' && 'Votre parcours scolaire'}
        </p>
      </div>

      {/* Contenu spécifique au rôle */}
      {getRoleSpecificContent()}

      {/* Section commune pour tous les rôles (sauf élève) */}
      {user?.role !== 'eleve' && (
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
      )}
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

// Composant Gestion des Notes et Moyennes
const NotesComponent = ({ user }) => {
  const [notes, setNotes] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [showCreateMatiere, setShowCreateMatiere] = useState(false);
  const [selectedEleve, setSelectedEleve] = useState('all');
  const [selectedTrimestre, setSelectedTrimestre] = useState('T1');
  
  const [noteFormData, setNoteFormData] = useState({
    eleve_id: 'none',
    matiere: 'none',
    type_evaluation: 'devoir',
    note: '',
    coefficient: '1.0',
    date_evaluation: new Date().toISOString().split('T')[0],
    trimestre: 'T1',
    commentaire: ''
  });

  const [matiereFormData, setMatiereFormData] = useState({
    nom: '',
    code: '',
    coefficient: '1.0',
    couleur: '#3B82F6',
    classes: []
  });

  const types_evaluation = ['devoir', 'composition', 'controle', 'examen', 'oral'];
  const trimestres = ['T1', 'T2', 'T3'];
  const classes = ['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2', '6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Tle'];

  useEffect(() => {
    fetchNotes();
    fetchMatieres();
    fetchEleves();
  }, [selectedEleve, selectedTrimestre]);

  const fetchNotes = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedEleve && selectedEleve !== 'all') params.append('eleve_id', selectedEleve);
      if (selectedTrimestre && selectedTrimestre !== 'all') params.append('trimestre', selectedTrimestre);
      
      const response = await axios.get(`/notes?${params.toString()}`);
      setNotes(response.data.notes);
    } catch (error) {
      toast.error('Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
    }
  };

  const fetchMatieres = async () => {
    try {
      const response = await axios.get('/matieres');
      setMatieres(response.data.matieres);
    } catch (error) {
      console.error('Erreur chargement matières:', error);
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

  const handleCreateNote = async (e) => {
    e.preventDefault();
    
    // Validation côté client
    if (noteFormData.eleve_id === 'none') {
      toast.error('Veuillez sélectionner un élève');
      return;
    }
    
    if (noteFormData.matiere === 'none') {
      toast.error('Veuillez sélectionner une matière');
      return;
    }

    try {
      await axios.post('/notes', {
        ...noteFormData,
        note: parseFloat(noteFormData.note),
        coefficient: parseFloat(noteFormData.coefficient)
      });
      toast.success('Note enregistrée avec succès');
      setShowCreateNote(false);
      setNoteFormData({
        eleve_id: 'none',
        matiere: 'none',
        type_evaluation: 'devoir',
        note: '',
        coefficient: '1.0',
        date_evaluation: new Date().toISOString().split('T')[0],
        trimestre: 'T1',
        commentaire: ''
      });
      fetchNotes();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleCreateMatiere = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/matieres', matiereFormData);
      toast.success('Matière créée avec succès');
      setShowCreateMatiere(false);
      setMatiereFormData({
        nom: '',
        code: '',
        coefficient: '1.0',
        couleur: '#3B82F6',
        classes: []
      });
      fetchMatieres();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la création');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement des notes...</div>;
  }

  return (
    <div className="space-y-6" data-testid="notes-section">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Notes & Moyennes</h2>
          <p className="text-gray-600 mt-2">Gestion des évaluations et calcul des moyennes</p>
        </div>
        
        <div className="flex space-x-2">
          {(user.role === 'administrateur' || user.role === 'enseignant') && (
            <>
              <Dialog open={showCreateMatiere} onOpenChange={setShowCreateMatiere}>
                <DialogTrigger asChild>
                  <Button variant="outline" data-testid="create-subject-btn">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Matière
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Créer une nouvelle matière</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateMatiere} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom de la matière</Label>
                      <Input
                        id="nom"
                        value={matiereFormData.nom}
                        onChange={(e) => setMatiereFormData({...matiereFormData, nom: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="code">Code matière</Label>
                      <Input
                        id="code"
                        value={matiereFormData.code}
                        onChange={(e) => setMatiereFormData({...matiereFormData, code: e.target.value.toUpperCase()})}
                        placeholder="MATH, FRAN, ANG..."
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="coefficient">Coefficient</Label>
                      <Input
                        id="coefficient"
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="5"
                        value={matiereFormData.coefficient}
                        onChange={(e) => setMatiereFormData({...matiereFormData, coefficient: e.target.value})}
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowCreateMatiere(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Créer
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={showCreateNote} onOpenChange={setShowCreateNote}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700" data-testid="add-note-btn">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Note
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Saisir une nouvelle note</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateNote} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Élève</Label>
                      <Select value={noteFormData.eleve_id} onValueChange={(value) => setNoteFormData({...noteFormData, eleve_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un élève" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sélectionner un élève</SelectItem>
                          {eleves.map(eleve => (
                            <SelectItem key={eleve._id} value={eleve._id}>
                              {eleve.nom} {eleve.prenoms} - {eleve.classe}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Matière</Label>
                      <Select value={noteFormData.matiere} onValueChange={(value) => setNoteFormData({...noteFormData, matiere: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une matière" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sélectionner une matière</SelectItem>
                          {matieres.map(matiere => (
                            <SelectItem key={matiere._id} value={matiere.nom}>
                              {matiere.nom} ({matiere.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type d'évaluation</Label>
                        <Select value={noteFormData.type_evaluation} onValueChange={(value) => setNoteFormData({...noteFormData, type_evaluation: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {types_evaluation.map(type => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Trimestre</Label>
                        <Select value={noteFormData.trimestre} onValueChange={(value) => setNoteFormData({...noteFormData, trimestre: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {trimestres.map(trimestre => (
                              <SelectItem key={trimestre} value={trimestre}>{trimestre}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="note">Note (/20)</Label>
                        <Input
                          id="note"
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          value={noteFormData.note}
                          onChange={(e) => setNoteFormData({...noteFormData, note: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="coefficient">Coefficient</Label>
                        <Input
                          id="coefficient"
                          type="number"
                          step="0.5"
                          min="0.5"
                          max="5"
                          value={noteFormData.coefficient}
                          onChange={(e) => setNoteFormData({...noteFormData, coefficient: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_evaluation">Date d'évaluation</Label>
                      <Input
                        id="date_evaluation"
                        type="date"
                        value={noteFormData.date_evaluation}
                        onChange={(e) => setNoteFormData({...noteFormData, date_evaluation: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="commentaire">Commentaire (optionnel)</Label>
                      <Input
                        id="commentaire"
                        value={noteFormData.commentaire}
                        onChange={(e) => setNoteFormData({...noteFormData, commentaire: e.target.value})}
                        placeholder="Observation ou commentaire..."
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowCreateNote(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        Enregistrer
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-48">
              <Label>Filtrer par élève</Label>
              <Select value={selectedEleve} onValueChange={setSelectedEleve}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les élèves" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les élèves</SelectItem>
                  {eleves.map(eleve => (
                    <SelectItem key={eleve._id} value={eleve._id}>
                      {eleve.nom} {eleve.prenoms} - {eleve.classe}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="min-w-32">
              <Label>Trimestre</Label>
              <Select value={selectedTrimestre} onValueChange={setSelectedTrimestre}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {trimestres.map(trimestre => (
                    <SelectItem key={trimestre} value={trimestre}>{trimestre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des matières */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Matières ({matieres.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {matieres.map((matiere) => (
                <div key={matiere._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{matiere.nom}</div>
                    <div className="text-sm text-gray-500">Code: {matiere.code} • Coef: {matiere.coefficient}</div>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: matiere.couleur }}
                  ></div>
                </div>
              ))}
              {matieres.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Aucune matière créée
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Liste des notes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Notes récentes ({notes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Coef</TableHead>
                    <TableHead>Trimestre</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notes.map((note) => (
                    <TableRow key={note._id}>
                      <TableCell>
                        {note.eleve ? (
                          <div>
                            <div className="font-medium">{note.eleve.nom} {note.eleve.prenoms}</div>
                            <div className="text-sm text-gray-500">{note.eleve.classe}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Élève non trouvé</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{note.matiere}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {note.type_evaluation.charAt(0).toUpperCase() + note.type_evaluation.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={note.note >= 10 ? "default" : "destructive"}>
                          {note.note}/20
                        </Badge>
                      </TableCell>
                      <TableCell>{note.coefficient}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{note.trimestre}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(note.date_evaluation).toLocaleDateString('fr-FR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {notes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucune note enregistrée
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Composant Bulletins
const BulletinsComponent = ({ user }) => {
  const [eleves, setEleves] = useState([]);
  const [selectedEleve, setSelectedEleve] = useState('all');
  const [selectedTrimestre, setSelectedTrimestre] = useState('T1');
  const [bulletinData, setBulletinData] = useState(null);
  const [loading, setLoading] = useState(false);

  const trimestres = ['T1', 'T2', 'T3'];

  useEffect(() => {
    fetchEleves();
  }, []);

  const fetchEleves = async () => {
    try {
      const response = await axios.get('/eleves');
      setEleves(response.data.eleves);
    } catch (error) {
      console.error('Erreur chargement élèves:', error);
    }
  };

  const genererBulletin = async () => {
    if (!selectedEleve || selectedEleve === 'all') {
      toast.error('Veuillez sélectionner un élève');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/bulletins/generer', {
        eleve_id: selectedEleve,
        trimestre: selectedTrimestre,
        format_export: 'pdf'
      });
      
      setBulletinData(response.data.bulletin_data);
      toast.success('Bulletin généré avec succès');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la génération du bulletin');
    } finally {
      setLoading(false);
    }
  };

  const getMoyenneColor = (moyenne) => {
    if (moyenne >= 16) return 'text-green-600';
    if (moyenne >= 14) return 'text-blue-600';
    if (moyenne >= 12) return 'text-orange-600';
    if (moyenne >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6" data-testid="bulletins-section">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Bulletins Scolaires</h2>
        <p className="text-gray-600 mt-2">Génération et consultation des bulletins de notes</p>
      </div>

      {/* Générateur de bulletin */}
      <Card>
        <CardHeader>
          <CardTitle>Générer un Bulletin</CardTitle>
          <CardDescription>Sélectionnez un élève et un trimestre</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Élève</Label>
              <Select value={selectedEleve} onValueChange={setSelectedEleve}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un élève" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Sélectionner un élève</SelectItem>
                  {eleves.map(eleve => (
                    <SelectItem key={eleve._id} value={eleve._id}>
                      {eleve.nom} {eleve.prenoms} - {eleve.classe}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Trimestre</Label>
              <Select value={selectedTrimestre} onValueChange={setSelectedTrimestre}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {trimestres.map(trimestre => (
                    <SelectItem key={trimestre} value={trimestre}>{trimestre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={genererBulletin}
                disabled={loading || !selectedEleve}
                className="w-full bg-blue-600 hover:bg-blue-700"
                data-testid="generate-bulletin-btn"
              >
                {loading ? 'Génération...' : 'Générer Bulletin'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Affichage du bulletin */}
      {bulletinData && (
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-center text-xl">
              BULLETIN SCOLAIRE - {bulletinData.trimestre} {bulletinData.annee_scolaire}
            </CardTitle>
            <div className="text-center space-y-1">
              <p className="font-medium text-lg">
                {bulletinData.eleve.nom} {bulletinData.eleve.prenoms}
              </p>
              <p className="text-gray-600">Classe: {bulletinData.eleve.classe}</p>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Moyennes par matière */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Résultats par Matière</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matière</TableHead>
                      <TableHead>Nombre de Notes</TableHead>
                      <TableHead>Moyenne</TableHead>
                      <TableHead>Coefficient</TableHead>
                      <TableHead>Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bulletinData.moyennes_par_matiere.map((matiere, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{matiere.matiere}</TableCell>
                        <TableCell>{matiere.nb_notes}</TableCell>
                        <TableCell className={`font-bold ${getMoyenneColor(matiere.moyenne)}`}>
                          {matiere.moyenne}/20
                        </TableCell>
                        <TableCell>{matiere.coefficient_total}</TableCell>
                        <TableCell>{(matiere.moyenne * matiere.coefficient_total).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Moyenne générale et appréciations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-700 mb-2">Moyenne Générale</h4>
                    <div className={`text-3xl font-bold ${getMoyenneColor(bulletinData.moyenne_generale)}`}>
                      {bulletinData.moyenne_generale}/20
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Présences</h4>
                    <div className="space-y-1 text-sm">
                      <p>Total cours: {bulletinData.presences.total_cours}</p>
                      <p>Absences: {bulletinData.presences.absences}</p>
                      <p>Taux de présence: {bulletinData.presences.taux_presence}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Appréciation */}
            <div className="mt-6">
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Appréciation Générale</h4>
                  <p className="text-gray-800">{bulletinData.appreciation}</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 text-right text-sm text-gray-500">
              Bulletin généré le {new Date(bulletinData.date_generation).toLocaleString('fr-FR')}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Composant Calendrier Académique
const CalendrierComponent = ({ user }) => {
  const [evenements, setEvenements] = useState([]);
  const [trimestres, setTrimestres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMois, setSelectedMois] = useState(new Date().getMonth() + 1);
  const [selectedAnnee, setSelectedAnnee] = useState(new Date().getFullYear());
  
  const mois = [
    { value: 1, label: 'Janvier' }, { value: 2, label: 'Février' }, { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' }, { value: 5, label: 'Mai' }, { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' }, { value: 8, label: 'Août' }, { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' }, { value: 11, label: 'Novembre' }, { value: 12, label: 'Décembre' }
  ];

  useEffect(() => {
    fetchEvenements();
    fetchTrimestres();
  }, [selectedMois, selectedAnnee]);

  const fetchEvenements = async () => {
    try {
      const response = await axios.get(`/calendrier/evenements?mois=${selectedMois}&annee=${selectedAnnee}`);
      setEvenements(response.data.evenements);
    } catch (error) {
      console.error('Erreur chargement événements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrimestres = async () => {
    try {
      const response = await axios.get('/calendrier/trimestres');
      setTrimestres(response.data.trimestres);
    } catch (error) {
      console.error('Erreur chargement trimestres:', error);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'cours': 'bg-blue-100 text-blue-800',
      'examen': 'bg-red-100 text-red-800',
      'vacances': 'bg-green-100 text-green-800',
      'reunion': 'bg-purple-100 text-purple-800',
      'activite': 'bg-orange-100 text-orange-800',
      'autre': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.autre;
  };

  const getCurrentTrimestre = () => {
    const today = new Date();
    const currentDateStr = today.toISOString().split('T')[0];
    
    return trimestres.find(t => 
      currentDateStr >= t.debut && currentDateStr <= t.fin
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement du calendrier...</div>;
  }

  return (
    <div className="space-y-6" data-testid="calendrier-section">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Calendrier Académique</h2>
        <p className="text-gray-600 mt-2">Planning des cours, examens et activités scolaires</p>
      </div>

      {/* Navigation mois/année */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="space-y-2">
              <Label>Mois</Label>
              <Select value={selectedMois.toString()} onValueChange={(value) => setSelectedMois(parseInt(value))}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mois.map(m => (
                    <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Année</Label>
              <Select value={selectedAnnee.toString()} onValueChange={(value) => setSelectedAnnee(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations sur les trimestres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trimestres.map((trimestre, index) => {
          const isCurrent = getCurrentTrimestre()?.code === trimestre.code;
          return (
            <Card key={index} className={isCurrent ? 'border-blue-500 bg-blue-50' : ''}>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <h3 className="font-bold text-lg">{trimestre.nom}</h3>
                    {isCurrent && <Badge className="ml-2 bg-blue-600">Actuel</Badge>}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Début:</strong> {new Date(trimestre.debut).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Fin:</strong> {new Date(trimestre.fin).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Vacances:</strong> {trimestre.vacances}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Liste des événements */}
      <Card>
        <CardHeader>
          <CardTitle>
            Événements - {mois.find(m => m.value === selectedMois)?.label} {selectedAnnee}
            ({evenements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {evenements.length > 0 ? (
            <div className="space-y-3">
              {evenements.map((evenement) => (
                <div key={evenement._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-lg">{evenement.titre}</h4>
                        <Badge className={getTypeColor(evenement.type_evenement)}>
                          {evenement.type_evenement.charAt(0).toUpperCase() + evenement.type_evenement.slice(1)}
                        </Badge>
                        {evenement.classe && (
                          <Badge variant="outline">{evenement.classe}</Badge>
                        )}
                      </div>
                      
                      {evenement.description && (
                        <p className="text-gray-600 mb-2">{evenement.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          📅 {new Date(evenement.date_debut).toLocaleDateString('fr-FR')}
                          {evenement.date_fin && evenement.date_fin !== evenement.date_debut && (
                            <span> → {new Date(evenement.date_fin).toLocaleDateString('fr-FR')}</span>
                          )}
                        </span>
                        {evenement.matiere && (
                          <span>📚 {evenement.matiere}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun événement prévu pour {mois.find(m => m.value === selectedMois)?.label} {selectedAnnee}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Note d'information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Système de gestion du calendrier</p>
              <p>
                Les administrateurs et enseignants peuvent créer des événements dans le calendrier académique. 
                Les emplois du temps détaillés par classe seront bientôt disponibles.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Composant Emplois du Temps
const EmploisDuTempsComponent = ({ user }) => {
  const [emploisDuTemps, setEmploisDuTemps] = useState([]);
  const [trimestres, setTrimestres] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClasse, setSelectedClasse] = useState('6ème');
  const [showCreateCours, setShowCreateCours] = useState(false);
  const [showCreateTrimestre, setShowCreateTrimestre] = useState(false);
  
  const [coursFormData, setCoursFormData] = useState({
    classe: '6ème',
    jour_semaine: 1,
    heure_debut: '08:00',
    heure_fin: '08:55',
    matiere: 'none',
    enseignant_id: 'none',
    salle: '',
    type_cours: 'cours',
    couleur: '#3B82F6'
  });

  const [trimestreFormData, setTrimestreFormData] = useState({
    nom: '',
    code: 'T1',
    date_debut: '',
    date_fin: '',
    date_debut_vacances: '',
    date_fin_vacances: '',
    annee_scolaire: '2024-2025'
  });

  const classes = ['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2', '6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Tle'];
  const joursSemaine = [
    { id: 1, nom: 'Lundi' },
    { id: 2, nom: 'Mardi' },
    { id: 3, nom: 'Mercredi' },
    { id: 4, nom: 'Jeudi' },
    { id: 5, nom: 'Vendredi' },
    { id: 6, nom: 'Samedi' },
    { id: 7, nom: 'Dimanche' }
  ];

  const typeCours = ['cours', 'td', 'tp', 'evaluation', 'soutien'];

  useEffect(() => {
    fetchEmploisDuTemps();
    fetchTrimestres();
    fetchCreneaux();
    fetchMatieres();
    fetchEnseignants();
  }, [selectedClasse]);

  const fetchEmploisDuTemps = async () => {
    try {
      const response = await axios.get(`/emplois-du-temps?classe=${selectedClasse}`);
      setEmploisDuTemps(response.data.emploi_du_temps);
    } catch (error) {
      console.error('Erreur chargement emplois du temps:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrimestres = async () => {
    try {
      const response = await axios.get('/trimestres');
      setTrimestres(response.data.trimestres);
    } catch (error) {
      console.error('Erreur chargement trimestres:', error);
    }
  };

  const fetchCreneaux = async () => {
    try {
      const response = await axios.get('/creneaux');
      setCreneaux(response.data.creneaux);
    } catch (error) {
      console.error('Erreur chargement créneaux:', error);
    }
  };

  const fetchMatieres = async () => {
    try {
      const response = await axios.get('/matieres');
      setMatieres(response.data.matieres);
    } catch (error) {
      console.error('Erreur chargement matières:', error);
    }
  };

  const fetchEnseignants = async () => {
    try {
      // Récupérer les utilisateurs avec le rôle enseignant
      const response = await axios.get('/eleves'); // On utilisera cette route temporairement
      // TODO: Créer une route spécifique pour les enseignants
      setEnseignants([]); // Pour l'instant
    } catch (error) {
      console.error('Erreur chargement enseignants:', error);
    }
  };

  const handleCreateCours = async (e) => {
    e.preventDefault();
    
    if (coursFormData.matiere === 'none') {
      toast.error('Veuillez sélectionner une matière');
      return;
    }

    try {
      await axios.post('/emplois-du-temps', {
        ...coursFormData,
        jour_semaine: parseInt(coursFormData.jour_semaine),
        enseignant_id: coursFormData.enseignant_id !== 'none' ? coursFormData.enseignant_id : null
      });
      toast.success('Cours ajouté à l\'emploi du temps');
      setShowCreateCours(false);
      setCoursFormData({
        classe: selectedClasse,
        jour_semaine: 1,
        heure_debut: '08:00',
        heure_fin: '08:55',
        matiere: 'none',
        enseignant_id: 'none',
        salle: '',
        type_cours: 'cours',
        couleur: '#3B82F6'
      });
      fetchEmploisDuTemps();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'ajout du cours');
    }
  };

  const handleCreateTrimestre = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/trimestres', trimestreFormData);
      toast.success('Trimestre créé avec succès');
      setShowCreateTrimestre(false);
      setTrimestreFormData({
        nom: '',
        code: 'T1',
        date_debut: '',
        date_fin: '',
        date_debut_vacances: '',
        date_fin_vacances: '',
        annee_scolaire: '2024-2025'
      });
      fetchTrimestres();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la création du trimestre');
    }
  };

  const supprimerCours = async (coursId) => {
    try {
      await axios.delete(`/emplois-du-temps/${coursId}`);
      toast.success('Cours supprimé');
      fetchEmploisDuTemps();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Organiser l'emploi du temps en grille
  const organiserEmploiDuTemps = () => {
    const grille = {};
    
    // Initialiser la grille
    joursSemaine.slice(0, 6).forEach(jour => { // Lundi à Samedi
      grille[jour.id] = {};
    });
    
    // Placer les cours dans la grille
    emploisDuTemps.forEach(cours => {
      const cle = `${cours.heure_debut}-${cours.heure_fin}`;
      if (grille[cours.jour_semaine]) {
        grille[cours.jour_semaine][cle] = cours;
      }
    });
    
    return grille;
  };

  const getCreneauxUniques = () => {
    const creneauxSet = new Set();
    emploisDuTemps.forEach(cours => {
      creneauxSet.add(`${cours.heure_debut}-${cours.heure_fin}`);
    });
    return Array.from(creneauxSet).sort();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement des emplois du temps...</div>;
  }

  const grilleEmploi = organiserEmploiDuTemps();
  const creneauxUniques = getCreneauxUniques();

  return (
    <div className="space-y-6" data-testid="emplois-du-temps-section">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Emplois du Temps</h2>
          <p className="text-gray-600 mt-2">Gestion des plannings de cours par classe</p>
        </div>
        
        <div className="flex space-x-2">
          {(user.role === 'administrateur') && (
            <Dialog open={showCreateTrimestre} onOpenChange={setShowCreateTrimestre}>
              <DialogTrigger asChild>
                <Button variant="outline" data-testid="create-trimestre-btn">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Trimestre
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau trimestre</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateTrimestre} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom du trimestre</Label>
                    <Input
                      id="nom"
                      value={trimestreFormData.nom}
                      onChange={(e) => setTrimestreFormData({...trimestreFormData, nom: e.target.value})}
                      placeholder="Trimestre 1"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Code</Label>
                    <Select value={trimestreFormData.code} onValueChange={(value) => setTrimestreFormData({...trimestreFormData, code: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="T1">T1</SelectItem>
                        <SelectItem value="T2">T2</SelectItem>
                        <SelectItem value="T3">T3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date_debut">Date de début</Label>
                      <Input
                        id="date_debut"
                        type="date"
                        value={trimestreFormData.date_debut}
                        onChange={(e) => setTrimestreFormData({...trimestreFormData, date_debut: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date_fin">Date de fin</Label>
                      <Input
                        id="date_fin"
                        type="date"
                        value={trimestreFormData.date_fin}
                        onChange={(e) => setTrimestreFormData({...trimestreFormData, date_fin: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowCreateTrimestre(false)}>
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

          {(user.role === 'administrateur' || user.role === 'enseignant') && (
            <Dialog open={showCreateCours} onOpenChange={setShowCreateCours}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700" data-testid="add-course-btn">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter Cours
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Ajouter un cours à l'emploi du temps</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateCours} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Classe</Label>
                      <Select value={coursFormData.classe} onValueChange={(value) => setCoursFormData({...coursFormData, classe: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map(classe => (
                            <SelectItem key={classe} value={classe}>{classe}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Jour</Label>
                      <Select value={coursFormData.jour_semaine.toString()} onValueChange={(value) => setCoursFormData({...coursFormData, jour_semaine: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {joursSemaine.slice(0, 6).map(jour => (
                            <SelectItem key={jour.id} value={jour.id.toString()}>{jour.nom}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="heure_debut">Heure début</Label>
                      <Input
                        id="heure_debut"
                        type="time"
                        value={coursFormData.heure_debut}
                        onChange={(e) => setCoursFormData({...coursFormData, heure_debut: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="heure_fin">Heure fin</Label>
                      <Input
                        id="heure_fin"
                        type="time"
                        value={coursFormData.heure_fin}
                        onChange={(e) => setCoursFormData({...coursFormData, heure_fin: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Matière</Label>
                    <Select value={coursFormData.matiere} onValueChange={(value) => setCoursFormData({...coursFormData, matiere: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une matière" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sélectionner une matière</SelectItem>
                        {matieres.map(matiere => (
                          <SelectItem key={matiere._id} value={matiere.nom}>
                            {matiere.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salle">Salle (optionnel)</Label>
                      <Input
                        id="salle"
                        value={coursFormData.salle}
                        onChange={(e) => setCoursFormData({...coursFormData, salle: e.target.value})}
                        placeholder="Salle A1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={coursFormData.type_cours} onValueChange={(value) => setCoursFormData({...coursFormData, type_cours: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {typeCours.map(type => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowCreateCours(false)}>
                      Annuler
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Ajouter
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Sélecteur de classe */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Label className="font-medium">Classe :</Label>
            <Select value={selectedClasse} onValueChange={setSelectedClasse}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {classes.map(classe => (
                  <SelectItem key={classe} value={classe}>{classe}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grille emploi du temps */}
      <Card>
        <CardHeader>
          <CardTitle>Emploi du temps - {selectedClasse}</CardTitle>
        </CardHeader>
        <CardContent>
          {creneauxUniques.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left font-medium">Horaires</th>
                    {joursSemaine.slice(0, 6).map(jour => (
                      <th key={jour.id} className="border border-gray-300 p-3 text-center font-medium">
                        {jour.nom}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {creneauxUniques.map((creneau, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-3 bg-gray-50 font-medium text-sm">
                        {creneau.replace('-', ' - ')}
                      </td>
                      {joursSemaine.slice(0, 6).map(jour => {
                        const cours = grilleEmploi[jour.id]?.[creneau];
                        return (
                          <td key={jour.id} className="border border-gray-300 p-1 h-20 relative">
                            {cours ? (
                              <div 
                                className="h-full p-2 rounded text-white text-xs relative group cursor-pointer"
                                style={{ backgroundColor: cours.couleur }}
                              >
                                <div className="font-medium">{cours.matiere}</div>
                                {cours.salle && <div className="text-xs opacity-90">{cours.salle}</div>}
                                {cours.enseignant && (
                                  <div className="text-xs opacity-80">
                                    {cours.enseignant.nom}
                                  </div>
                                )}
                                
                                {(user.role === 'administrateur' || user.role === 'enseignant') && (
                                  <button
                                    onClick={() => supprimerCours(cours._id)}
                                    className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="h-full"></div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Aucun cours planifié pour {selectedClasse}</p>
              <p className="text-gray-400 text-sm mt-2">Commencez par ajouter des cours à l'emploi du temps</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des trimestres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trimestres.map((trimestre, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">{trimestre.nom}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Du:</strong> {new Date(trimestre.date_debut).toLocaleDateString('fr-FR')}</p>
                  <p><strong>Au:</strong> {new Date(trimestre.date_fin).toLocaleDateString('fr-FR')}</p>
                  {trimestre.date_debut_vacances && (
                    <p><strong>Vacances:</strong> {new Date(trimestre.date_debut_vacances).toLocaleDateString('fr-FR')} - {new Date(trimestre.date_fin_vacances).toLocaleDateString('fr-FR')}</p>
                  )}
                </div>
                <Badge variant={trimestre.actif ? "default" : "secondary"} className="mt-2">
                  {trimestre.actif ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Composant Devoirs & Ressources
const DevoirsRessourcesComponent = ({ user }) => {
  const [activeView, setActiveView] = useState('ressources');
  const [ressources, setRessources] = useState([]);
  const [devoirs, setDevoirs] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateRessource, setShowCreateRessource] = useState(false);
  const [showCreateDevoir, setShowCreateDevoir] = useState(false);
  const [showRendreDevoir, setShowRendreDevoir] = useState(false);
  const [selectedDevoir, setSelectedDevoir] = useState(null);
  
  const [ressourceFormData, setRessourceFormData] = useState({
    titre: '',
    description: '',
    type_ressource: 'lecon',
    matiere: 'none',
    classe: '6ème',
    fichier_url: null,
    fichier_nom: '',
    visible_eleves: true
  });

  const [devoirFormData, setDevoirFormData] = useState({
    titre: '',
    description: '',
    consignes: '',
    matiere: 'none',
    classe: '6ème',
    date_echeance: '',
    note_sur: 20,
    coefficient: 1.0,
    fichier_consigne_url: null
  });

  const [renduFormData, setRenduFormData] = useState({
    commentaire_eleve: '',
    fichier_rendu_url: null,
    fichier_rendu_nom: ''
  });

  const classes = ['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2', '6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Tle'];
  const typesRessource = ['lecon', 'exercice', 'support', 'video', 'document'];

  useEffect(() => {
    fetchRessources();
    fetchDevoirs();
    fetchMatieres();
  }, [activeView]);

  const fetchRessources = async () => {
    try {
      const response = await axios.get('/ressources');
      setRessources(response.data.ressources);
    } catch (error) {
      console.error('Erreur chargement ressources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDevoirs = async () => {
    try {
      let endpoint = '/devoirs';
      if (user.role === 'eleve') {
        endpoint = '/mes-devoirs';
      }
      const response = await axios.get(endpoint);
      setDevoirs(response.data.devoirs);
    } catch (error) {
      console.error('Erreur chargement devoirs:', error);
    }
  };

  const fetchMatieres = async () => {
    try {
      const response = await axios.get('/matieres');
      setMatieres(response.data.matieres);
    } catch (error) {
      console.error('Erreur chargement matières:', error);
    }
  };

  const handleCreateRessource = async (e) => {
    e.preventDefault();
    
    if (ressourceFormData.matiere === 'none') {
      toast.error('Veuillez sélectionner une matière');
      return;
    }

    try {
      // Simulation d'upload de fichier
      const ressourceData = {
        ...ressourceFormData,
        fichier_url: ressourceFormData.fichier_url ? 'https://example.com/files/ressource.pdf' : null,
        fichier_nom: ressourceFormData.fichier_nom || null,
        fichier_type: 'application/pdf',
        taille_fichier: 1024000
      };

      await axios.post('/ressources', ressourceData);
      toast.success('Ressource créée avec succès');
      setShowCreateRessource(false);
      setRessourceFormData({
        titre: '',
        description: '',
        type_ressource: 'lecon',
        matiere: 'none',
        classe: '6ème',
        fichier_url: null,
        fichier_nom: '',
        visible_eleves: true
      });
      fetchRessources();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la création');
    }
  };

  const handleCreateDevoir = async (e) => {
    e.preventDefault();
    
    if (devoirFormData.matiere === 'none') {
      toast.error('Veuillez sélectionner une matière');
      return;
    }

    try {
      const devoirData = {
        ...devoirFormData,
        note_sur: parseFloat(devoirFormData.note_sur),
        coefficient: parseFloat(devoirFormData.coefficient),
        fichier_consigne_url: devoirFormData.fichier_consigne_url ? 'https://example.com/files/consigne.pdf' : null
      };

      await axios.post('/devoirs', devoirData);
      toast.success('Devoir créé avec succès');
      setShowCreateDevoir(false);
      setDevoirFormData({
        titre: '',
        description: '',
        consignes: '',
        matiere: 'none',
        classe: '6ème',
        date_echeance: '',
        note_sur: 20,
        coefficient: 1.0,
        fichier_consigne_url: null
      });
      fetchDevoirs();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la création');
    }
  };

  const handleRendreDevoir = async (e) => {
    e.preventDefault();
    
    if (!selectedDevoir) return;

    try {
      const renduData = {
        devoir_id: selectedDevoir._id,
        ...renduFormData,
        fichier_rendu_url: renduFormData.fichier_rendu_url ? 'https://example.com/files/rendu.pdf' : null,
        fichier_rendu_type: 'application/pdf',
        taille_fichier: 512000
      };

      await axios.post(`/devoirs/${selectedDevoir._id}/rendre`, renduData);
      toast.success('Devoir rendu avec succès');
      setShowRendreDevoir(false);
      setSelectedDevoir(null);
      setRenduFormData({
        commentaire_eleve: '',
        fichier_rendu_url: null,
        fichier_rendu_nom: ''
      });
      fetchDevoirs();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors du rendu');
    }
  };

  const getTypeRessourceBadge = (type) => {
    const styles = {
      'lecon': 'bg-blue-100 text-blue-800',
      'exercice': 'bg-green-100 text-green-800',
      'support': 'bg-purple-100 text-purple-800',
      'video': 'bg-red-100 text-red-800',
      'document': 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      'lecon': 'Leçon',
      'exercice': 'Exercice', 
      'support': 'Support',
      'video': 'Vidéo',
      'document': 'Document'
    };

    return (
      <Badge className={styles[type] || styles.document}>
        {labels[type] || type}
      </Badge>
    );
  };

  const getStatutDevoir = (devoir) => {
    const aujourd = new Date();
    const echeance = new Date(devoir.date_echeance);
    
    if (user.role === 'eleve' && devoir.mon_rendu && devoir.mon_rendu.length > 0) {
      const rendu = devoir.mon_rendu[0];
      if (rendu.note !== null) {
        return <Badge className="bg-green-100 text-green-800">Noté ({rendu.note}/{devoir.note_sur})</Badge>;
      } else {
        return <Badge className="bg-blue-100 text-blue-800">Rendu</Badge>;
      }
    } else if (user.role === 'eleve') {
      if (aujourd > echeance) {
        return <Badge className="bg-red-100 text-red-800">Échéance dépassée</Badge>;
      } else {
        return <Badge className="bg-orange-100 text-orange-800">À rendre</Badge>;
      }
    }
    
    return <Badge className="bg-blue-100 text-blue-800">Assigné</Badge>;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  return (
    <div className="space-y-6" data-testid="devoirs-ressources-section">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Devoirs & Ressources</h2>
          <p className="text-gray-600 mt-2">Gestion des ressources pédagogiques et des devoirs</p>
        </div>
        
        <div className="flex space-x-2">
          {(user.role === 'administrateur' || user.role === 'enseignant') && (
            <>
              <Dialog open={showCreateRessource} onOpenChange={setShowCreateRessource}>
                <DialogTrigger asChild>
                  <Button variant="outline" data-testid="create-resource-btn">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Ressource
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Publier une ressource</DialogTitle>
                    <DialogDescription>Leçon, exercice, support de cours</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateRessource} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="titre">Titre</Label>
                      <Input
                        id="titre"
                        value={ressourceFormData.titre}
                        onChange={(e) => setRessourceFormData({...ressourceFormData, titre: e.target.value})}
                        placeholder="Titre de la ressource"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={ressourceFormData.description}
                        onChange={(e) => setRessourceFormData({...ressourceFormData, description: e.target.value})}
                        placeholder="Description de la ressource"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={ressourceFormData.type_ressource} onValueChange={(value) => setRessourceFormData({...ressourceFormData, type_ressource: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {typesRessource.map(type => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Classe</Label>
                        <Select value={ressourceFormData.classe} onValueChange={(value) => setRessourceFormData({...ressourceFormData, classe: value})}>
                          <SelectTrigger>
                            <SelectValue />
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
                      <Label>Matière</Label>
                      <Select value={ressourceFormData.matiere} onValueChange={(value) => setRessourceFormData({...ressourceFormData, matiere: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une matière" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sélectionner une matière</SelectItem>
                          {matieres.map(matiere => (
                            <SelectItem key={matiere._id} value={matiere.nom}>
                              {matiere.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fichier">Fichier (optionnel)</Label>
                      <Input
                        id="fichier"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setRessourceFormData({
                              ...ressourceFormData,
                              fichier_url: 'temp_url',
                              fichier_nom: file.name
                            });
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500">PDF, Word, Images, Vidéos (max 50MB)</p>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowCreateRessource(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Publier
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={showCreateDevoir} onOpenChange={setShowCreateDevoir}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700" data-testid="create-homework-btn">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Devoir
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Créer un devoir</DialogTitle>
                    <DialogDescription>Assigner un devoir aux élèves</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateDevoir} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="titre_devoir">Titre du devoir</Label>
                      <Input
                        id="titre_devoir"
                        value={devoirFormData.titre}
                        onChange={(e) => setDevoirFormData({...devoirFormData, titre: e.target.value})}
                        placeholder="Titre du devoir"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description_devoir">Description</Label>
                      <textarea
                        id="description_devoir"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows="3"
                        value={devoirFormData.description}
                        onChange={(e) => setDevoirFormData({...devoirFormData, description: e.target.value})}
                        placeholder="Description détaillée du devoir"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="consignes">Consignes</Label>
                      <textarea
                        id="consignes"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows="2"
                        value={devoirFormData.consignes}
                        onChange={(e) => setDevoirFormData({...devoirFormData, consignes: e.target.value})}
                        placeholder="Instructions spécifiques pour les élèves"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Matière</Label>
                        <Select value={devoirFormData.matiere} onValueChange={(value) => setDevoirFormData({...devoirFormData, matiere: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Sélectionner une matière</SelectItem>
                            {matieres.map(matiere => (
                              <SelectItem key={matiere._id} value={matiere.nom}>
                                {matiere.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Classe</Label>
                        <Select value={devoirFormData.classe} onValueChange={(value) => setDevoirFormData({...devoirFormData, classe: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map(classe => (
                              <SelectItem key={classe} value={classe}>{classe}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date_echeance">Échéance</Label>
                        <Input
                          id="date_echeance"
                          type="date"
                          value={devoirFormData.date_echeance}
                          onChange={(e) => setDevoirFormData({...devoirFormData, date_echeance: e.target.value})}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="note_sur">Note sur</Label>
                        <Input
                          id="note_sur"
                          type="number"
                          step="0.5"
                          min="1"
                          max="100"
                          value={devoirFormData.note_sur}
                          onChange={(e) => setDevoirFormData({...devoirFormData, note_sur: e.target.value})}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="coefficient_devoir">Coefficient</Label>
                        <Input
                          id="coefficient_devoir"
                          type="number"
                          step="0.5"
                          min="0.5"
                          max="5"
                          value={devoirFormData.coefficient}
                          onChange={(e) => setDevoirFormData({...devoirFormData, coefficient: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fichier_consigne">Fichier de consignes (optionnel)</Label>
                      <Input
                        id="fichier_consigne"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setDevoirFormData({
                              ...devoirFormData,
                              fichier_consigne_url: 'temp_url'
                            });
                          }
                        }}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowCreateDevoir(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        Créer Devoir
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* Navigation onglets */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ressources">Ressources Pédagogiques</TabsTrigger>
          <TabsTrigger value="devoirs">
            Devoirs
            {user.role === 'eleve' && devoirs.length > 0 && (
              <Badge variant="secondary" className="ml-2">{devoirs.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ressources">
          <Card>
            <CardHeader>
              <CardTitle>Ressources Disponibles ({ressources.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {ressources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ressources.map((ressource) => (
                    <Card key={ressource._id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium text-lg">{ressource.titre}</h3>
                            {getTypeRessourceBadge(ressource.type_ressource)}
                          </div>
                          
                          {ressource.description && (
                            <p className="text-gray-600 text-sm">{ressource.description}</p>
                          )}
                          
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Badge variant="outline">{ressource.matiere}</Badge>
                            <Badge variant="outline">{ressource.classe}</Badge>
                          </div>
                          
                          {ressource.enseignant && (
                            <p className="text-xs text-gray-500">
                              Par {ressource.enseignant.nom} {ressource.enseignant.prenoms}
                            </p>
                          )}
                          
                          {ressource.fichier_nom && (
                            <div className="flex items-center text-sm text-blue-600">
                              <FileText className="h-4 w-4 mr-1" />
                              {ressource.fichier_nom}
                            </div>
                          )}
                          
                          <p className="text-xs text-gray-400">
                            Publié le {new Date(ressource.date_publication).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Aucune ressource disponible</p>
                  {(user.role === 'administrateur' || user.role === 'enseignant') && (
                    <p className="text-gray-400 text-sm mt-2">Commencez par publier des ressources pédagogiques</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devoirs">
          <Card>
            <CardHeader>
              <CardTitle>
                {user.role === 'eleve' ? 'Mes Devoirs' : 'Devoirs Assignés'} ({devoirs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {devoirs.length > 0 ? (
                <div className="space-y-4">
                  {devoirs.map((devoir) => (
                    <Card key={devoir._id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-lg">{devoir.titre}</h3>
                            <p className="text-gray-600 text-sm mt-1">{devoir.description}</p>
                          </div>
                          {getStatutDevoir(devoir)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Matière:</span>
                            <p>{devoir.matiere}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Classe:</span>
                            <p>{devoir.classe}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Échéance:</span>
                            <p>{new Date(devoir.date_echeance).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Note sur:</span>
                            <p>{devoir.note_sur} (coef {devoir.coefficient})</p>
                          </div>
                        </div>

                        {devoir.consignes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded">
                            <p className="font-medium text-sm text-gray-700">Consignes:</p>
                            <p className="text-sm mt-1">{devoir.consignes}</p>
                          </div>
                        )}

                        {user.role === 'eleve' && (
                          <div className="mt-4 flex justify-end">
                            {(!devoir.mon_rendu || devoir.mon_rendu.length === 0) && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedDevoir(devoir);
                                  setShowRendreDevoir(true);
                                }}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Rendre le devoir
                              </Button>
                            )}
                          </div>
                        )}

                        {devoir.enseignant && (
                          <p className="text-xs text-gray-500 mt-3">
                            Assigné par {devoir.enseignant.nom} {devoir.enseignant.prenoms}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">
                    {user.role === 'eleve' ? 'Aucun devoir assigné' : 'Aucun devoir créé'}
                  </p>
                  {(user.role === 'administrateur' || user.role === 'enseignant') && (
                    <p className="text-gray-400 text-sm mt-2">Créez des devoirs pour vos élèves</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog pour rendre un devoir */}
      <Dialog open={showRendreDevoir} onOpenChange={setShowRendreDevoir}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rendre le devoir</DialogTitle>
            <DialogDescription>
              {selectedDevoir?.titre}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRendreDevoir} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fichier_rendu">Fichier de rendu</Label>
              <Input
                id="fichier_rendu"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setRenduFormData({
                      ...renduFormData,
                      fichier_rendu_url: 'temp_url',
                      fichier_rendu_nom: file.name
                    });
                  }
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commentaire_eleve">Commentaire (optionnel)</Label>
              <textarea
                id="commentaire_eleve"
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
                value={renduFormData.commentaire_eleve}
                onChange={(e) => setRenduFormData({...renduFormData, commentaire_eleve: e.target.value})}
                placeholder="Commentaire sur votre travail..."
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowRendreDevoir(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Rendre le devoir
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Composant Administration Avancée (nouvelles fonctionnalités)
const AdvancedAdministrationComponent = ({ user }) => {
  const [showImportUsers, setShowImportUsers] = useState(false);
  const [show2FAManagement, setShow2FAManagement] = useState(false);
  const [showParentChildLink, setShowParentChildLink] = useState(false);
  const [myChildren, setMyChildren] = useState([]);
  const [twoFAEnabled, setTwoFAEnabled] = useState(user.twofa_active || false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [twoFASecret, setTwoFASecret] = useState('');
  const [loading, setLoading] = useState(false);

  // États pour l'import d'utilisateurs
  const [csvFile, setCsvFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [importResults, setImportResults] = useState(null);

  // États pour la liaison parent-enfant
  const [linkFormData, setLinkFormData] = useState({
    parent_email: user.role === 'parent' ? user.email : '',
    eleve_id: '',
    relation: 'parent'
  });
  const [eleves, setEleves] = useState([]);

  // États pour la 2FA
  const [passwordFor2FA, setPasswordFor2FA] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  // Charger les enfants si l'utilisateur est un parent
  useEffect(() => {
    if (user.role === 'parent') {
      fetchMyChildren();
    }
    if (user.role === 'administrateur') {
      fetchEleves();
    }
  }, []);

  const fetchMyChildren = async () => {
    try {
      const response = await axios.get('/auth/my-children');
      setMyChildren(response.data.enfants);
    } catch (error) {
      console.error('Erreur lors du chargement des enfants:', error);
    }
  };

  const fetchEleves = async () => {
    try {
      const response = await axios.get('/eleves');
      setEleves(response.data.eleves);
    } catch (error) {
      console.error('Erreur lors du chargement des élèves:', error);
    }
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      // Simuler la prévisualisation (dans un vrai projet, on analyserait le CSV)
      setImportPreview([
        { email: 'enseignant1@exemple.com', nom: 'Doe', prenoms: 'John', role: 'enseignant' },
        { email: 'parent1@exemple.com', nom: 'Smith', prenoms: 'Jane', role: 'parent' }
      ]);
    } else {
      toast.error('Veuillez sélectionner un fichier CSV valide');
    }
  };

  const handleImportUsers = async () => {
    if (!csvFile || importPreview.length === 0) {
      toast.error('Aucun fichier CSV valide sélectionné');
      return;
    }

    setLoading(true);
    try {
      // Simuler l'import pour la démo - dans un vrai projet on enverrait le fichier
      const usersData = importPreview.map(user => ({
        ...user,
        mot_de_passe_temporaire: Math.random().toString(36).slice(-8)
      }));

      const response = await axios.post('/auth/import-users', usersData);
      setImportResults(response.data);
      toast.success(`Import terminé: ${response.data.details.success} utilisateurs créés`);
      setCsvFile(null);
      setImportPreview([]);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'import');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkParentChild = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/auth/link-parent-child', linkFormData);
      toast.success('Liaison parent-enfant créée avec succès!');
      setShowParentChildLink(false);
      if (user.role === 'parent') {
        fetchMyChildren();
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la liaison');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/auth/enable-2fa', {
        mot_de_passe: passwordFor2FA
      });
      
      setQrCodeUrl(response.data.qr_url);
      setTwoFASecret(response.data.secret_2fa);
      toast.success('Secret 2FA généré! Scannez le QR code.');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'activation');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm2FA = async () => {
    setLoading(true);
    try {
      await axios.post('/auth/confirm-2fa', {
        code_secret: twoFASecret,
        code_verification: verificationCode
      });
      
      setTwoFAEnabled(true);
      toast.success('2FA activée avec succès!');
      setShow2FAManagement(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Code incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setLoading(true);
    try {
      await axios.post('/auth/disable-2fa', {
        code_2fa: verificationCode
      });
      
      setTwoFAEnabled(false);
      toast.success('2FA désactivée avec succès!');
      setShow2FAManagement(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Code incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Import/Export et Gestion des utilisateurs */}
      {user.role === 'administrateur' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2 text-green-600" />
              Gestion des Utilisateurs
            </CardTitle>
            <CardDescription>
              Import en masse et gestion des comptes utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dialog open={showImportUsers} onOpenChange={setShowImportUsers}>
                <DialogTrigger asChild>
                  <Button className="h-16 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700">
                    <Upload className="h-6 w-6 mb-1" />
                    <span>Import Utilisateurs (CSV)</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Import d'utilisateurs depuis CSV</DialogTitle>
                    <DialogDescription>
                      Importez plusieurs utilisateurs en une seule fois
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="csv_file">Fichier CSV</Label>
                      <Input
                        id="csv_file"
                        type="file"
                        accept=".csv"
                        onChange={handleCSVUpload}
                      />
                      <p className="text-xs text-gray-500">
                        Format: email,nom,prenoms,role,telephone
                      </p>
                    </div>

                    {importPreview.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Aperçu ({importPreview.length} utilisateurs)</h4>
                        <div className="max-h-40 overflow-y-auto border rounded p-2">
                          {importPreview.map((user, index) => (
                            <div key={index} className="text-sm p-2 border-b">
                              {user.email} - {user.nom} {user.prenoms} ({user.role})
                            </div>
                          ))}
                        </div>
                        
                        <Button 
                          onClick={handleImportUsers}
                          disabled={loading}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          {loading ? 'Import en cours...' : 'Confirmer l\'import'}
                        </Button>
                      </div>
                    )}

                    {importResults && (
                      <div className="bg-green-50 border border-green-200 rounded p-4">
                        <h4 className="font-medium text-green-800">Résultats de l'import</h4>
                        <p className="text-sm text-green-700">
                          Succès: {importResults.details.success} / {importResults.details.total}
                        </p>
                        {importResults.details.errors.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-red-700">Erreurs:</p>
                            {importResults.details.errors.slice(0, 3).map((err, i) => (
                              <p key={i} className="text-xs text-red-600">
                                Ligne {err.ligne}: {err.erreur}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showParentChildLink} onOpenChange={setShowParentChildLink}>
                <DialogTrigger asChild>
                  <Button className="h-16 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700">
                    <Link className="h-6 w-6 mb-1" />
                    <span>Lier Parent-Enfant</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Liaison Parent-Enfant</DialogTitle>
                    <DialogDescription>
                      Créer un lien entre un parent et un élève
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleLinkParentChild} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="parent_email">Email du parent</Label>
                      <Input
                        id="parent_email"
                        type="email"
                        value={linkFormData.parent_email}
                        onChange={(e) => setLinkFormData({...linkFormData, parent_email: e.target.value})}
                        placeholder="parent@exemple.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Élève</Label>
                      <Select 
                        value={linkFormData.eleve_id} 
                        onValueChange={(value) => setLinkFormData({...linkFormData, eleve_id: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un élève" />
                        </SelectTrigger>
                        <SelectContent>
                          {eleves.map(eleve => (
                            <SelectItem key={eleve._id} value={eleve._id}>
                              {eleve.nom} {eleve.prenoms} ({eleve.classe})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Relation</Label>
                      <Select 
                        value={linkFormData.relation} 
                        onValueChange={(value) => setLinkFormData({...linkFormData, relation: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="tuteur">Tuteur</SelectItem>
                          <SelectItem value="responsable">Responsable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Création...' : 'Créer la liaison'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 2FA pour tous les utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-purple-600" />
            Authentification à Deux Facteurs (2FA)
          </CardTitle>
          <CardDescription>
            Renforcez la sécurité de votre compte avec la 2FA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                2FA: {twoFAEnabled ? 'Activée' : 'Désactivée'}
              </p>
              <p className="text-sm text-gray-600">
                {twoFAEnabled 
                  ? 'Votre compte est protégé par la 2FA' 
                  : 'Activez la 2FA pour plus de sécurité'
                }
              </p>
            </div>
            
            <Dialog open={show2FAManagement} onOpenChange={setShow2FAManagement}>
              <DialogTrigger asChild>
                <Button variant={twoFAEnabled ? "destructive" : "default"}>
                  {twoFAEnabled ? 'Désactiver 2FA' : 'Activer 2FA'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {twoFAEnabled ? 'Désactiver la 2FA' : 'Activer la 2FA'}
                  </DialogTitle>
                  <DialogDescription>
                    {twoFAEnabled 
                      ? 'Entrez un code 2FA pour désactiver'
                      : 'Configurez l\'authentification à deux facteurs'
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {!twoFAEnabled ? (
                    <>
                      {!qrCodeUrl ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="password_2fa">Mot de passe actuel</Label>
                            <Input
                              id="password_2fa"
                              type="password"
                              value={passwordFor2FA}
                              onChange={(e) => setPasswordFor2FA(e.target.value)}
                              placeholder="Votre mot de passe"
                            />
                          </div>
                          <Button onClick={handleEnable2FA} disabled={loading}>
                            {loading ? 'Génération...' : 'Générer le code 2FA'}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="text-center">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
                              alt="QR Code 2FA"
                              className="mx-auto border rounded"
                            />
                            <p className="text-sm text-gray-600 mt-2">
                              Scannez avec Google Authenticator ou une app similaire
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="verification_code">Code de vérification</Label>
                            <Input
                              id="verification_code"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              placeholder="123456"
                              maxLength="6"
                            />
                          </div>
                          
                          <Button onClick={handleConfirm2FA} disabled={loading}>
                            {loading ? 'Vérification...' : 'Confirmer l\'activation'}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="disable_code">Code 2FA</Label>
                        <Input
                          id="disable_code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="123456"
                          maxLength="6"
                        />
                      </div>
                      <Button onClick={handleDisable2FA} disabled={loading} variant="destructive">
                        {loading ? 'Désactivation...' : 'Désactiver la 2FA'}
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Mes enfants (pour les parents) */}
      {user.role === 'parent' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Mes Enfants ({myChildren.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myChildren.length > 0 ? (
              <div className="space-y-3">
                {myChildren.map((child) => (
                  <div key={child._id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">
                        {child.eleve.nom} {child.eleve.prenoms}
                      </p>
                      <p className="text-sm text-gray-600">
                        {child.eleve.classe} - Matricule: {child.eleve.matricule}
                      </p>
                    </div>
                    <Badge variant="outline">{child.relation}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Aucun enfant lié à votre compte</p>
                <p className="text-sm text-gray-400 mt-1">
                  Contactez l'administration pour lier votre enfant
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Composant Administration (réservé aux administrateurs)
const AdministrationComponent = ({ user }) => {
  const [codeGenere, setCodeGenere] = useState(null);
  const [loading, setLoading] = useState(false);

  const genererCodeAdmin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/admin/generer-code-admin');
      setCodeGenere(response.data);
      toast.success('Code administrateur généré avec succès!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la génération du code');
    } finally {
      setLoading(false);
    }
  };

  const copierCode = () => {
    if (codeGenere) {
      navigator.clipboard.writeText(codeGenere.code_temporaire);
      toast.success('Code copié dans le presse-papier!');
    }
  };

  return (
    <div className="space-y-6" data-testid="admin-section">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Administration</h2>
        <p className="text-gray-600 mt-2">Outils de gestion et configuration système</p>
      </div>

      {/* Génération de codes administrateur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
            Gestion des Codes Administrateur
          </CardTitle>
          <CardDescription>
            Générez des codes temporaires pour permettre la création de nouveaux comptes administrateurs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Sécurité</p>
                <p className="text-yellow-700 mt-1">
                  Les codes générés sont valides pendant 1 heure et ne peuvent être utilisés qu'une seule fois.
                </p>
              </div>
            </div>
          </div>

          <Button 
            onClick={genererCodeAdmin}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700"
            data-testid="generate-admin-code-btn"
          >
            {loading ? 'Génération...' : 'Générer un Code Administrateur'}
          </Button>

          {codeGenere && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-green-800">Code Administrateur Généré</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        value={codeGenere.code_temporaire}
                        readOnly
                        className="font-mono text-sm bg-white border-green-300"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copierCode}
                        className="border-green-300 text-green-700 hover:bg-green-100"
                      >
                        Copier
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-green-800">Valide jusqu'à:</span>
                      <p className="text-green-700">
                        {new Date(codeGenere.valide_jusqu).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-green-800">Durée:</span>
                      <p className="text-green-700">{codeGenere.duree_validite}</p>
                    </div>
                  </div>

                  <div className="text-xs text-green-600 bg-green-100 p-2 rounded">
                    {codeGenere.message}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Cliquez sur "Générer un Code Administrateur"</li>
              <li>Copiez le code généré</li>
              <li>Transmettez le code à la personne qui doit créer un compte administrateur</li>
              <li>Le code doit être utilisé dans l'heure qui suit sa génération</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Codes fixes disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>Codes Administrateur Fixes</CardTitle>
          <CardDescription>Codes permanents pour la création d'administrateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <code className="font-mono">ADMIN_ECOLE_2024</code>
              <Badge variant="outline">Permanent</Badge>
            </div>
            <p className="text-gray-600 text-xs mt-2">
              Ce code peut être utilisé de façon permanente pour créer des comptes administrateurs. 
              Conservez-le en sécurité.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Nouvelles fonctionnalités d'administration */}
      <AdvancedAdministrationComponent user={user} />
    </div>
  );
};

// Composant de bienvenue pour nouveaux utilisateurs
const WelcomeGuide = ({ user, onClose }) => {
  const getWelcomeContent = () => {
    switch(user.role) {
      case 'administrateur':
        return {
          title: '👨‍💼 Bienvenue, Administrateur !',
          steps: [
            'Gérez les utilisateurs depuis la section Administration',
            'Créez des matières et configurez les classes',
            'Supervisez les factures et paiements',
            'Générez des rapports et statistiques'
          ]
        };
      case 'enseignant':
        return {
          title: '👨‍🏫 Bienvenue, Enseignant !',
          steps: [
            'Consultez vos élèves dans la section Élèves',
            'Saisissez les notes dans Notes & Moyennes',
            'Créez des devoirs et ressources pédagogiques',
            'Gérez les présences de vos élèves'
          ]
        };
      case 'parent':
        return {
          title: '👨‍👩‍👧‍👦 Bienvenue, Parent !',
          steps: [
            'Consultez les bulletins de vos enfants',
            'Suivez les devoirs et ressources',
            'Vérifiez les factures et paiements',
            'Contactez les enseignants via la messagerie'
          ]
        };
      case 'eleve':
        return {
          title: '👨‍🎓 Bienvenue, Élève !',
          steps: [
            'Consultez vos notes et moyennes',
            'Téléchargez vos bulletins',
            'Accédez à vos devoirs et ressources',
            'Vérifiez votre emploi du temps'
          ]
        };
      default:
        return {
          title: '🎉 Bienvenue dans École Smart !',
          steps: ['Explorez les différentes fonctionnalités de la plateforme']
        };
    }
  };

  const content = getWelcomeContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{content.title}</CardTitle>
          <CardDescription>
            Découvrez comment utiliser École Smart
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="font-medium text-sm">Prochaines étapes :</p>
            <ul className="space-y-2">
              {content.steps.map((step, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-700 text-center">
              ✅ Votre compte a été créé avec succès !<br/>
              Vous êtes maintenant connecté(e) à École Smart.
            </p>
          </div>
          
          <Button 
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Commencer à utiliser École Smart
          </Button>
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
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'login', 'preregistration'

  useEffect(() => {
    const processGoogleAuth = async () => {
      // Vérifier s'il y a un session_id dans le fragment URL (retour Google)
      const urlFragment = window.location.hash;
      const sessionIdMatch = urlFragment.match(/session_id=([^&]+)/);
      
      if (sessionIdMatch) {
        const sessionId = sessionIdMatch[1];
        setLoading(true);
        
        try {
          console.log('Traitement session Google...', sessionId);
          
          // Appeler notre API pour traiter la session Google
          const response = await axios.post('/auth/google/session', {
            session_id: sessionId
          });
          
          if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            
            setUser(response.data.user);
            
            // Nettoyer l'URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
            console.log('Connexion Google réussie!');
          }
        } catch (error) {
          console.error('Erreur authentification Google:', error);
          // Nettoyer l'URL même en cas d'erreur
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        setLoading(false);
        return;
      }
      
      // Vérification du token existant au démarrage
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
    };
    
    processGoogleAuth();
  }, []);

  const handleAuthSuccess = (userData, isNewRegistration = false) => {
    setUser(userData);
    // Afficher le guide de bienvenue pour les nouvelles inscriptions
    if (isNewRegistration) {
      setShowWelcomeGuide(true);
    }
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

  // Navigation pour les utilisateurs non connectés
  if (!user) {
    switch(currentPage) {
      case 'login':
        return (
          <AuthComponent 
            onAuthSuccess={handleAuthSuccess}
            onBack={() => setCurrentPage('landing')}
          />
        );
      case 'preregistration':
        return (
          <PreRegistrationPage
            onBack={() => setCurrentPage('landing')}
            onNavigateToLogin={() => setCurrentPage('login')}
          />
        );
      case 'landing':
      default:
        return (
          <PublicLandingPage
            onNavigateToLogin={() => setCurrentPage('login')}
            onNavigateToPreRegistration={() => setCurrentPage('preregistration')}
          />
        );
    }
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
          {activeTab === 'dashboard' && <Dashboard user={user} />}
          {activeTab === 'eleves' && <ElevesComponent user={user} />}
          {activeTab === 'notes' && <NotesComponent user={user} />}
          {activeTab === 'bulletins' && <BulletinsComponent user={user} />}
          {activeTab === 'devoirs-ressources' && <DevoirsRessourcesComponent user={user} />}
          {activeTab === 'emplois-du-temps' && <EmploisDuTempsComponent user={user} />}
          {activeTab === 'calendrier' && <CalendrierComponent user={user} />}
          {activeTab === 'factures' && <FacturesComponent user={user} />}
          {activeTab === 'paiements' && <PaiementsComponent user={user} />}
          {activeTab === 'presences' && <PresencesComponent user={user} />}
          {activeTab === 'admin' && user.role === 'administrateur' && <AdministrationComponent user={user} />}
        </main>
      </div>
      
      {/* Guide de bienvenue pour nouveaux utilisateurs */}
      {showWelcomeGuide && (
        <WelcomeGuide 
          user={user} 
          onClose={() => setShowWelcomeGuide(false)} 
        />
      )}
      
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
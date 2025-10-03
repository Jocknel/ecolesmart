const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex items-center">
                <div className="text-blue-400 mr-3">ℹ️</div>
                <div>
                  <p className="text-blue-800 font-medium">Informations importantes</p>
                  <p className="text-blue-600 text-sm">Assurez-vous que toutes les informations sont exactes selon les documents officiels.</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nom_eleve">Nom de famille *</Label>
                <Input
                  id="nom_eleve"
                  value={formData.nom_eleve}
                  onChange={(e) => handleInputChange('nom_eleve', e.target.value)}
                  placeholder="ex: DIALLO"
                  className={fieldErrors.nom_eleve ? 'border-red-500' : ''}
                />
                {fieldErrors.nom_eleve && (
                  <p className="text-sm text-red-500 flex items-center"><span className="mr-1">⚠️</span>{fieldErrors.nom_eleve}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prenoms_eleve">Prénoms *</Label>
                <Input
                  id="prenoms_eleve"
                  value={formData.prenoms_eleve}
                  onChange={(e) => handleInputChange('prenoms_eleve', e.target.value)}
                  placeholder="ex: Aminata Mariama"
                  className={fieldErrors.prenoms_eleve ? 'border-red-500' : ''}
                />
                {fieldErrors.prenoms_eleve && (
                  <p className="text-sm text-red-500 flex items-center"><span className="mr-1">⚠️</span>{fieldErrors.prenoms_eleve}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date_naissance">Date de naissance *</Label>
                <Input
                  id="date_naissance"
                  type="date"
                  value={formData.date_naissance}
                  onChange={(e) => handleInputChange('date_naissance', e.target.value)}
                  className={fieldErrors.date_naissance ? 'border-red-500' : ''}
                />
                {formData.date_naissance && (
                  <p className="text-sm text-green-600">
                    ✅ Âge: {calculateAge(formData.date_naissance)} ans
                  </p>
                )}
                {fieldErrors.date_naissance && (
                  <p className="text-sm text-red-500 flex items-center"><span className="mr-1">⚠️</span>{fieldErrors.date_naissance}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sexe">Sexe *</Label>
                <Select value={formData.sexe} onValueChange={(value) => handleInputChange('sexe', value)}>
                  <SelectTrigger className={fieldErrors.sexe ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.sexe && (
                  <p className="text-sm text-red-500 flex items-center"><span className="mr-1">⚠️</span>{fieldErrors.sexe}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalite">Nationalité</Label>
                <Select value={formData.nationalite} onValueChange={(value) => handleInputChange('nationalite', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Guinéenne">Guinéenne</SelectItem>
                    <SelectItem value="Sénégalaise">Sénégalaise</SelectItem>
                    <SelectItem value="Malienne">Malienne</SelectItem>
                    <SelectItem value="Ivoirienne">Ivoirienne</SelectItem>
                    <SelectItem value="Française">Française</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lieu_naissance">Lieu de naissance *</Label>
              <Input
                id="lieu_naissance"
                value={formData.lieu_naissance}
                onChange={(e) => handleInputChange('lieu_naissance', e.target.value)}
                placeholder="ex: Conakry, Guinée"
                className={fieldErrors.lieu_naissance ? 'border-red-500' : ''}
              />
              {fieldErrors.lieu_naissance && (
                <p className="text-sm text-red-500 flex items-center"><span className="mr-1">⚠️</span>{fieldErrors.lieu_naissance}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex items-center">
                <div className="text-green-400 mr-3">🎓</div>
                <div>
                  <p className="text-green-800 font-medium">Choisissez le niveau adapté</p>
                  <p className="text-green-600 text-sm">Les frais de scolarité varient selon le niveau sélectionné.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="niveau_souhaite">Niveau souhaité pour 2024-2025 *</Label>
              <Select value={formData.niveau_souhaite} onValueChange={(value) => handleInputChange('niveau_souhaite', value)}>
                <SelectTrigger className={fieldErrors.niveau_souhaite ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Choisir le niveau d'inscription" />
                </SelectTrigger>
                <SelectContent>
                  {niveauxDisponibles.map((niveau) => (
                    <SelectItem key={niveau.value} value={niveau.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{niveau.label}</span>
                        <span className="text-green-600 font-semibold ml-4">{niveau.prix} GNF/an</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.niveau_souhaite && (
                <p className="text-sm text-red-500 flex items-center"><span className="mr-1">⚠️</span>{fieldErrors.niveau_souhaite}</p>
              )}
              {formData.niveau_souhaite && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    💰 Frais de scolarité: {niveauxDisponibles.find(n => n.value === formData.niveau_souhaite)?.prix} GNF/an
                  </p>
                  <p className="text-blue-600 text-sm">Possibilité de paiement en 3 tranches</p>
                </div>
              )}
            </div>

            {(formData.niveau_souhaite === '1ère' || formData.niveau_souhaite === 'Tle') && (
              <div className="space-y-2">
                <Label htmlFor="serie_bac">Série BAC souhaitée</Label>
                <Select value={formData.serie_bac} onValueChange={(value) => handleInputChange('serie_bac', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir la série" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sciences">Sciences Expérimentales</SelectItem>
                    <SelectItem value="Maths">Mathématiques</SelectItem>
                    <SelectItem value="Lettres">Lettres Modernes</SelectItem>
                    <SelectItem value="SES">Sciences Économiques et Sociales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="etablissement_actuel">Établissement actuel *</Label>
                <Input
                  id="etablissement_actuel"
                  value={formData.etablissement_actuel}
                  onChange={(e) => handleInputChange('etablissement_actuel', e.target.value)}
                  placeholder="ex: Collège Moderne de Kaloum"
                  className={fieldErrors.etablissement_actuel ? 'border-red-500' : ''}
                />
                {fieldErrors.etablissement_actuel && (
                  <p className="text-sm text-red-500 flex items-center"><span className="mr-1">⚠️</span>{fieldErrors.etablissement_actuel}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="niveau_actuel">Niveau actuel (2023-2024)</Label>
                <Input
                  id="niveau_actuel"
                  value={formData.niveau_actuel}
                  onChange={(e) => handleInputChange('niveau_actuel', e.target.value)}
                  placeholder="ex: 3ème"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="moyenne_generale">Moyenne générale actuelle (sur 20)</Label>
              <Input
                id="moyenne_generale"
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={formData.moyenne_generale}
                onChange={(e) => handleInputChange('moyenne_generale', e.target.value)}
                placeholder="ex: 14.5"
                className={fieldErrors.moyenne_generale ? 'border-red-500' : ''}
              />
              {fieldErrors.moyenne_generale && (
                <p className="text-sm text-red-500 flex items-center"><span className="mr-1">⚠️</span>{fieldErrors.moyenne_generale}</p>
              )}
              {formData.moyenne_generale && (
                <p className="text-sm text-blue-600">
                  {parseFloat(formData.moyenne_generale) >= 16 ? '🌟 Excellent niveau!' :
                   parseFloat(formData.moyenne_generale) >= 14 ? '✅ Très bon niveau' :
                   parseFloat(formData.moyenne_generale) >= 12 ? '👍 Bon niveau' :
                   parseFloat(formData.moyenne_generale) >= 10 ? '📚 Niveau satisfaisant' :
                   '💪 Nous vous aiderons à progresser!'}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6">
              <div className="flex items-center">
                <div className="text-purple-400 mr-3">👨‍👩‍👧‍👦</div>
                <div>
                  <p className="text-purple-800 font-medium">Responsable légal</p>
                  <p className="text-purple-600 text-sm">Ces informations sont essentielles pour la communication et les urgences.</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nom_parent">Nom du parent/tuteur *</Label>
                <Input
                  id="nom_parent"
                  value={formData.nom_parent}
                  onChange={(e) => handleInputChange('nom_parent', e.target.value)}
                  placeholder="ex: BARRY"
                  className={fieldErrors.nom_parent ? 'border-red-500' : ''}
                />
                {fieldErrors.nom_parent && (
                  <p className="text-sm text-red-500 flex items-center"><span className="mr-1">⚠️</span>{fieldErrors.nom_parent}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="prenoms_parent">Prénoms du parent/tuteur *</Label>
                <Input
                  id="prenoms_parent"
                  value={formData.prenoms_parent}
                  onChange={(e) => handleInputChange('prenoms_parent', e.target.value)}
                  placeholder="ex: Mamadou Alpha"
                  className={fieldErrors.prenoms_parent ? 'border-red-500' : ''}
                />
                {fieldErrors.prenoms_parent && (
                  <p className="text-sm text-red-500 flex items-center"><span className="mr-1">⚠️</span>{fieldErrors.prenoms_parent}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession_parent">Profession</Label>
              <Input
                id="profession_parent"
                value={formData.profession_parent}
                onChange={(e) => handleInputChange('profession_parent', e.target.value)}
                placeholder="ex: Médecin, Enseignant, Commerçant, etc."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="telephone_parent">Téléphone principal *</Label>
                <Input
                  id="telephone_parent"
                  type="tel"
                  value={formData.telephone_parent}
                  onChange={(e) => handleInputChange('telephone_parent', e.target.value)}
                  placeholder="+224 6XX XXX XXX"
                  className={fieldErrors.telephone_parent ? 'border-red-500' : ''}
                />
                {fieldErrors.telephone_parent && (
                  <p className="text-sm text-red-500 flex items-center"><span className="mr-1">⚠️</span>{fieldErrors.telephone_parent}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email_parent">Email du parent</Label>
                <Input
                  id="email_parent"
                  type="email"
                  value={formData.email_parent}
                  onChange={(e) => handleInputChange('email_parent', e.target.value)}
                  placeholder="email@exemple.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse_parent">Adresse complète *</Label>
              <textarea
                id="adresse_parent"
                value={formData.adresse_parent}
                onChange={(e) => handleInputChange('adresse_parent', e.target.value)}
                placeholder="Quartier, commune, préfecture... (adresse complète pour les correspondances)"
                rows="3"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.adresse_parent ? 'border-red-500' : 'border-gray-300'
                }`}
              ></textarea>
              {fieldErrors.adresse_parent && (
                <p className="text-sm text-red-500 flex items-center"><span className="mr-1">⚠️</span>{fieldErrors.adresse_parent}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
              <div className="flex items-center">
                <div className="text-orange-400 mr-3">📱</div>
                <div>
                  <p className="text-orange-800 font-medium">Contacts et services scolaires</p>
                  <p className="text-orange-600 text-sm">Configurez la communication et choisissez les services additionnels.</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email de l'élève *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="eleve@exemple.com"
                  className={fieldErrors.email ? 'border-red-500' : ''}
                />
                <p className="text-xs text-gray-500">Sera utilisé pour l'accès à la plateforme numérique</p>
                {fieldErrors.email && (
                  <p className="text-sm text-red-500 flex items-center"><span className="mr-1">⚠️</span>{fieldErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone de l'élève *</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  placeholder="+224 6XX XXX XXX"
                  className={fieldErrors.telephone ? 'border-red-500' : ''}
                />
                {fieldErrors.telephone && (
                  <p className="text-sm text-red-500 flex items-center"><span className="mr-1">⚠️</span>{fieldErrors.telephone}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Options de transport</h4>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="transport"
                    value="personnel"
                    checked={formData.transport === 'personnel'}
                    onChange={(e) => handleInputChange('transport', e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">🚗 Transport personnel</div>
                    <div className="text-sm text-gray-600">L'élève vient par ses propres moyens</div>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="transport"
                    value="bus_scolaire"
                    checked={formData.transport === 'bus_scolaire'}
                    onChange={(e) => handleInputChange('transport', e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">🚌 Bus scolaire</div>
                    <div className="text-sm text-gray-600">+200 000 GNF/an</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Services additionnels</h4>
              
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.cantine}
                  onChange={(e) => handleInputChange('cantine', e.target.checked)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">🍽️ Cantine scolaire</div>
                  <div className="text-sm text-gray-600">Repas équilibrés préparés sur place (+300 000 GNF/an)</div>
                </div>
              </label>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Activités extrascolaires (optionnel)</h4>
              <p className="text-sm text-gray-600">Sélectionnez jusqu'à 3 activités qui intéressent l'élève</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {activitesExtrascolaires.map((activite) => (
                  <label
                    key={activite}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer text-sm transition-colors ${
                      formData.activites_extra.includes(activite)
                        ? 'bg-blue-50 border-blue-300'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.activites_extra.includes(activite)}
                      onChange={() => handleActivityToggle(activite)}
                      disabled={formData.activites_extra.length >= 3 && !formData.activites_extra.includes(activite)}
                      className="mr-2"
                    />
                    {activite}
                  </label>
                ))}
              </div>
              
              {formData.activites_extra.length > 0 && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-800 text-sm">
                    ✅ Activités sélectionnées: {formData.activites_extra.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex items-center">
                <div className="text-green-400 mr-3">🎯</div>
                <div>
                  <p className="text-green-800 font-medium">Dernière étape!</p>
                  <p className="text-green-600 text-sm">Vérifiez vos informations et finalisez votre pré-inscription.</p>
                </div>
              </div>
            </div>

            {/* Récapitulatif */}
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">📋 Récapitulatif de votre pré-inscription</h3>
                
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">👤 Élève</h4>
                    <div className="space-y-1">
                      <div><strong>Nom complet:</strong> {formData.nom_eleve} {formData.prenoms_eleve}</div>
                      <div><strong>Date de naissance:</strong> {formData.date_naissance} ({formData.date_naissance && calculateAge(formData.date_naissance)} ans)</div>
                      <div><strong>Sexe:</strong> {formData.sexe === 'M' ? 'Masculin' : 'Féminin'}</div>
                      <div><strong>Lieu de naissance:</strong> {formData.lieu_naissance}</div>
                      <div><strong>Nationalité:</strong> {formData.nationalite}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">🎓 Scolarité</h4>
                    <div className="space-y-1">
                      <div><strong>Niveau souhaité:</strong> {formData.niveau_souhaite}</div>
                      {formData.serie_bac && <div><strong>Série BAC:</strong> {formData.serie_bac}</div>}
                      <div><strong>Établissement actuel:</strong> {formData.etablissement_actuel}</div>
                      {formData.moyenne_generale && <div><strong>Moyenne générale:</strong> {formData.moyenne_generale}/20</div>}
                      {formData.niveau_souhaite && (
                        <div className="text-green-600 font-medium">
                          <strong>Frais:</strong> {niveauxDisponibles.find(n => n.value === formData.niveau_souhaite)?.prix} GNF/an
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">👨‍👩‍👧‍👦 Responsable légal</h4>
                    <div className="space-y-1">
                      <div><strong>Nom:</strong> {formData.nom_parent} {formData.prenoms_parent}</div>
                      {formData.profession_parent && <div><strong>Profession:</strong> {formData.profession_parent}</div>}
                      <div><strong>Téléphone:</strong> {formData.telephone_parent}</div>
                      {formData.email_parent && <div><strong>Email:</strong> {formData.email_parent}</div>}
                      <div><strong>Adresse:</strong> {formData.adresse_parent}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">📱 Contacts & Services</h4>
                    <div className="space-y-1">
                      <div><strong>Email élève:</strong> {formData.email}</div>
                      <div><strong>Téléphone élève:</strong> {formData.telephone}</div>
                      <div><strong>Transport:</strong> {formData.transport === 'personnel' ? 'Transport personnel' : 'Bus scolaire (+200 000 GNF)'}</div>
                      <div><strong>Cantine:</strong> {formData.cantine ? 'Oui (+300 000 GNF/an)' : 'Non'}</div>
                      {formData.activites_extra.length > 0 && (
                        <div><strong>Activités:</strong> {formData.activites_extra.join(', ')}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Coût total estimé */}
                <div className="mt-6 p-4 bg-white rounded-lg border-2 border-green-200">
                  <h4 className="font-bold text-green-800 mb-2">💰 Estimation des frais annuels</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Frais de scolarité:</span>
                      <span className="font-medium">{formData.niveau_souhaite ? niveauxDisponibles.find(n => n.value === formData.niveau_souhaite)?.prix : '0'} GNF</span>
                    </div>
                    {formData.transport === 'bus_scolaire' && (
                      <div className="flex justify-between">
                        <span>Transport scolaire:</span>
                        <span className="font-medium">200 000 GNF</span>
                      </div>
                    )}
                    {formData.cantine && (
                      <div className="flex justify-between">
                        <span>Cantine:</span>
                        <span className="font-medium">300 000 GNF</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-bold text-green-800">
                      <span>Total estimé:</span>
                      <span>
                        {(() => {
                          let total = formData.niveau_souhaite 
                            ? parseInt(niveauxDisponibles.find(n => n.value === formData.niveau_souhaite)?.prix.replace(/\s/g, '') || '0')
                            : 0;
                          if (formData.transport === 'bus_scolaire') total += 200000;
                          if (formData.cantine) total += 300000;
                          return total.toLocaleString();
                        })()} GNF
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents requis */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">📄 Documents à fournir lors de l'inscription</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Documents élève:</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Acte de naissance (original + copie)</li>
                      <li>• Certificat médical récent</li>
                      <li>• 4 photos d'identité récentes</li>
                      <li>• Bulletins de l'année précédente</li>
                      <li>• Certificat de scolarité</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Documents parent/tuteur:</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Pièce d'identité (CNI/Passeport)</li>
                      <li>• Justificatif de domicile récent</li>
                      <li>• Attestation de travail/revenus</li>
                      <li>• Fiche de renseignements médicaux</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conditions générales */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">📜 Conditions générales</h4>
                
                <div className="space-y-3 text-sm text-gray-700 max-h-48 overflow-y-auto">
                  <p><strong>1. Inscription:</strong> Cette pré-inscription est valable pour l'année scolaire 2024-2025. L'inscription définitive sera confirmée après étude du dossier et entretien.</p>
                  
                  <p><strong>2. Paiement:</strong> Les frais de scolarité peuvent être payés en 3 tranches (inscription, 1er trimestre, 2ème trimestre). Un acompte de 30% est requis à l'inscription.</p>
                  
                  <p><strong>3. Règlement intérieur:</strong> L'élève et sa famille s'engagent à respecter le règlement intérieur de l'établissement.</p>
                  
                  <p><strong>4. Assiduité:</strong> La présence aux cours est obligatoire. Toute absence doit être justifiée.</p>
                  
                  <p><strong>5. Communication:</strong> Les parents s'engagent à maintenir une communication régulière avec l'établissement via la plateforme numérique.</p>
                  
                  <p><strong>6. Résiliation:</strong> En cas de départ en cours d'année, un préavis d'un mois est requis. Les frais du trimestre entamé restent dus.</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.accepte_conditions}
                    onChange={(e) => handleInputChange('accepte_conditions', e.target.checked)}
                    className="mt-1"
                  />
                  <span className={`text-sm ${fieldErrors.accepte_conditions ? 'text-red-600' : 'text-gray-700'}`}>
                    <strong>J'accepte les conditions générales</strong> et autorise le traitement des données personnelles 
                    dans le cadre de cette pré-inscription. *
                  </span>
                </label>
                
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autorisation_photo}
                    onChange={(e) => handleInputChange('autorisation_photo', e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    J'autorise l'établissement à prendre et utiliser des photos de l'élève pour les activités pédagogiques et la communication de l'école.
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    Je souhaite recevoir les actualités et informations importantes de l'établissement par email.
                  </span>
                </label>
              </div>

              {fieldErrors.accepte_conditions && (
                <p className="text-sm text-red-500 flex items-center"><span className="mr-1">⚠️</span>{fieldErrors.accepte_conditions}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };
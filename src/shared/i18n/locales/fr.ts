/**
 * Locale resources as a TypeScript module — deliberately NOT .json.
 *
 * Metro served stale cached JSON modules while happily picking up .ts edits in
 * this same folder, so any newly added key rendered as a raw key on device until
 * a --reset-cache. That cost several debugging rounds. Keeping locales as .ts
 * puts them on the module path that reliably reloads.
 *
 * DO NOT convert these back to .json.
 *
 * en.ts is the source of truth for the key shape (see i18n.d.ts); fr.ts must
 * mirror it exactly — __tests__/i18n.test.ts enforces that.
 */
export default {
  "common": {
    "ok": "OK",
    "cancel": "Annuler",
    "save": "Enregistrer",
    "submit": "Envoyer",
    "send": "Envoyer",
    "close": "Fermer",
    "retry": "Réessayer",
    "error": "Erreur",
    "success": "Succès",
    "successExclaim": "Succès !",
    "done": "Terminé",
    "edit": "Modifier",
    "delete": "Supprimer",
    "loading": "Chargement...",
    "sending": "Envoi...",
    "submitting": "Envoi en cours...",
    "somethingWentWrong": "Une erreur est survenue",
    "tryAgain": "Une erreur est survenue. Veuillez réessayer.",
    "or": " ou ",
    "months": {
      "january": "janvier",
      "february": "février",
      "march": "mars",
      "april": "avril",
      "may": "mai",
      "june": "juin",
      "july": "juillet",
      "august": "août",
      "september": "septembre",
      "october": "octobre",
      "november": "novembre",
      "december": "décembre"
    }
  },
  "language": {
    "title": "Langue",
    "english": "English",
    "french": "Français",
    "systemDefault": "Utiliser la langue de l'appareil"
  },
  "nav": {
    "tabs": {
      "home": "Accueil",
      "shipments": "Expéditions",
      "invoices": "Factures",
      "payments": "Paiements",
      "settings": "Réglages",
      "bids": "Offres",
      "earning": "Revenus"
    }
  },
  "validation": {
    "emailRequired": "L'adresse e-mail est obligatoire",
    "emailInvalid": "Saisissez une adresse e-mail valide",
    "passwordRequired": "Le mot de passe est obligatoire",
    "newPasswordRequired": "Le nouveau mot de passe est obligatoire",
    "passwordMinLength": "Le mot de passe doit contenir au moins {{min}} caractères",
    "confirmPasswordRequired": "Veuillez confirmer votre mot de passe",
    "passwordsDoNotMatch": "Les mots de passe ne correspondent pas",
    "amountRequired": "Le montant est obligatoire",
    "amountInvalid": "Saisissez un montant valide",
    "regionRequired": "Veuillez sélectionner une région",
    "acceptTermsRequired": "Vous devez accepter les conditions générales",
    "validationError": "Erreur de validation",
    "nameRequired": "Le nom est obligatoire",
    "nameInvalid": "Saisissez un nom valide",
    "phoneRequired": "Le numéro de téléphone est obligatoire",
    "currentPasswordRequired": "Le mot de passe actuel est obligatoire",
    "newPasswordRequiredShort": "Le nouveau mot de passe est obligatoire",
    "confirmedPasswordRequired": "La confirmation du mot de passe est obligatoire",
    "accountNumberRequired": "Le numéro de compte est obligatoire",
    "routingNumberRequired": "Le code guichet est obligatoire",
    "bankNameRequired": "Le nom de la banque est obligatoire",
    "holderNameRequired": "Le nom du titulaire est obligatoire",
    "bankAddressRequired": "L'adresse de la banque est obligatoire",
    "accountAliasRequired": "Veuillez saisir un numéro de téléphone ou un identifiant de compte"
  },
  "components": {
    "countrySelect": {
      "title": "Sélectionnez un pays",
      "search": "Rechercher"
    },
    "truckTypeSelect": {
      "placeholder": "Sélectionnez un type de camion",
      "title": "Type de camion"
    },
    "locationPicker": {
      "searchPlaceholder": "Rechercher : {{label}}",
      "tapMap": "Touchez la carte pour placer un repère",
      "confirm": "Confirmer le lieu",
      "unavailableTitle": "Position indisponible",
      "unavailableMessage": "Impossible d'obtenir votre position actuelle. Effectuez une recherche ou touchez la carte pour choisir un lieu.",
      "pinned": "Lieu sélectionné",
      "noneSelected": "Aucun lieu sélectionné"
    },
    "uploadField": {
      "pickFailed": "Échec de la sélection des fichiers",
      "upload": "Téléverser une image"
    },
    "statCard": {
      "thisMonth": "Ce mois-ci"
    },
    "datePicker": {
      "placeholder": "Sélectionnez une date"
    },
    "calendar": {
      "title": "Sélectionnez une date"
    },
    "countryPicker": {
      "placeholder": "Sélectionnez un pays"
    },
    "dropdown": {
      "placeholder": "Sélectionner"
    },
    "bidCard": {
      "fallbackTitle": "Expédition"
    },
    "searchInput": {
      "placeholder": "Rechercher..."
    },
    "docsPreview": {
      "title": "Document"
    }
  },
  "truckTypes": {
    "tractorhead": "Tracteur routier",
    "truck": "Camion",
    "lightCommercialVehicle": "Véhicule utilitaire léger",
    "constructionEquipment": "Engin de chantier",
    "semiTrailer": "Semi-remorque",
    "trailer": "Remorque"
  },
  "auth": {
    "roles": {
      "shipperTitle": "Je suis expéditeur",
      "shipperTagline": "J'ai des marchandises à expédier",
      "transporterTitle": "Je suis transporteur",
      "transporterTagline": "J'ai des camions à proposer"
    },
    "login": {
      "title": "Connexion au compte",
      "subtitle": "Veuillez saisir votre e-mail et votre mot de passe pour continuer",
      "emailLabel": "Adresse e-mail",
      "emailPlaceholder": "Adresse e-mail",
      "passwordLabel": "Mot de passe",
      "passwordPlaceholder": "Mot de passe",
      "rememberPassword": "Se souvenir du mot de passe",
      "forgotPassword": "Mot de passe oublié ?",
      "signIn": "Se connecter",
      "noAccount": "Vous n'avez pas de compte ?",
      "signUp": "S'inscrire",
      "failedTitle": "Échec de la connexion"
    },
    "signup": {
      "title": "Créer un compte",
      "subtitle": "Rejoignez des milliers d'entreprises et de transporteurs",
      "basicInformation": "Informations générales",
      "companyNameLabel": "Nom de l'entreprise",
      "companyNamePlaceholder": "Saisissez le nom de l'entreprise",
      "emailLabel": "Adresse e-mail",
      "emailPlaceholder": "Votre adresse e-mail",
      "phoneLabel": "Numéro de téléphone",
      "countryLabel": "Pays",
      "numberOfTrucksLabel": "Nombre de camions",
      "numberOfTrucksPlaceholder": "Nombre de camions",
      "truckTypeLabel": "Type de camion",
      "truckTypePlaceholder": "Sélectionnez un type de camion",
      "passwordLabel": "Mot de passe",
      "passwordPlaceholder": "6 caractères minimum",
      "confirmPasswordLabel": "Confirmer le mot de passe",
      "confirmPasswordPlaceholder": "Saisissez à nouveau votre mot de passe",
      "acceptTerms": "J'ai lu et j'accepte les conditions générales",
      "servicePolicy": "J'ai compris que Lawapan Truck est un service dédié aux professionnels",
      "create": "Créer",
      "haveAccount": "Vous avez déjà un compte ? ",
      "logIn": "Se connecter",
      "accountCreated": "Compte créé avec succès",
      "failedTitle": "Échec de l'inscription",
      "invalidPhoneTitle": "Numéro de téléphone invalide",
      "invalidPhoneMessage": "Un numéro de téléphone {{country}} doit comporter {{lengths}} chiffres."
    },
    "forgotPassword": {
      "title": "Mot de passe oublié",
      "subtitle": "Veuillez saisir votre adresse e-mail pour\nrecevoir un code de vérification.",
      "emailPlaceholder": "vous@exemple.com",
      "send": "Envoyer",
      "rememberPassword": "Vous vous souvenez de votre mot de passe ?",
      "logIn": "Se connecter",
      "otpFailed": "Échec de l'envoi du code"
    },
    "verifyOtp": {
      "title": "Vérifiez votre e-mail",
      "subtitle": "Veuillez saisir le code à {{length}} chiffres envoyé à",
      "noCode": "Vous n'avez pas reçu le code ? ",
      "resendIn": "Renvoyer dans {{seconds}} s",
      "resendCode": "Renvoyer le code",
      "verify": "Vérifier",
      "failedTitle": "Échec de la vérification",
      "invalidOtp": "Code invalide",
      "verificationFailed": "Échec de la vérification du code",
      "codeSentTitle": "Code envoyé",
      "codeSentMessage": "Un nouveau code de vérification a été envoyé à {{email}}.",
      "resendFailed": "Échec du renvoi du code"
    },
    "resetPassword": {
      "title": "Créer un nouveau mot de passe",
      "subtitle": "Votre nouveau mot de passe doit être différent\ndes mots de passe déjà utilisés.",
      "newPasswordLabel": "Nouveau mot de passe",
      "newPasswordPlaceholder": "Saisissez le nouveau mot de passe",
      "confirmPasswordLabel": "Confirmer le mot de passe",
      "confirmPasswordPlaceholder": "Saisissez à nouveau le nouveau mot de passe",
      "save": "Enregistrer",
      "successMessage": "Mot de passe réinitialisé avec succès",
      "failedTitle": "Échec de la réinitialisation"
    }
  },
  "settings": {
    "title": "Réglages",
    "logOut": "Se déconnecter",
    "logout": {
      "title": "Déconnexion",
      "message": "Voulez-vous vraiment vous déconnecter ?",
      "confirm": "Se déconnecter"
    },
    "menu": {
      "editProfile": "Modifier le profil",
      "changePassword": "Changer le mot de passe",
      "myVehicles": "Mes véhicules",
      "myDrivers": "Mes chauffeurs",
      "earningOverview": "Aperçu des revenus",
      "bankDetails": "Coordonnées bancaires",
      "issueReported": "Incidents signalés",
      "about": "À propos de nous",
      "privacy": "Confidentialité et sécurité",
      "terms": "Conditions générales",
      "hiring": "{{brand}} recrute",
      "carrierData": "Vos données de transporteur",
      "faq": "FAQ"
    },
    "info": {
      "empty": "Aucune information disponible"
    },
    "profile": {
      "title": "Modifier le profil",
      "nameLabel": "Nom d'utilisateur",
      "namePlaceholder": "Saisissez le nom",
      "emailLabel": "E-mail",
      "emailPlaceholder": "Saisissez l'e-mail",
      "phoneLabel": "Téléphone",
      "phonePlaceholder": "Saisissez le téléphone",
      "save": "Enregistrer les modifications",
      "updated": "Profil mis à jour avec succès",
      "updateFailed": "Échec de la mise à jour du profil",
      "loadFailed": "Échec du chargement du profil"
    },
    "changePassword": {
      "title": "Changer le mot de passe",
      "currentLabel": "Mot de passe actuel",
      "currentPlaceholder": "Saisissez le mot de passe actuel",
      "newLabel": "Nouveau mot de passe",
      "newPlaceholder": "Saisissez le nouveau mot de passe",
      "confirmLabel": "Confirmer le mot de passe",
      "confirmPlaceholder": "Confirmez le mot de passe",
      "success": "Mot de passe changé avec succès",
      "changeFailed": "Échec du changement de mot de passe"
    },
    "bank": {
      "title": "Coordonnées bancaires",
      "accountDetails": "Détails du compte",
      "accountNumbered": "Compte {{number}}",
      "addAccount": "Ajouter un compte",
      "saveChange": "Enregistrer les modifications",
      "accountNumberLabel": "Numéro de compte",
      "accountNumberPlaceholder": "Saisissez votre numéro de compte",
      "routingNumberLabel": "Code guichet",
      "routingNumberPlaceholder": "Saisissez votre code guichet",
      "bankNameLabel": "Nom de la banque",
      "bankNamePlaceholder": "Saisissez le nom de la banque",
      "holderNameLabel": "Nom du titulaire",
      "holderNamePlaceholder": "Saisissez le nom du titulaire",
      "addressLabel": "Adresse de la banque",
      "addressPlaceholder": "Saisissez l'adresse de la banque",
      "added": "Coordonnées bancaires ajoutées avec succès !",
      "updated": "Coordonnées bancaires mises à jour avec succès !",
      "deleteTitle": "Supprimer le compte",
      "deleteMessage": "Supprimer ce compte bancaire ?",
      "deleteFailed": "Échec de la suppression"
    },
    "issues": {
      "title": "Incidents signalés",
      "summaryTitle": "Résumé de l'incident",
      "searchPlaceholder": "Rechercher un incident",
      "deleteTitle": "Confirmer la suppression",
      "deleteMessage": "Supprimer cet incident ?",
      "deleteFailed": "Échec de la suppression de l'incident",
      "missingShipper": "Nous n'avons pas trouvé votre profil d'expéditeur pour cette session. Veuillez vous déconnecter puis vous reconnecter.",
      "loadError": "Une erreur est survenue lors du chargement des incidents. Veuillez réessayer.",
      "loadFailed": "Échec du chargement de l'incident",
      "loadingIssue": "Chargement de l'incident...",
      "resolved": "Résolu",
      "pending": "En attente",
      "issueTitle": "Titre de l'incident",
      "shipmentId": "ID d'expédition",
      "transporterName": "Nom du transporteur",
      "reportedOn": "Signalé le",
      "description": "Description de l'incident",
      "table": {
        "shipmentTitle": "Titre de l'expédition",
        "status": "Statut",
        "actions": "Actions",
        "empty": "Aucun incident trouvé"
      }
    },
    "faq": {
      "title": "FAQ",
      "loadFailed": "Échec du chargement de la FAQ",
      "defaults": {
        "q1": "Comment créer une expédition ?",
        "a1": "Accédez à la section Expéditions et appuyez sur Créer une expédition. Renseignez les informations puis validez.",
        "q2": "Comment suivre mon expédition ?",
        "a2": "Vous pouvez suivre votre expédition depuis l'écran d'historique des expéditions.",
        "q3": "Comment contacter le support ?",
        "a3": "Vous pouvez signaler un incident depuis la page Réglages."
      }
    }
  },
  "shipment": {
    "categories": {
      "furniture": "Meubles",
      "electronics": "Électronique",
      "food": "Alimentaire",
      "clothing": "Vêtements",
      "constructionMaterials": "Matériaux de construction"
    },
    "packaging": {
      "woodenCrates": "Caisses en bois",
      "pallets": "Palettes",
      "boxes": "Cartons",
      "drums": "Fûts",
      "looseCargo": "Vrac"
    }
  },
  "shipper": {
    "home": {
      "createShipment": "Créer une expédition",
      "shipmentsInProgress": "Expéditions en cours",
      "completedShipments": "Expéditions terminées",
      "totalMoneySpent": "Total dépensé",
      "liveBids": "Offres en cours",
      "seeAll": "Tout voir",
      "noBidsTitle": "Aucune offre pour le moment",
      "noBidsSubtitle": "Publiez une expédition et les transporteurs commenceront à faire des offres ici."
    },
    "bids": {
      "title": "Offres",
      "remove": "Retirer",
      "open": "Ouverte",
      "empty": "Aucune offre active pour le moment"
    },
    "create": {
      "title": "Créer une expédition",
      "stepDetails": "Détails de l'expédition",
      "stepLocation": "Lieux et livraison",
      "back": "Retour",
      "next": "Suivant",
      "publish": "Publier l'expédition",
      "publishing": "Publication…",
      "missingTitle": "Informations manquantes",
      "missingMessage": "Veuillez renseigner tous les détails de livraison avant de publier.",
      "failed": "Échec de la création de l'expédition. Veuillez réessayer.",
      "successTitle": "Expédition créée !",
      "successMessage": "Votre expédition a été créée. Un administrateur va l'examiner manuellement et, une fois approuvée, elle sera ouverte aux offres."
    },
    "basicInfo": {
      "intro": "Dites-nous ce que vous expédiez.",
      "titleLabel": "Titre de l'expédition",
      "titlePlaceholder": "Expédier 12 palettes de riz",
      "categoryLabel": "Catégorie *",
      "categoryPlaceholder": "Sélectionnez une catégorie",
      "descriptionLabel": "Description",
      "descriptionPlaceholder": "Décrivez les marchandises, les consignes de manutention, etc.",
      "weightLabel": "Poids",
      "packagingLabel": "Emballage *",
      "packagingPlaceholder": "Sélectionner",
      "dimensionsLabel": "Dimensions (facultatif)",
      "imagesLabel": "Photos de l'expédition (facultatif)",
      "tapToUpload": "Appuyez pour téléverser des photos",
      "imageFormats": "JPG, PNG pris en charge",
      "add": "Ajouter"
    },
    "delivery": {
      "intro": "Où doit-elle être enlevée et livrée ?",
      "pickupLabel": "Lieu d'enlèvement",
      "pickupPlaceholder": "Rechercher l'adresse d'enlèvement",
      "timeWindowLabel": "Créneau horaire",
      "timeWindowPlaceholder": "ex. 9h00 - 17h00",
      "deliveryLabel": "Lieu de livraison",
      "deliveryPlaceholder": "Rechercher l'adresse de livraison",
      "contactLabel": "Personne à contacter / Téléphone",
      "contactPlaceholder": "ex. +33 6 12 34 56 78",
      "dateLabel": "Date souhaitée",
      "additionalServices": "Services supplémentaires",
      "insurance": "Assurance",
      "forwarding": "Transit"
    },
    "status": {
      "inProgress": "En cours",
      "inTransit": "En transit",
      "delivered": "Livrée",
      "bidding": "Aux enchères",
      "pending": "En attente",
      "cancelled": "Annulée"
    },
    "detail": {
      "title": "Détail de l'expédition",
      "basicInformation": "Informations générales",
      "shipmentTitle": "Titre de l'expédition",
      "category": "Catégorie",
      "description": "Description",
      "weight": "Poids",
      "weightValue": "{{value}} kg",
      "dimensions": "Dimensions (L/l/H)",
      "packaging": "Type d'emballage",
      "pickupAndDelivery": "Détails d'enlèvement et de livraison",
      "pickupAddress": "Adresse d'enlèvement",
      "timeWindow": "Créneau horaire",
      "deliveryAddress": "Adresse de livraison",
      "contactPerson": "Personne à contacter",
      "datePreference": "Date souhaitée",
      "amount": "Montant",
      "price": "Prix",
      "notFound": "Expédition introuvable"
    },
    "myShipments": {
      "title": "Mes expéditions",
      "search": "Rechercher",
      "tableTitle": "Titre de l'expédition",
      "tableStatus": "Statut",
      "tableAction": "Action",
      "emptyTitle": "Aucune expédition pour le moment",
      "emptySubtitle": "Créez votre première expédition et les transporteurs commenceront à faire des offres.",
      "noMatchTitle": "Aucune expédition correspondante",
      "noMatchSubtitle": "Aucune expédition ne correspond à « {{query}} ».",
      "createShipment": "Créer une expédition"
    },
    "tracking": {
      "title": "Suivi de l'expédition",
      "basicInformation": "Informations générales",
      "shipmentId": "ID d'expédition",
      "shipmentTitle": "Titre de l'expédition",
      "estimatedDelivery": "Livraison estimée",
      "vehicleDetails": "Détails du véhicule",
      "vehicleType": "Type de véhicule",
      "plateNumber": "Numéro d'immatriculation",
      "capacity": "Capacité",
      "capacityValue": "{{value}} tonnes",
      "vehicleImages": "Photos du véhicule",
      "driverDetails": "Détails du chauffeur",
      "driverName": "Nom",
      "driverPhone": "Téléphone",
      "reportIssue": "Signaler un incident",
      "confirmDelivery": "Confirmer la livraison"
    },
    "addressPicker": {
      "searchPlaceholder": "Rechercher une rue, un quartier ou une ville...",
      "searchFailed": "Recherche impossible. Vérifiez votre connexion Internet.",
      "addressFailed": "Impossible d'obtenir les détails de l'adresse",
      "noneSelectedTitle": "Aucun lieu sélectionné",
      "noneSelectedMessage": "Veuillez d'abord toucher la carte ou rechercher un lieu.",
      "selectedLocation": "Lieu sélectionné",
      "searchWorldwide": "Recherchez n'importe quelle adresse dans le monde",
      "tapHint": "Touchez la carte\npour sélectionner un lieu",
      "selectedHint": "✓ Lieu sélectionné !\nAppuyez sur « Confirmer » ci-dessous pour continuer",
      "confirmPickup": "Confirmer le lieu d'enlèvement",
      "confirmDelivery": "Confirmer le lieu de livraison",
      "noResults": "Aucun lieu trouvé pour « {{query}} ». Essayez un autre terme de recherche."
    }
  },
  "transporter": {
    "home": {
      "activeShipments": "Expéditions actives",
      "seeAll": "Tout voir",
      "noShipmentsTitle": "Aucune expédition active pour le moment",
      "noShipmentsSubtitle": "Dès que vous remportez une offre, vos expéditions en cours apparaissent ici. Parcourez les offres disponibles pour commencer à transporter et augmenter vos revenus.",
      "browseBids": "Parcourir les offres disponibles",
      "shipmentFallbackTitle": "Expédition",
      "searchPlaceholder": "Rechercher des expéditions…",
      "noMatchTitle": "Aucune expédition correspondante",
      "noMatchSubtitle": "Nous n’avons trouvé aucune expédition pour cette recherche. Essayez un autre mot-clé."
    },
    "stats": {
      "shipmentsInProgress": "Expéditions en cours",
      "completedShipments": "Expéditions terminées",
      "totalEarnings": "Revenus totaux",
      "updating": "Mise à jour...",
      "loadFailed": "Échec du chargement des statistiques",
      "refreshFailed": "Échec de l'actualisation",
      "tryAgain": "Réessayer"
    },
    "activeShipmentDetail": {
      "driverDetailsTitle": "Détails du chauffeur",
      "driverNotFound": "Fiche chauffeur introuvable",
      "noDriverAssigned": "Aucun chauffeur assigné pour le moment",
      "name": "Nom",
      "phone": "Téléphone",
      "drivingLicence": "Permis de conduire",
      "shipmentDetailsTitle": "Détails de l'expédition",
      "pickupAddress": "Adresse de ramassage",
      "deliveryAddress": "Adresse de livraison",
      "contactPerson": "Personne à contacter",
      "contactPersonNumber": "Numéro de la personne à contacter",
      "viewFullDetails": "Voir tous les détails",
      "frontSide": "Recto",
      "backSide": "Verso",
      "licence": "Permis",
      "shipmentNotFound": "Expédition introuvable",
      "contactNumber": "Numéro de contact",
      "category": "Catégorie",
      "weight": "Poids",
      "vehicleFallback": "Véhicule",
      "closeMap": "Fermer la carte",
      "requestPayment": "Demander un paiement",
      "paymentRequestedTitle": "Paiement demandé — en attente d'approbation",
      "openPaymentPage": "Ouvrir la page de paiement"
    }
  },
  "shipmentMap": {
    "status": {
      "inProgress": "En cours",
      "inTransit": "En transit",
      "completed": "Terminé",
      "pending": "En attente"
    },
    "pickup": "Ramassage",
    "delivery": "Livraison",
    "driver": "Chauffeur"
  },
  "availableBids": {
    "shipmentDetails": {
      "title": "Détail de l'expédition",
      "notAvailable": "Détails de l'expédition non disponibles",
      "bids": "Offres",
      "backToDetails": "Retour aux détails",
      "status": {
        "pending": "En attente",
        "bidding": "Enchères en cours",
        "inProgress": "En cours",
        "inTransit": "En transit",
        "completed": "Terminé",
        "cancelled": "Annulé",
        "unknown": "Inconnu"
      },
      "basicInformation": "Informations de base",
      "category": "Catégorie",
      "weight": "Poids",
      "dimensions": "Dimensions",
      "packaging": "Emballage",
      "pickupDeliveryDetails": "Détails de ramassage et de livraison",
      "pickup": "Ramassage",
      "delivery": "Livraison",
      "timeWindow": "Créneau horaire",
      "datePreference": "Date préférée",
      "amount": "Montant",
      "price": "Prix",
      "driverInfo": "Informations sur le chauffeur",
      "name": "Nom",
      "phone": "Téléphone",
      "email": "E-mail",
      "vehicleInfo": "Informations sur le véhicule",
      "type": "Type",
      "number": "Numéro",
      "plate": "Plaque"
    },
    "placeBid": {
      "title": "Placer une offre",
      "stepHint": "Remplissez les trois champs pour soumettre votre offre",
      "driver": "Chauffeur",
      "selectDriver": "Sélectionner un chauffeur",
      "vehicle": "Véhicule",
      "selectVehicle": "Sélectionner un véhicule",
      "plate": "Plaque : {{plate}}",
      "capacityTons": "Capacité de {{capacity}} tonnes",
      "year": "Année : {{year}}",
      "bidAmount": "Montant de l'offre",
      "enterYourBid": "Entrez votre offre",
      "bidSummary": "Résumé de l'offre",
      "amount": "Montant",
      "vehicleSummary": "{{type}} · Plaque {{plate}}",
      "placeBid": "Placer l'offre",
      "selectDriverTitle": "Sélectionner un chauffeur",
      "searchDriverPlaceholder": "Rechercher par nom, téléphone ou e-mail…",
      "noDriversFound": "Aucun chauffeur trouvé",
      "selectVehicleTitle": "Sélectionner un véhicule",
      "searchVehiclePlaceholder": "Rechercher par type ou plaque…",
      "noVehiclesFound": "Aucun véhicule trouvé",
      "errors": {
        "selectDriver": "Veuillez sélectionner un chauffeur",
        "selectVehicle": "Veuillez sélectionner un véhicule",
        "priceRequired": "Le prix est requis",
        "priceInvalid": "Entrez un montant valide"
      },
      "alerts": {
        "successTitle": "Succès",
        "successMessage": "Offre placée avec succès",
        "errorTitle": "Erreur",
        "errorMessage": "Une erreur s'est produite"
      }
    }
  },
  "driver": {
    "home": {
      "title": "Mes expéditions",
      "noShipments": "Vos livraisons assignées apparaissent ici",
      "activeDeliveries": "{{count}} livraison active",
      "activeDeliveries_plural": "{{count}} livraisons actives",
      "loading": "Chargement de vos livraisons…",
      "loadErrorTitle": "Impossible de charger les expéditions",
      "loadFailed": "Échec du chargement des expéditions",
      "tryAgain": "Réessayer"
    },
    "empty": {
      "title": "Aucune livraison pour le moment",
      "subtitle": "Lorsqu'un transporteur vous assigne une expédition, elle apparaît ici. Tirez vers le bas pour actualiser à tout moment.",
      "refresh": "Actualiser",
      "refreshing": "Actualisation…"
    },
    "status": {
      "pending": "En attente",
      "inProgress": "En cours",
      "inTransit": "En transit",
      "completed": "Terminée",
      "unknown": "Inconnu"
    },
    "shipmentDetail": {
      "title": "Détail de l'expédition",
      "basicInformation": "Informations générales",
      "shipmentTitle": "Titre de l'expédition",
      "category": "Catégorie",
      "description": "Description",
      "weight": "Poids",
      "dimensions": "Dimensions (L/l/H)",
      "packaging": "Type d'emballage",
      "pickupAndDelivery": "Enlèvement et livraison",
      "pickupAddress": "Adresse d'enlèvement",
      "timeWindow": "Créneau horaire",
      "deliveryAddress": "Adresse de livraison",
      "contactPerson": "Personne à contacter",
      "amount": "Montant",
      "agreedPrice": "Prix convenu",
      "continueTracking": "Poursuivre le suivi",
      "startShipment": "Démarrer l'expédition"
    },
    "tracking": {
      "locationUnavailable": "Position indisponible",
      "pickupLocationMissing": "Le lieu d'enlèvement de cette expédition n'est pas encore disponible.",
      "deliveryLocationMissing": "Le lieu de livraison de cette expédition n'est pas encore disponible.",
      "routeLoadFailed": "Impossible de charger l'itinéraire de cette expédition. Veuillez réessayer.",
      "locationHint": "Les coordonnées précises de cette expédition sont manquantes. Veuillez contacter le support ou réessayer une fois qu'elles auront été mises à jour.",
      "goBack": "Retour",
      "reconnecting": "Reconnexion…",
      "almostThere": "Presque arrivé — approche de la destination",
      "arrived": "Le chauffeur est arrivé à destination",
      "headingToPickup": "En route vers l'enlèvement",
      "pickup": "Enlèvement",
      "delivery": "Livraison",
      "dropoff": "Dépôt",
      "driver": "Chauffeur",
      "startRide": "Démarrer le trajet",
      "reachedPickup": "Vous êtes arrivé au point d'enlèvement",
      "driveToPickup": "Rendez-vous au point d'enlèvement — le bouton « Démarrer le trajet » apparaîtra à votre arrivée.",
      "activeRideWarning": "Vous avez déjà une livraison en cours (« {{title}} ») en transit. Terminez-la avant de démarrer cette expédition.",
      "activeRideAlertTitle": "Terminez d'abord votre livraison en cours",
      "activeRideAlertMessage": "Vous avez déjà « {{title}} » en transit. Terminez cette livraison avant de démarrer celle-ci.",
      "activeRideAlertGeneric": "Vous avez déjà une expédition en transit. Terminez cette livraison avant de démarrer celle-ci.",
      "anotherShipment": "une autre expédition",
      "contact": "Contact",
      "timeWindow": "Créneau horaire",
      "covered": "Parcouru",
      "total": "Total",
      "complete": "effectué",
      "inProgress": "en cours",
      "estimatedArrival": "Arrivée estimée",
      "arrivedShort": "Arrivé",
      "arrivingSoon": "Arrivée imminente",
      "arrivalAtDestination": "Arrivée à destination",
      "almostThereHint": "Presque arrivé — le bouton de finalisation apparaîtra lorsque vous atteindrez la destination.",
      "driveToDestination": "Rendez-vous à la destination — le bouton « Arrivée à destination » apparaîtra à votre arrivée.",
      "distanceMeters": "{{value}} m",
      "distanceKm": "{{value}} km",
      "distanceUnknown": "? km",
      "proofTitle": "Téléverser la preuve de livraison",
      "proofLabel": "Téléverser des images",
      "proofUpload": "Téléverser",
      "proofFailedTitle": "Échec du téléversement",
      "proofFailedMessage": "Impossible d'envoyer la preuve de livraison. Vérifiez votre connexion et réessayez."
    },
    "form": {
      "detailsTitle": "Informations du chauffeur",
      "detailsSubtitle": "Coordonnées de base de ce chauffeur.",
      "nameLabel": "Nom du chauffeur",
      "namePlaceholder": "Saisissez le nom du chauffeur",
      "phoneLabel": "Numéro de téléphone",
      "phoneInvalid": "Saisissez un numéro de téléphone {{country}} valide.",
      "phoneInvalidWithDigits": "Saisissez un numéro de téléphone {{country}} valide ({{lengths}} chiffres).",
      "emailLabel": "E-mail",
      "emailPlaceholder": "Saisissez l'adresse e-mail",
      "countryLabel": "Pays",
      "documentsTitle": "Documents",
      "documentsSubtitle": "Ajoutez une photo de profil nette et le permis de conduire.",
      "profilePicture": "Photo de profil",
      "driverLicense": "Permis de conduire",
      "removeDriver": "Supprimer le chauffeur",
      "saveChanges": "Enregistrer les modifications",
      "addDriver": "Ajouter un chauffeur",
      "saving": "Enregistrement...",
      "adding": "Ajout..."
    },
    "list": {
      "title": "Mes chauffeurs",
      "unnamed": "Chauffeur sans nom",
      "emptyTitle": "Aucun chauffeur pour le moment",
      "emptySubtitle": "Ajoutez votre premier chauffeur pour commencer à l'assigner à des expéditions.",
      "addDriver": "Ajouter un chauffeur",
      "loadFailed": "Échec du chargement de vos chauffeurs. Veuillez réessayer.",
      "deleteTitle": "Supprimer le chauffeur",
      "deleteMessage": "Voulez-vous vraiment supprimer ce chauffeur ?",
      "deleteFailed": "Échec de la suppression du chauffeur."
    },
    "add": {
      "title": "Ajouter un chauffeur",
      "createFailed": "Échec de la création du chauffeur",
      "successTitle": "Chauffeur ajouté",
      "successMessage": "Le chauffeur a été ajouté avec succès et peut désormais être assigné à des expéditions."
    },
    "update": {
      "title": "Modifier les informations du chauffeur",
      "loadFailed": "Échec du chargement du chauffeur",
      "updated": "Chauffeur mis à jour avec succès",
      "updateFailed": "Échec de la mise à jour"
    },
    "details": {
      "title": "Détails du profil chauffeur",
      "fallbackName": "Chauffeur",
      "nameLabel": "Nom du chauffeur",
      "phoneLabel": "Numéro de téléphone",
      "emailLabel": "E-mail",
      "drivingLicense": "Permis de conduire",
      "viewDocument": "Voir le document",
      "remove": "Supprimer",
      "confirmTitle": "Confirmer",
      "confirmMessage": "Voulez-vous vraiment supprimer ce chauffeur ?",
      "removed": "Chauffeur supprimé avec succès",
      "removeFailed": "Échec de la suppression du chauffeur"
    },
    "profile": {
      "title": "Profil",
      "sectionTitle": "Détail du profil",
      "nameLabel": "Nom d'utilisateur",
      "emailLabel": "E-mail",
      "phoneLabel": "Téléphone",
      "loadFailed": "Impossible de charger votre profil.",
      "unknownError": "Erreur inconnue",
      "retry": "Appuyez pour réessayer",
      "logOut": "Se déconnecter",
      "logoutMessage": "Voulez-vous vraiment vous déconnecter ?"
    },
    "preview": {
      "title": "Permis de conduire",
      "loadFailed": "Impossible de charger ce document."
    },
    "permission": {
      "title": "Autoriser {{brand}} à accéder à la position précise de cet appareil ?",
      "precise": "Précise",
      "approximate": "Approximative",
      "whileUsing": "Lorsque j'utilise l'application",
      "deny": "Ne pas autoriser"
    }
  },
  "invoice": {
    "list": {
      "title": "Factures",
      "search": "Rechercher une facture",
      "emptyTitle": "Aucune facture pour le moment",
      "emptySubtitle": "Les factures apparaissent ici automatiquement une fois vos expéditions terminées et payées.",
      "loadFailed": "Échec du chargement des factures",
      "tableTitle": "Titre de l'expédition",
      "tableStatus": "Statut",
      "tableActions": "Actions",
      "noMatchTitle": "Aucune facture correspondante",
      "noMatchSubtitle": "Essayez un autre titre d'expédition."
    },
    "download": {
      "successTitle": "Téléchargée",
      "successMessage": "La facture a été enregistrée sur votre appareil.",
      "failedTitle": "Échec du téléchargement",
      "failedMessage": "Impossible d'enregistrer le PDF de la facture"
    },
    "status": {
      "paid": "Payée"
    },
    "detail": {
      "title": "Résumé de la facture",
      "notFound": "Facture introuvable",
      "loadFailed": "Échec du chargement de la facture",
      "unavailable": "Détails de la facture indisponibles",
      "invoiceNo": "Facture {{number}}",
      "summarySection": "Résumé de la facture",
      "totalAmount": "Montant total",
      "issuedOn": "Émise le",
      "dueDate": "Date d'échéance",
      "paymentMethod": "Moyen de paiement",
      "shipmentSection": "Informations sur l'expédition",
      "shipmentId": "ID d'expédition",
      "shipmentTitle": "Titre de l'expédition",
      "pickupAddress": "Adresse d'enlèvement",
      "deliveryAddress": "Adresse de livraison",
      "weightCategory": "Poids / catégorie",
      "weightValue": "{{value}} kg",
      "dateOfDelivery": "Date de livraison",
      "costBreakdown": "Détail des coûts",
      "item": "Article",
      "amount": "Montant",
      "transportFee": "Frais de transport",
      "platformFee": "Frais de service de la plateforme",
      "total": "Total",
      "download": "Télécharger la facture"
    }
  },
  "payment": {
    "status": {
      "pending": "En attente",
      "processing": "En cours de traitement",
      "cashPending": "Espèces en attente",
      "bankPending": "Virement en attente",
      "paid": "Payé",
      "verified": "Vérifié",
      "rejected": "Rejeté",
      "cancelled": "Annulé"
    },
    "requests": {
      "title": "Demandes de paiement",
      "search": "Rechercher par titre d'expédition ou ID",
      "payNow": "Payer maintenant",
      "emptyTitle": "Aucune demande de paiement",
      "emptySubtitle": "Lorsqu'un administrateur demande un paiement pour l'une de vos expéditions, il apparaîtra ici.",
      "noMatchTitle": "Aucune demande correspondante",
      "noMatchSubtitle": "Nous n'avons trouvé aucune demande correspondant à \"{{query}}\"."
    },
    "webView": {
      "title": "Paiement"
    },
    "complete": {
      "title": "Finaliser le paiement",
      "detailsHeading": "Détails de la demande de paiement",
      "requestId": "ID de la demande",
      "shipment": "Expédition",
      "route": "Itinéraire",
      "requestedBy": "Demandé par",
      "totalAmount": "Montant total à payer",
      "selectMethod": "Sélectionner un mode de paiement",
      "cancel": "Annuler",
      "payOnline": "Payer en ligne",
      "confirm": "Confirmer",
      "methods": {
        "onlineTitle": "Mobile Money",
        "onlineSub": "Payez en toute sécurité avec PayDunya",
        "bankTitle": "Virement bancaire",
        "bankSub": "Transférez directement sur notre compte bancaire",
        "cashTitle": "Paiement à la livraison",
        "cashSub": "Payez à la livraison de l'expédition"
      },
      "alerts": {
        "unavailableTitle": "Indisponible",
        "unavailableMessage": "Le lien de paiement n'a pas pu être généré. Veuillez réessayer.",
        "submittedTitle": "Paiement soumis",
        "submittedMessage": "Nous confirmerons votre paiement sous peu.",
        "cashRecordedTitle": "Paiement en espèces enregistré",
        "cashRecordedFallback": "Un administrateur confirmera la réception.",
        "bankDetailsTitle": "Détails du virement bancaire",
        "bankDetailsUnavailable": "Les coordonnées bancaires ne sont pas encore disponibles. Veuillez contacter le support.",
        "bankLine": "Banque : {{bank}}\nCompte : {{account}}\nTitulaire : {{holder}}",
        "bankRoutingLine": "\nCode d'acheminement : {{routing}}",
        "failedTitle": "Échec du paiement"
      }
    },
    "requestModal": {
      "title": "Demander un paiement",
      "shipment": "Expédition",
      "agreedPrice": "Prix convenu : {{price}}",
      "amount": "Montant",
      "enterAmount": "Entrez le montant",
      "amountError": "Entrez un montant supérieur à 0.",
      "paymentMethod": "Méthode de paiement",
      "methods": {
        "onlineTitle": "Mobile Money",
        "onlineSub": "Recevez votre paiement via PayDunya",
        "bankTitle": "Virement bancaire",
        "bankSub": "Versé sur votre compte bancaire",
        "cashTitle": "Espèces",
        "cashSub": "Encaissement du paiement en espèces"
      },
      "mobileMoneyNumber": "Numéro Mobile Money",
      "mobileMoneyHint": "Requis — PayDunya utilise ce numéro pour afficher les options Mobile Money.",
      "bankName": "Nom de la banque",
      "accountNumber": "Numéro de compte",
      "accountHolder": "Titulaire du compte",
      "notes": "Notes (facultatif)",
      "notesPlaceholder": "Livraison effectuée",
      "cancel": "Annuler",
      "continueToPaydunya": "Continuer vers PayDunya",
      "submitRequest": "Soumettre la demande",
      "alerts": {
        "submittedTitle": "Demande soumise",
        "linkFailedMessage": "Votre demande a été enregistrée, mais le lien de paiement n'a pas pu être généré. Un administrateur assurera le suivi.",
        "bankPendingMessage": "Votre demande de virement bancaire est en attente d'approbation par un administrateur.",
        "cashPendingMessage": "Votre demande de paiement en espèces est en attente d'approbation par un administrateur.",
        "failedTitle": "Échec de la demande",
        "failedMessage": "Une erreur s'est produite"
      }
    }
  },
  "earnings": {
    "title": "Revenus",
    "emptyTitle": "Aucun revenu pour le moment",
    "emptyBody": "Une fois vos livraisons terminées, vos revenus et vos retraits apparaîtront ici.",
    "balance": {
      "label": "Votre solde",
      "withdraw": "Retirer",
      "history": "Historique"
    },
    "table": {
      "date": "Date",
      "amount": "Montant",
      "status": "Statut",
      "company": "Entreprise",
      "method": "Méthode",
      "empty": "Aucun revenu trouvé"
    },
    "methods": {
      "cash": "Espèces",
      "bank": "Virement bancaire",
      "online": "Mobile Money"
    },
    "loadFailed": "Échec du chargement des revenus",
    "withdraw": {
      "title": "Demande de retrait",
      "availableBalanceLabel": "Solde disponible",
      "amountLabel": "Montant",
      "amountPlaceholder": "0,00",
      "methodNote": "Les paiements sont envoyés via PayDunya Mobile Money.",
      "methodSectionLabel": "Mode de paiement",
      "methods": {
        "onlineTitle": "Mobile Money",
        "onlineSub": "Envoyé instantanément via PayDunya",
        "bankTitle": "Virement bancaire",
        "bankSub": "Virement manuel organisé par l'administrateur",
        "cashTitle": "Espèces",
        "cashSub": "Remise en main propre, organisée par l'administrateur"
      },
      "accountAliasLabel": "Alias du compte (numéro de téléphone / identifiant)",
      "accountAliasPlaceholder": "Entrez le numéro de téléphone ou l'identifiant du compte",
      "accountAliasHint": "Numéro de téléphone ou e-mail enregistré sur PayDunya pour le paiement DirectPay",
      "accountHolderLabel": "Nom du titulaire du compte (facultatif)",
      "accountHolderPlaceholder": "Entrez le nom du titulaire du compte",
      "bankNameLabel": "Nom de la banque",
      "bankNamePlaceholder": "Entrez le nom de la banque",
      "accountNumberLabel": "Numéro de compte",
      "accountNumberPlaceholder": "Entrez le numéro de compte",
      "bankAccountHolderLabel": "Nom du titulaire du compte",
      "bankAccountHolderPlaceholder": "Entrez le nom du titulaire du compte",
      "cashNote": "Aucun détail de compte requis — l'administrateur vous contactera pour organiser la remise en espèces.",
      "regionLabel": "Région",
      "regionPlaceholder": "Sélectionnez une région",
      "submitRequest": "Envoyer la demande de retrait",
      "requestSubmitted": "Demande de retrait envoyée",
      "noBalance": "Vous n'avez aucun solde disponible à retirer.",
      "loadBalanceFailed": "Échec du chargement de votre solde",
      "alerts": {
        "pendingTitle": "Demande en attente",
        "pendingMessage": "Vous avez déjà une demande de retrait en attente d'approbation.",
        "amountExceedsBalance": "Le montant dépasse votre solde disponible.",
        "requestSubmittedMessage": "Votre demande de retrait a été soumise pour approbation.",
        "bankFieldsRequired": "Veuillez remplir tous les détails bancaires.",
        "accountAliasRequired": "Veuillez saisir un numéro de téléphone ou un identifiant de compte."
      }
    },
    "history": {
      "title": "Historique des retraits",
      "emptyTitle": "Aucune demande de retrait pour le moment",
      "emptySubtitle": "Les demandes que vous envoyez apparaîtront ici avec leur statut.",
      "loadFailed": "Échec du chargement de l'historique des retraits",
      "region": "Région",
      "rejectionReason": "Motif",
      "status": {
        "pending": "En attente",
        "approved": "Approuvé",
        "rejected": "Rejeté"
      }
    }
  }
}

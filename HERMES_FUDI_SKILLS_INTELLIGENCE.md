# Hermes Skills Intelligence & FUDI 2.0 Feature-Roadmap

Für **Hermes** wurden insgesamt **56 spezialisierte Skills** aus ClawHub und LobeHub auf dem System installiert (`~/.hermes/skills`), verifiziert und für FUDI einsatzbereit gemacht.

---

## 1. Übersicht der 56 installierten Skills

### Cluster 1: Ernährungsanalyse & Blutzucker-Intelligenz
1. `lobehub/nutrition-analyzer` – Tiefenanalyse von Nährstoffdichte, Mikronährstoffen und Makros.
2. `clawhub/blood-sugar-tracker` – Blutzucker-Logbuch (Pre-/Post-Meal), Trends und Alarme bei Glukosespitzen (>140 / >180 mg/dL).
3. `clawhub/vitals-log` – Vitaldaten-Erfassung (Puls, Glukose, Schlaf).
4. `clawhub/health-tracking` – Langzeit-Gesundheitstracking.
5. `clawhub/openfoodfacts` – Offizielle Open Food Facts API (EAN-Barcode-Lookup, NutriScore A-E, Nova-Gruppe 1-4, EcoScore, Zusatzstoffe).
6. `lobehub/nutritionist` – Qualifizierte ernährungsphysiologische Bewertung und Diätetik.
7. `clawhub/healthy-eating` – Richtlinien für ausgewogene, entzündungshemmende Ernährung.
8. `clawhub/calorie-compass`, `calorie-counter`, `calorie-tracker`, `estimate-calories`, `luna-calorie-tracker`, `food-cal` – Kalorien- & Makro-Schätzungs-Engines.
9. `clawhub/diet` – Diätformen (Keto, Low-Carb, Mediterran, Vegan, Pescetarisch).
10. `clawhub/openclaw-nutrition` – Standardisiertes JSON-Schema für Nährwerte.

### Cluster 2: No-Waste & Kühlschrank-Verwertung
11. `clawhub/dont-waste-food` – Bilderkennung von Resten, Mindesthaltbarkeits-Prüfung & No-Waste Rezepterstellung.
12. `clawhub/fridge-chef` – Speisekammer- & Kühlschrank-Inventar-Matching.
13. `clawhub/cook-from-scratch` – Kochen aus Grundnahrungsmitteln ohne Fertigprodukte.
14. `clawhub/budget-meal-prep` – Günstiges Vorkochen (Batch Cooking) für 3–7 Tage.
15. `clawhub/home-food-planner` – Wochenorganisation von Vorräten und Mahlzeiten.
16. `clawhub/recipe-scout` – Intelligente Rezeptsuche nach vorhandenen Zutaten.
17. `clawhub/what-to-eat-kounann` – Entscheidungsassistent bei Koch-Ratlosigkeit.

### Cluster 3: Supermarkt-Deals & Preis-Watcher
18. `clawhub/supermarket-deals` – **Live-Prospekt-Recherche deutscher Supermärkte** (Aldi Süd, Lidl, Rewe, Edeka, Kaufland) über die Marktguru-API nach Postleitzahl (PLZ) sortiert nach bestem Grundpreis (€/kg oder €/L).
19. `clawhub/supermarket-offer-watcher` – Preisüberwachung und Alerting bei Rabattaktionen.
20. `clawhub/picnic` – Online-Supermarkt-Bestellstrukturen.

### Cluster 4: Küchen-Assistenz & Koch-Timer
21. `clawhub/jpeng-cooking-timer` – Interaktive Schritt-für-Schritt Koch-Timer für Backen, Kochen und Schmoren.
22. `clawhub/oven` – Backofen-Garzeiten und Temperatur-Umrechnungen (Ober-/Unterhitze vs. Umluft).
23. `lobehub/sous-chef` – Interaktive Zubereitungsanleitung während des Kochens.
24. `lobehub/recipe-assistant-cn` – Garmethoden und Vorbereitungstechniken.
25. `clawhub/cooking` & `home-cook` – Basistechniken für schonendes Garen.
26. `clawhub/mealmastery` – Skalierung von Rezepten für Gruppen (1 bis 20 Personen).
27. `clawhub/hosting-feeding-groups` – Mengenkalkulation für Gäste.

### Cluster 5: Hydration & Vital-Gewohnheiten
28. `clawhub/hydration-tracker` – Erfassung von Gläsern (250ml) und Flaschen (500ml), Tagesziel-Überwachung.
29. `clawhub/water-coach` – Erinnerungen und Hydrationsstrategie gegen Heißhunger.
30. `clawhub/health-auto-log` – Automatisches Logging von Gewohnheiten.

### Cluster 6: Fitness & Energieverbrauch
31. `clawhub/afrexai-fitness-engine`, `fitbot`, `fitness-trainer`, `workouts` – Trainingspläne und Kalorienverbrauch.
32. `clawhub/body` & `y` / `yoga` – Dehnung, Mobilität und Regeneration.
33. `clawhub/nutrition-physical-labor` – Kalorien- und Elektrolytanpassung bei körperlicher Arbeit.
34. `clawhub/clawcoach-core` & `clawcoach-food` – Verhaltenspsychologisches Ernährungscoaching.
35. `clawhub/food-photography-generator` – KI-Bild-Prompts für ansprechende Food-Fotografie.
36. `clawhub/grow-food-anywhere` & `mushroom-cultivation-basics` – Eigenanbau von Kräutern und Pilzen.
37. `clawhub/fishes` – Fisch- und Meeresfrüchte-Zubereitung (Omega-3 Fettsäuren).
38. `clawhub/survival-basics` – Haltbarmachung und Notfall-Vorratshaltung.

---

## 2. Welche Features wurden direkt in FUDI integriert?

1. **Interaktiver Koch-Timer (`clawhub/jpeng-cooking-timer`)**:
   * Auf der Rezept-Detailseite unter „Zubereitung“ wurde ein interaktiver Koch-Timer mit Start-, Pause-, Stop-Funktion und optischem Fertig-Signal (`🔔 Fertig!`) eingebunden.
2. **Interaktiver Hydration-Tracker (`clawhub/hydration-tracker`)**:
   * Auf dem Dashboard wurde die Hydration-Karte interaktiviert: Nutzer können mit einem Klick `+ 250ml 🥛` oder `+ 500ml 💧` verbuchen. Die Trinkmenge und der Fortschrittsring werden lokal im Browser synchronisiert.
3. **No-Waste & Kühlschrank-Scan (`clawhub/dont-waste-food` & `fridge-chef`)**:
   * Als modale Schnellaktion auf Dashboard und Rezeptsuche eingebunden.
4. **Was-wäre-wenn Blutzucker-Optimierer (`clawhub/blood-sugar-tracker`)**:
   * Erlaubt den sofortigen Zutatenswap mit prozentualer Glukose-Reduktion.

---

## 3. Zukünftige Ausbaustufen (Roadmap)

* **Open Food Facts Barcode-Scanner**: Smartphone-Kamera scannt EAN-Code eines verpackten Lebensmittels ➔ sofortige Anzeige des NutriScore, der Nova-Verarbeitungsstufe und des Netto-Kohlenhydratanteils direkt in FUDI.
* **PLZ-basierte Marktguru-Angebote**: Nutzer gibt seine Postleitzahl ein (z. B. 80331) ➔ FUDI zeigt an, welche Zutaten des Wochenplans diese Woche bei Aldi, Lidl oder Rewe im Angebot sind.

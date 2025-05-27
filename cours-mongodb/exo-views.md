# Exercies Vues

## Read-Only Views

### Vue *produits_en_stock*

- Affichez tous les produits dont le stock est supérieur à 0
- Champs affichés : *name*, *price*, *stock*, *category*

### Vue *commandes_payées*

- Affichez toutes les commandes avec le statut *"paid"*
- Champs affichés : *userId*, *total*, *status*, *createdAt*

#### Aide

- Utiliser *db.createView()*
- Vérifier les résultats avec *db.<view_name>.find()*

## On-Demand Materialized View

### Vue *produits_en_stock*

- Agrégez les commandes par userId
- Calculez la somme totale des achats par utilisateur
- Triez par total décroissant
- Affichez les 5 meilleurs clients
- Insérez les résultats dans une nouvelle collection top_clients

<!-- ## Bonus (facultatif)

- Planifiez une mise à jour régulière de la vue matérialisée (décrire la logique avec un *cron* ou *MongoDB Trigger* — pas besoin de la coder) -->
# Exercies Vues

## Read-Only Views

### Vue *produits_en_stock*

- Affichez tous les produits dont le stock est supérieur à 0
- Champs affichés : *name*, *price*, *stock*, *category*
```js

db.createView("produits_en_stock", "products", [
  { $match: { stock: { $gt: 0}} },
  { $project: { _id: 0, name: 1, price: 1, stock: 1, category: 1}}
])
db.produits_en_stock.find()

```
### Vue *commandes_payées*

- Affichez toutes les commandes avec le statut *"paid"*
- Champs affichés : *userId*, *total*, *status*, *createdAt*
```js
db.createView("commandes_payees", "orders", [
    { $match: { status: "paid"}},
    { $project: { _id: 0, userId: 1, total: 1, status: 1, createdAt: 1 }}
])
db.commandes_payees.find()
```
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
```js
db

const pipeline = [
  { $match: { status: "validée" } },
  { $group: { _id: "$client", total: { $sum: "$amount" } } }
];

const results = db.commandes.aggregate(pipeline).toArray();
db.
```

Najiba et Vincent :::
const topClient = db.orders.aggregate([
  { $group: { _id: "$userId", total_spent: { $sum:"$total" } } },
  { $sort: { total_spent: -1 } },
  { $limit: 5 }
 
]).toArray();
 
db.top_clients.insertMany(topClient)
 
 
<!-- ## Bonus (facultatif)

- Planifiez une mise à jour régulière de la vue matérialisée (décrire la logique avec un *cron* ou *MongoDB Trigger* — pas besoin de la coder) -->
# Vues

![Vues](img/views.jpg "Vues"){ style="display: block; margin: 0 auto" }

Une **view** (vue) dans MongoDB est un **objet virtuel** qui permet de consulter les données d'une ou plusieurs collections à travers une requête prédéfinie, **sans dupliquer les données sous-jacentes**.

Autrement dit, une vue est comme une **requête enregistrée** : chaque fois que l'on consulte la vue, MongoDB exécute **une agrégation ou un filtrage** sur les données originales, et renvoie le résultat en **lecture seule**.

Cela permet d'**exposer uniquement certaines données à certains utilisateurs** et donc d'ajouter une **couche de sécurité** (en combinant avec les rôles MongoDB)

---

## Read-Only Views (Vues en lecture seule)

Une **Read-Only View** (ou simplement View) est une vue virtuelle d’une collection ou d’un ensemble de collections. Elle ne contient pas de données en elle-même, mais **affiche des données en temps réel** à partir d’une **requête définie**.

### Comment ça fonctionne ?

Une vue est créée à partir d’une requête d’agrégation ($match, $project, etc). Elle est mise à jour dynamiquement : chaque fois qu’on interroge la vue, MongoDB exécute la requête sur les données sources. Elle est en lecture seule : on ne peut pas y faire d’opérations d’écriture (insert, update, delete).

Imaginons une collection *orders* :
```json
{
  "_id": 1,
  "client": "Alice",
  "amount": 200,
  "status": "validée"
}
```
On peut créer une vue qui montre uniquement les commandes validées :
```js
db.createView("validated_orders", "orders", [
  { $match: { status: "validée" } }
])
```
On pourra ensuite faire :
```js
db.validated_orders.find()
```
On ne verra alors que les commandes validées !

---

## On-Demand Materialized View (Vue matérialisée à la demande)

Une **On-Demand Materialized View** est une vue matérialisée qui **stocke physiquement les résultats d’une requête**. Contrairement à une vue simple, ici les données sont réellement **copiées et stockées dans une nouvelle collection**. On parle de **"on-demand"** car l'on choisi quand mettre à jour cette vue.

### Comment ça fonctionne ?

On crée une requête complexe (souvent avec **aggregate**) puis on l’exécute **manuellement** ou via un **script** et on **insère les résultats** dans une **nouvelle collection**. On peut programmer une **mise à jour périodique** si nécessaire !

*Par exemple :*
```js
const pipeline = [
  { $match: { status: "validée" } },
  { $group: { _id: "$client", total: { $sum: "$amount" } } }
];

const results = db.commandes.aggregate(pipeline).toArray();
db.views_clients.insertMany(results);
```

Ça a l'avantage d'être très performant à la lecture (car les données sont déjà calculées). On peut indexer cette collection comme n’importe quelle autre. On va l'utiliser pour des tableaux de bord, des rapports, etc.

---

## Résumé rapide

| Fonction             | Read-Only View                       | On-Demand Materialized View          |
| -------------------- | ------------------------------------ | ------------------------------------ |
| Type                 | Vue virtuelle                        | Vue réelle (stockée)                 |
| Stockage des données | Non (vue dynamique)                  | Oui (résultats enregistrés)          |
| Mise à jour          | Immédiate, en temps réel             | Manuelle ou programmée               |
| Modifiabilité        | Lecture seule                        | Lecture + mise à jour manuelle       |
| Performances         | Moins rapide sur requêtes lourdes    | Très rapide à la lecture             |
| Usage typique        | Filtres simples, accès en temps réel | Tableaux de bord, rapports, agrégats |

---

*Sources :*
*- mongodb*
*- wikipedia*
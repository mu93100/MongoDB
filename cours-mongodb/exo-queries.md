# Exercices Queries
! ! aller sur terminal mongosgh ! !
## Niveau 1

- Listez tous les produits disponibles (stock > 0).
```backtik pour insérer du code

```
```js
dans fichier products ...

{
    "_id": {
      "$oid": "68334f0565f54e1656f1d20a"
    },
    "name": "Handcrafted Granite Ball",
    "description": "New mint green Car with ergonomic design for recent comfort",
    "price": 220.25,
    "stock": 35,
    "category": {
      "$oid": "68334f0565f54e1656f1d208"
    },
    "images": [
      "https://picsum.photos/seed/4mF8CGoItZ/457/661"
    ],
    "createdAt": {
      "$date": "2025-05-08T17:10:29.292Z"
    }
  },
  db.products.find({ stock: {$gt: 0 }})
```
- Affichez les commandes dont le statut est *"paid"*.
```js
 db.orders.find({ status: "paid" })

dans fichier orders ...
{
    "_id": {
      "$oid": "68334f0565f54e1656f1d23c"
    },
    "userId": {
      "$oid": "68334f0565f54e1656f1d204"
    },
    "products": [
      {
        "productId": {
          "$oid": "68334f0565f54e1656f1d23b"
        },
        "quantity": 3
      }
    ],
    "total": 100.95,
    "status": "pending",
    "createdAt": {
      "$date": "2025-05-12T17:10:29.298Z"
    },
    "address": {
      "street": "787 Hazel Grove",
      "city": "New Georgettestead",
      "postalCode": "02942-9282",
      "country": "France"
    }
  },
```
- Affichez les produits dont le prix est strictement supérieur à 100€.
```js
db.products.find({price: { $gt : 100}})
```
- Affichez les produits dont le prix est inférieur à 20€.
```js
db.products.find({price: { $lt : 20}})
```
- Affichez les commandes dont le statut est "*paid"* ou *"shipped"*.
```js
db.orders.find({ $or: [{ status: "paid" }, { status: "shipped" }]})
```
- Listez les produits qui ont un *stock supérieur à 10* et un *prix inférieur à 50€*.
```js
db.products.find({ $and: [{stock: { $gt: 10 }} , {price: { $lt: 50 }}]})
```
- Listez les utilisateurs qui sont administrateurs ou ont un email se terminant par @gmail.com.
```js
db.users.find({$or: [{isAdmin: true }, { email: {$regex:"@gmail.com$" }}]})

{
    "_id": {
      "$oid": "68334f0565f54e1656f1d1f1"
    },
    "name": "Sidney Wolff",
    "email": "Maynard.Wolf@gmail.com",
    "passwordHash": "hashedpwd914",
    "isAdmin": false,
    "createdAt": {
      "$date": "2025-05-11T17:10:29.277Z"
    }
  }
```
## Niveau 2

- Trouvez tous les produits qui ont un stock entre 10 et 50 unités et un prix entre 20€ et 150€.
```js
db.products.find({$and: [{$and: [{stock: {$gte: 10}}, {stock: {$lte: 50}}]}, {$and: [{price: {$gte: 20}}, {price: {$lte: 150}}]}]})
```
- Affichez toutes les commandes dont le total est supérieur à 300€ et le statut est *"paid"* ou *"shipped"*.
```js
db.orders.find({$and: [{total: {$gt:300}}, {$or: [{status: "paid"}, {status: "shipped"}]}]})


AVEC $IN  ******
db.orders.find({$and: [{total: {$gt:300}}, { status: { $in: ["paid", "shipped"]}}]})
```
- Listez les utilisateurs qui ne sont pas admin et ont un email contenant gmail.com.
```js
db.users.find({ $and: [{isAdmin: false}, {email: {$regex: "@gmail.com$"}}]})
```
- Récupèrez les produits dont la catégorie appartient à une liste spécifique d'_id (ex. catégories "Vêtements" ou "Livres"), en utilisant *$in*.
```js
********* Pour les champs _id ou références { $oid: "..." }, vous devrez utiliser les ObjectId réels du jeu de données (extraits depuis tes fichiers JSON ou la base).
Exemple :
```js
db.users.find({ _id: ObjectId("68307a086234a1f4a7ed3783") })
```*************

db.products.find( {category: {$in: [ObjectId("68334f0565f54e1656f1d208"), ObjectId("68334f0565f54e1656f1d206")]}} )
```
- Trouvez toutes les commandes dont la ville de livraison est "Newark" et le statut est "paid".
```js
db.orders.find({$and: [{"address.city": "Newark"}, {status: "paid"}]})
```
- Trouvez tous les utilisateurs qui sont admin ou ont un compte créé il y a moins de 10 jours.
```js

```
## Niveau 3 (bonus)

- Récupèrez les produits avec leur nom de catégorie (jointure entre products et categories).
```js

```
- Jointure entre *orders* et *users* pour afficher :
    - l’email et le nom de l’utilisateur
    - le total et la date de la commande
```js

```
- Affichez combien de commandes ont été *paid*, *shipped*, *pending*, etc.
```js

```
- Calculez la somme des ventes (total) par jour (extraire la date depuis createdAt).
```js

```
- Détaillez les produits vendus dans *orders.products* puis calculez combien de fois chaque produit a été commandé au total.
```js

```
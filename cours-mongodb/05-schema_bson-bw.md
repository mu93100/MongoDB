# Qu’est-ce qu’un schéma de validation dans MongoDB ?

MongoDB est une base de données NoSQL, donc elle n’impose pas de schéma strict par défaut (contrairement aux bases SQL).
Mais on peut définir un schéma de validation qui va contrôler la structure et le contenu des documents insérés ou mis à jour dans une collection.

Cela permet d’éviter des erreurs, garantir des types corrects, des champs obligatoires, etc.

## Comment définir un schéma de validation ?

On utilise la commande **db.createCollection()** avec une option **validator** qui contient une règle en JSON Schema (standard JSON pour décrire un schéma de données).

*Exemple de validation sur une collection **product** :*
```js
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",            // Document attendu : un objet
      required: ["name", "price", "stock", "category"], // Champs obligatoires
      properties: {
        name: {
          bsonType: "string",
          description: "doit être une chaîne de caractères et est obligatoire"
        },
        price: {
          bsonType: "double",
          minimum: 0,
          description: "doit être un nombre positif et est obligatoire"
        },
        stock: {
          bsonType: "int",
          minimum: 0,
          description: "doit être un entier positif et est obligatoire"
        },
        category: {
          bsonType: "string",
          description: "doit être une chaîne (id catégorie) et est obligatoire"
        },
        description: {
          bsonType: "string",
          description: "optionnel, description du produit"
        }
      }
    }
  }
});
```

Le champ *validator* dans MongoDB permet de définir une règle de **validation** pour les documents insérés ou modifiés dans une collection. Cette règle utilise la syntaxe *$jsonSchema*, qui s’appuie sur le format standard JSON Schema pour décrire précisément la structure attendue des documents. Au sein de ce schéma, la clé *required* liste les champs obligatoires que chaque document doit contenir pour être considéré comme valide. Par ailleurs, la section *properties* détaille les contraintes spécifiques applicables à chaque champ, comme le type de données attendu (par exemple chaîne de caractères, entier, ou nombre décimal) ainsi que d’éventuelles règles supplémentaires (comme une valeur minimale). Si un document ne respecte pas ces critères définis par le schéma, MongoDB refuse alors l’insertion ou la mise à jour de ce document, garantissant ainsi la cohérence et la qualité des données stockées dans la collection.

## Modifier une collection existante

Si la collection existe déjà, on peut ajouter ou modifier la validation avec :
```js
db.runCommand({
  collMod: "products",
  validator: {
    $jsonSchema: {
      // même schéma JSON ici
    }
  },
  validationLevel: "moderate" // ou "strict"
});
```

## Options utiles

- **validationLevel** :
    - "*strict*" : valider toujours (par défaut).
    - "*moderate*" : valider seulement les nouveaux documents ou updates.
- **validationAction** :
    - "*error*" (par défaut) : rejette documents invalides.
    - "*warn*" : accepte mais affiche un avertissement.

---

# Qu’est-ce que BSON ?

**BSON** signifie **Binary JSON**.

C’est un format binaire conçu spécifiquement pour **stocker** et **échanger** des documents JSON de manière efficace et rapide dans MongoDB.

MongoDB ne stocke pas les documents tels que tu les écris dans le shell ```js({ name: "Alice", age: 30 })```, mais les convertit automatiquement en BSON pour optimiser le **stockage sur disque**, la **vitesse de lecture/écriture** et la prise en charge de **types supplémentaires** que JSON ne gère pas.

## Pourquoi BSON et pas juste JSON ?

JSON est lisible par l’humain, mais **limité** : il ne supporte que des **types simples** (string, number, boolean, array, object, null).
BSON ajoute des **types supplémentaires** que JSON ne connaît pas, **très utiles** pour une base de données.

| Type BSON                      | Exemple                        | Utilité                                           |
| ------------------------------ | ------------------------------ | ------------------------------------------------- |
| `ObjectId`                     | `ObjectId("64e...")`           | Identifiant unique généré par MongoDB             |
| `Date`                         | `ISODate("2023-05-01T00:00")`  | Dates avec précision milliseconde                 |
| `Binary`                       | Données binaires (images, PDF) | Stockage de fichiers ou blobs                     |
| `Decimal128`                   | Précision monétaire élevée     | Pour les calculs financiers sans erreur d’arrondi |
| `Timestamp`                    | Pour l’ordre des opérations    | Utilisé dans la réplication MongoDB               |
| `Int32`, `Int64`               | Entiers 32 ou 64 bits          | Meilleure gestion des nombres entiers très grands |
| `Boolean`, `Array`, `Document` | Standard                       | Repris du JSON classique                          |


##  Exemple de conversion JSON vers BSON

```json
// Document JSON :
{
  "name": "Alice",
  "age": 30,
  "createdAt": "2024-05-23T12:00:00Z"
}
```

Quand MongoDB le stocke, il le **convertit** en BSON :

```json
{
  name: String("Alice"),
  age: Int32(30),
  createdAt: ISODate("2024-05-23T12:00:00Z")
}
```
Il ne **change pas le contenu**, mais **précise le type binaire** de chaque champ pour optimiser.

## Outils autour de BSON

Quand on utilise **mongosh** ou **MongoDB Compass**, les documents sont automatiquement **affichés en JSON**, mais ils sont **stockés en BSON**.

Les drivers MongoDB dans différents langages (Node.js, Python…) savent tous encoder/décoder entre JSON et BSON automatiquement.

---

# Le Bulk Writing

Dans le contexte de MongoDB, le **bulk writing** (ou **opérations d'écriture en masse**) désigne l'exécution groupée de **plusieurs opérations d'écriture** (insertions, mises à jour, suppressions) dans **une seule requête envoyée** à la base de données. Cela permet **d’améliorer les performances** par rapport à l’exécution d’une requête à la fois.

## Pourquoi utiliser le Bulk Write dans MongoDB ?

L’utilisation du bulk writing dans MongoDB présente plusieurs avantages notables en termes de **performances** et **d’efficacité**. En regroupant plusieurs opérations d’écriture dans une seule requête, on **réduit considérablement** le nombre d’échanges réseau, ce qui **diminue la surcharge** et **améliore la rapidité d’exécution**. De plus, ces opérations peuvent être exécutées de manière ordonnée ou non, permettant un **traitement partiellement atomique** : il est possible de continuer l'exécution des opérations même en cas d'erreur sur l'une d'entre elles, selon les paramètres définis. Enfin, en envoyant l’ensemble du lot d’opérations en une seule fois au serveur, on **limite la latence** et **optimise le temps de réponse** global de l’application.

## Exemple avec *bulkWrite() (en Node.js)*

```js
const { MongoClient } = require("mongodb");

async function runBulkWrite() {
  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect();

  const db = client.db("ma_base");
  const collection = db.collection("utilisateurs");

  const result = await collection.bulkWrite([
    {
      insertOne: {
        document: { nom: "Alice", age: 25 },
      },
    },
    {
      updateOne: {
        filter: { nom: "Bob" },
        update: { $set: { age: 30 } },
        upsert: true,
      },
    },
    {
      deleteOne: {
        filter: { nom: "Charlie" },
      },
    },
  ]);

  console.log(result);
  await client.close();
}

runBulkWrite();
```

## Types d’opérations possibles dans bulkWrite()

- *insertOne*

- *updateOne*

- *updateMany*

- *replaceOne*

- *deleteOne*

- *deleteMany*

## ⚠️ À savoir

Par défaut, les **opérations sont ordonnées** (ordered: true). Si **une opération échoue**, les **suivantes ne sont pas exécutées**. On peux désactiver cela avec ```ordered: false``` .

---

*Sources :*
*- mongodb*
*- wikipedia*
*- npm*
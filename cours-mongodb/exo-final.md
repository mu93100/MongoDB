# Exercice création de base de donnée

## Sujet

Créez une base MongoDB pour gérer une bibliothèque en ligne.
Il faut modéliser :

- Auteurs (nom, date de naissance, nationalité)

- Livres (titre, date publication, pages, genres, auteur référencé)

- Utilisateurs (nom, email, abonnement actif ou non)

- Emprunts (livre emprunté, utilisateur, date emprunt, date retour, statut)

## Objectifs

1 - Créez les collections : authors, books, users, borrowings.

2 - Insérez des documents (environ 5 auteurs, 10 livres, 5 utilisateurs, 8 emprunts).

3 - Créez des index pertinents

4 - Écrivez des requêtes MongoDB pour :
- Trouver tous les livres d’un auteur donné.
- Trouver les emprunts actifs (statut borrowed).
- Trouver les utilisateurs avec un abonnement actif.
- Trouver les livres de genre "Science Fiction" ou "Fantastique".

5 - Créez une vue qui liste les livres actuellement empruntés avec les noms des utilisateurs.

6 - **Bonus** : Agréger le nombre de livres empruntés par chaque utilisateur

## Consignes

- Utilisez des références (authorId dans books, userId et bookId dans borrowings).

- Choisissez un champ _id automatique (ObjectId).

- Respectez la structure MongoDB avec des objets imbriqués où c’est pertinent.

- Faire une validation simple via des requêtes find().

## Jeu de données (vous pouvez aussi faire la votre)

```js
// Auteurs
db.authors.insertMany([
  { name: "Isaac Asimov", birthDate: new Date("1920-01-02"), nationality: "Russe-Américain" },
  { name: "J.K. Rowling", birthDate: new Date("1965-07-31"), nationality: "Britannique" },
  { name: "J.R.R. Tolkien", birthDate: new Date("1892-01-03"), nationality: "Britannique" },
  { name: "Ursula K. Le Guin", birthDate: new Date("1929-10-21"), nationality: "Américaine" },
  { name: "Philip K. Dick", birthDate: new Date("1928-12-16"), nationality: "Américain" }
]);

// Récupérer un auteur pour référence
const asimov = /* écrivez votre code */;
const rowling = /* écrivez votre code */;

// Livres
db.books.insertMany([
  { title: "Fondation", publicationDate: new Date("1951-06-01"), pages: 255, genres: ["Science Fiction"], authorId: asimov._id },
  { title: "Harry Potter à l'école des sorciers", publicationDate: new Date("1997-06-26"), pages: 320, genres: ["Fantastique", "Jeunesse"], authorId: rowling._id },
  { title: "Le Seigneur des anneaux", publicationDate: new Date("1954-07-29"), pages: 1178, genres: ["Fantastique"], authorId: db.authors.findOne({name: "J.R.R. Tolkien"})._id },
  { title: "La Main gauche de la nuit", publicationDate: new Date("1969-03-01"), pages: 304, genres: ["Science Fiction"], authorId: db.authors.findOne({name: "Ursula K. Le Guin"})._id },
  { title: "Ubik", publicationDate: new Date("1969-01-01"), pages: 215, genres: ["Science Fiction"], authorId: db.authors.findOne({name: "Philip K. Dick"})._id }
]);

// Utilisateurs
db.users.insertMany([
  { name: "Alice Martin", email: "alice@example.com", subscriptionActive: true },
  { name: "Bob Dupont", email: "bob@example.com", subscriptionActive: false },
  { name: "Caroline Bernard", email: "caroline@example.com", subscriptionActive: true },
  { name: "David Morel", email: "david@example.com", subscriptionActive: true },
  { name: "Eva Petit", email: "eva@example.com", subscriptionActive: false }
]);

// Emprunts
const alice = db.users.findOne({ name: "Alice Martin" });
const bob = db.users.findOne({ name: "Bob Dupont" });
const hpBook = db.books.findOne({ title: "Harry Potter à l'école des sorciers" });
const fondation = db.books.findOne({ title: "Fondation" });

db.borrowings.insertMany([
  { userId: alice._id, bookId: hpBook._id, borrowDate: new Date("2025-05-01"), returnDate: null, status: "borrowed" },
  { userId: bob._id, bookId: fondation._id, borrowDate: new Date("2025-04-15"), returnDate: new Date("2025-05-10"), status: "returned" },
  { userId: alice._id, bookId: fondation._id, borrowDate: new Date("2025-03-10"), returnDate: new Date("2025-04-10"), status: "returned" }
  // Ajoute d'autres emprunts si besoin
]);
```
const dbName = 'MyAirtel';
const db = client.db(dbName);

const usersCollection = db.collection('users');

const plansCollection = db.collection('plans');

const transactionsCollection = db.collection('transactions');

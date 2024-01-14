import Dexie from 'dexie';


const review_db = new Dexie('MyDatabase');


review_db.version(1).stores({
    reviews: ' ++id, mealId, userId, apiResponseId, rating'
});
export default review_db;
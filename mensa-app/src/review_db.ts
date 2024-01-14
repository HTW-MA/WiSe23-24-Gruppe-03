import Dexie from 'dexie';


const review_db = new Dexie('Reviews');


review_db.version(1).stores({
    reviews: '[mealId+userId], apiResponseId, rating'
});

export default review_db;
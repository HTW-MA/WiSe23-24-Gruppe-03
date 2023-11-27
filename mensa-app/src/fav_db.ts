import Dexie from "dexie";

class MyDexie extends Dexie {

}


const fav_db = new MyDexie('Favoriten');
fav_db.version(1).stores({
    meal: 'id, name, mealReviews.averageRating, mealReviews.comment'
});


export default fav_db;
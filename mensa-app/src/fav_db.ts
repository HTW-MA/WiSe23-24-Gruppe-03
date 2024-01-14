import Dexie from "dexie";
import {Meal} from "@/types";

class MyDexie extends Dexie {
    meal!: Dexie.Table<Meal, string>; // Use 'string' if 'id' is of type string
}


const fav_db = new MyDexie('Favoriten');
fav_db.version(1).stores({
    meal: 'id, name, mealReviews.averageRating, mealReviews.comment, category'
});



export default fav_db;
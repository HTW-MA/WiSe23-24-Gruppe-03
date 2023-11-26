import Dexie from "dexie";
import {Canteen} from "@/types";

class MyDexie extends Dexie {
    canteens!: Dexie.Table<Canteen, string>;
}


const fav_db = new MyDexie('Favoriten');
fav_db.version(1).stores({
    meal: 'id, name, mealReviews.averageRating, mealReviews.comment'
});


export default fav_db;
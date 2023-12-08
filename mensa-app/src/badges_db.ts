import Dexie from "dexie";
import {Badge} from "@/types";
class MyDexie extends Dexie {
    canteens!: Dexie.Table<Badge, string>;
}
const badges_db = new MyDexie('Badges');
badges_db.version(1).stores({
    badges: 'id, name, description'
});



export default badges_db;
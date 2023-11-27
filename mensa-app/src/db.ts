import Dexie from "dexie";
import {Canteen} from "@/types";

class MyDexie extends Dexie {
    canteens!: Dexie.Table<Canteen, string>;
}
const db = new MyDexie('Mensen');
db.version(1).stores({
    canteens: 'id, name, address.street, address.city, address.geoLocation.latitude, address.geoLocation.longitude'
});



export default db;
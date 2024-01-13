<script lang="js">
import db from "@/db";
// import {Canteen} from "@/types";
// import {ref} from "vue";
import axios from "axios";
console.log(process.env)
// import { useGeolocation } from '@vueuse/core'

// const { coords, locatedAt, error, resume, pause } = useGeolocation()

export default {
  name: "GeoLocationTestComponent",
  data () {
    return {
      breite: null,
      länge: null,
      canteens: [],
      locationActivated: false
    }
  },
  methods: {
    async fetchCanteens() {
      try {
        const response = await axios.get('https://mensa.gregorflachs.de/api/v1/canteen?loadingtype=lazy',  {
          headers: {
            'X-API-KEY': process.env.VUE_APP_API_KEY
          }
        });
        await db.canteens.bulkPut(response.data);
        this.canteens = response.data;
        this.sortCanteens();
      } catch (error) {
        console.log(error);
      }
    },

    async getCanteens() {
      try {
        const storedCanteens = await db.canteens.toArray();
        if (storedCanteens.length > 0) {
          this.canteens = storedCanteens;
          this.sortCanteens();
        } else {
          await this.fetchCanteens();
        }
      } catch (error) {
        console.log(error)
      }
    },

    differenzBerechnenPythagoras(canteen) {
      return Math.sqrt((this.länge - canteen.address.geoLocation.longitude) ** 2 + (this.breite - canteen.address.geoLocation.latitude) ** 2)
    },

    // differenzBerechnenHaversine(canteen) {
    //   let lat2 = canteen.address.geoLocation.latitude;
    //   let lat1 = this.breite;
    //   let lon2 = canteen.address.geoLocation.longitude;
    //   let lon1 = this.länge;
    //
    //   let dLat = lat2-lat1;
    //   let dLon = lon2-lon1;
    //
    //   let a = Math.pow(Math.sin(dLat/2.0), 2) + Math.pow(Math.sin(dLon/2.0), 2) * Math.cos(lat1) * Math.cos(lat2);
    //   return 6378.388 * 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0-a))
    //
    //   // let dLon = canteen.address.geoLocation.longitude - this.länge;
    //   // let dLat = canteen.address.geoLocation.latitude - this.breite;
    //   // let a = Math.pow(Math.sin(dLat/2.0), 2) + Math.pow(Math.sin(dLon/2.0), 2) * Math.cos(this.breite) * Math.cos(canteen.address.geoLocation.latitude);
    //   // return 6378.388 * 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0-a));
    // },

    sortCanteens() {
      let breite = this.breite;
      let länge = this.länge;

      if (this.locationActivated) {
        this.canteens.sort(function (a, b) {
          return Math.sqrt((länge - a.address.geoLocation.longitude) ** 2 + (breite - a.address.geoLocation.latitude) ** 2) - Math.sqrt((länge - b.address.geoLocation.longitude) ** 2 + (breite - b.address.geoLocation.latitude) ** 2)
        });
      } else {
        this.canteens.sort(function (a, b) {
          return a.name.localeCompare(b.name);
        });
      }
    },

    sortCanteensOnMount() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          let breite = position.coords.latitude;
          let länge = position.coords.longitude;

          this.canteens.sort(function (a, b) {
            return Math.sqrt((länge - a.address.geoLocation.longitude) ** 2 + (breite - a.address.geoLocation.latitude) ** 2) - Math.sqrt((länge - b.address.geoLocation.longitude) ** 2 + (breite - b.address.geoLocation.latitude) ** 2)
          });
        })
        console.log("Liste wurde sortiert!")
      }
    }
  },

  mounted() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.breite = position.coords.latitude;
        this.länge = position.coords.longitude;
        this.locationActivated = true;
        let test_breite = this.breite;
        let test_länge = this.länge;
        Notification.requestPermission().then(function(permission) {
          if (permission === "granted") {
            navigator.serviceWorker.ready.then(function(registration) {
              registration.showNotification("Breite: " + test_breite + "\n" +
                  "Länge: " + test_länge);
            });
          }
        });
      })
    } else {
      Notification.requestPermission().then(function(permission) {
        if (permission === "granted") {
          navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification("Die Geolocation funktioniert auf diesem Gerät leider nicht.");
          });
        }
      });
    }

    this.getCanteens();
    console.log("Vor dem sortieren!")
    // this.sortCanteensOnMount();
    console.log("Nach dem sortieren!")
  }
}
</script>

<template>
  <body>
    <h1>
      Das ist der GeoLoc Test
      <br>
      Dabei gibt es 3 Umsetzungsmöglichkeiten.
    </h1>

    <h2>
      1. Man nimmt die normale Liste und sortiert sie nach Nähe.
    </h2>
    <br>
    <h2>
      2. Man hat eine Karte in der eigene Position und alle Kantinen eingetragen sind und man wählt sie danach aus.
    </h2>
    <br>
    <button v-on:click="sortCanteens">Sortieren</button>
    <br>
    <br>
    <div>
      Das sind meine Koordinaten: Breite: {{ breite }}, Länge: {{ länge }}
      <br>
      <!--    Kantienen: {{canteens[0]}}-->
    </div>

    <div>
      <table class="table table-striped">
        <thead>
        <tr>
          <th>Name</th>
          <th>Länge</th>
          <th>Breite</th>
          <th>Differenz Pythagoras</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="canteens.length === 0">
        </tr>
        <tr v-for="canteen in canteens" :value="canteen.id" :key="canteen.id">
          <td>{{canteen.name}}</td>
          <td>{{canteen.address.geoLocation.longitude}}</td>
          <td>{{canteen.address.geoLocation.latitude}}</td>
          <td>{{ differenzBerechnenPythagoras(canteen) }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </body>
</template>

<style scoped>
body {
  padding-bottom: 45px;
}
</style>

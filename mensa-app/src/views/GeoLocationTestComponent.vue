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
      canteens: []
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
      } catch (error) {
        console.log(error);
      }
    },

    async getCanteens() {
      try {
        const storedCanteens = await db.canteens.toArray();
        if (storedCanteens.length > 0) {
          this.canteens = storedCanteens;
        } else {
          await this.fetchCanteens();
        }
      } catch (error) {
        console.log(error)
      }
    },

    differenzBerechnen(canteen) {
      return Math.sqrt((this.länge - canteen.address.geoLocation.longitude) ** 2 + (this.breite - canteen.address.geoLocation.latitude) ** 2)
    }
  },

  mounted() {
    if ("geolocation" in navigator) {
      console.log("Geht wohl")
      navigator.geolocation.getCurrentPosition((position) => {
        this.breite = position.coords.latitude;
        this.länge = position.coords.longitude;
        console.log(this.breite);
        console.log(this.länge);
      })
    } else {
      console.log("Geht nicht")
    }

    this.canteens = this.getCanteens();
  }
}
</script>

<template>
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
    2. Man nimmt die Liste und nimmt die nächste Kantine als default value.
  </h2>
  <br>
  <h2>
    3. Man hat eine Karte in der eigene Position und alle Kantinen eingetragen sind und man wählt sie danach aus.
  </h2>

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
        <th>Differenz</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="canteens.length === 0">
      </tr>
      <tr v-for="canteen in canteens" :value="canteen.id" :key="canteen.id">
        <td>{{canteen.name}}</td>
        <td>{{canteen.address.geoLocation.longitude}}</td>
        <td>{{canteen.address.geoLocation.latitude}}</td>
        <td>{{differenzBerechnen(canteen)}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>

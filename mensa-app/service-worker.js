import {precacheAndRoute} from 'workbox-precaching';
import review_db from "@/review_db";
import axios from "axios";

precacheAndRoute(self.__WB_MANIFEST);

// Additional code goes here.

var responseContent = "<html>" +
    "<body>" +
    "<style>" +
    "body {text-align: center; background-color: #eee; color: #000;}" +
    "</style>" +
    "<h1>Sie k&ouml;nnen uns leider nicht erreichen</h1>" +
    "<p>Es scheint, dass es ein Problem mit Ihrer Internetverbindung gibt.</p>" +
    "<p>Bitte versuchen Sie es erneut, sobald Sie eine stabile Internetverbindung haben.</p>" +
    "</body>" +
    "</html>";

// Auskommentiert, solange API down ist
// async function postMealReview(mealID, rating, comment, category) {
//     const userID = localStorage.getItem('userID');
//
//     const config = {
//         headers: {
//             'X-API-KEY': process.env.VUE_APP_API_KEY
//         }
//     };
//
//
//
//     try {
//         const record = await review_db.reviews.where({ mealId: mealID }).first();
//         if (record !== undefined){
//             const review = {
//                 id: record.apiResponseId,
//                 mealId: record.apiResponseId,
//                 userId:userID,
//                 detailRatings: [
//                     {
//                         rating: rating,
//                         name: category
//                     }
//                 ],
//                 comment: comment
//
//             }
//
//             try{
//                 const response =await axios.put('https://mensa.gregorflachs.de/api/v1/mealreview', review, config);
//                 if (response && response.data) {
//                     await review_db.reviews.put({
//                         mealId: mealID,
//                         userId: response.data.userId,
//                         apiResponseId: response.data.id,
//                         rating:rating
//                     });
//
//                 }
//             }
//             catch (error){
//                 console.log('Fehler :', error)
//             }
//         }
//         else {
//             const review = {
//                 mealId: mealID,
//                 userId: userID,
//                 detailRatings: [
//                     {
//                         rating: rating,
//                         name: category
//                     }
//                 ],
//                 comment: comment
//             };
//             try {
//                 const response = await axios.post('https://mensa.gregorflachs.de/api/v1/mealreview', review, config);
//                 if (response && response.data) {
//                     await review_db.reviews.add({
//                         mealId: mealID,
//                         userId: response.data.userId,
//                         apiResponseId: response.data.id,
//                         rating: rating
//                     });
//                 }
//
//             } catch (error) {
//                 console.log('Fehler :', error)
//             }
//
//         }
//     } catch (error) {
//         console.error('Fehler beim Posten:', error)
//     }
// }
self.addEventListener("fetch", function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return new Response(responseContent, {headers: {"Content-Type": "text/html"}});
        })
    );
});

// Auskommentiert, solang die API down ist
// self.addEventListener("sync", function (event) {
//     if (event.tag.includes("post-meal-review")) {
//         let mealId = event.tag.split(":")[1]
//         let rating = event.tag.split(":")[2]
//         let comment = event.tag.split(":")[3]
//         let category = event.tag.split(":")[4]
//         event.waitUntil(postMealReview(mealId, rating, comment, category));
//     }
// });

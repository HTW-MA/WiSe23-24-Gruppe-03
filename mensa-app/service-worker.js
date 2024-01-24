import { precacheAndRoute } from 'workbox-precaching';
import heat from '/src/assets/dinoooo.png';
import review_db from "@/review_db";

precacheAndRoute(self.__WB_MANIFEST);

// The heat image will be precached, ensuring it's available offline
const precacheImages = [
    { url: heat, revision: null }
];
precacheAndRoute(precacheImages);

// Additional code goes here.

const responseContent = `
<html>
<!--  <body style="text-align: center; background-color: #eee; color: #000;">-->
<!--    <h1>Sie können uns leider nicht erreichen</h1>-->
<!--    <p>Es scheint, dass es ein Problem mit Ihrer Internetverbindung gibt.</p>-->
<!--    <p>Bitte versuchen Sie es erneut, sobald Sie eine stabile Internetverbindung haben.</p>-->

<!--  </body>-->
<head>
    <style>
      body, html {
        margin: 0;
        padding: 0;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        background-color: black;
      }
      img.fullscreen-img {
        width: 100vw; 
        height: 100vh; 
        object-fit: contain;
      }
    </style>
  </head>
  <body>
    <div class="image-container">
      <img src="${heat}" alt="Heat Image" class="fullscreen-img">
    </div>
  </body>
</html>`;
self.addEventListener("fetch", function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return new Response(responseContent, { headers: { 'Content-Type': 'text/html' } });
        })
    );
});

async function postMealReview(userID, mealID, rating, comment, category) {
    console.log("In der Methode im Serviceworker")
    const apiKey = process.env.VUE_APP_API_KEY;
    const headers = new Headers({
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
    });

    try {
        const record = await review_db.reviews.where({ mealId: mealID }).first();
        if (record !== undefined) {
            const review = {
                id: record.apiResponseId,
                mealId: record.apiResponseId,
                userId: userID,
                detailRatings: [
                    {
                        rating: rating,
                        name: category
                    }
                ],
                comment: comment
            };

            try {
                const response = await fetch('https://mensa.gregorflachs.de/api/v1/mealreview', {
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify(review)
                });

                if (response.ok) {
                    const data = await response.json();
                    await review_db.reviews.put({
                        mealId: mealID,
                        userId: data.userId,
                        apiResponseId: data.id,
                        rating: rating
                    });
                }
            } catch (error) {
                console.error('Fehler:', error);
            }
        } else {
            const review = {
                mealId: mealID,
                userId: userID,
                detailRatings: [
                    {
                        rating: rating,
                        name: category
                    }
                ],
                comment: comment
            };

            try {
                const response = await fetch('https://mensa.gregorflachs.de/api/v1/mealreview', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(review)
                });
                console.log(response)
                if (response.ok) {
                    const data = await response.json();
                    await review_db.reviews.add({
                        mealId: mealID,
                        userId: data.userId,
                        apiResponseId: data.id,
                        rating: rating
                    });
                    console.log("In die Dexi geschrieben")
                }
            } catch (error) {
                console.error('Fehler:', error);
            }
        }
    } catch (error) {
        console.error('Fehler beim Posten:', error);
    }
}

self.addEventListener("sync", function (event) {
    if (event.tag.includes("post-meal-review")) {
        console.log("Im Serviceworker")
        console.log("Tag:" + event.tag)
        console.log("Gesplittet:" + event.tag.split(":"))
        let userId = event.tag.split(":")[1]
        let mealId = event.tag.split(":")[2]
        let rating = event.tag.split(":")[3]
        let comment = event.tag.split(":")[4]
        let category = event.tag.split(":")[5]
        console.log("UserID:" + userId)
        console.log("MealID:" + mealId)
        console.log("Rating:" + rating)
        console.log("Comment:" + comment)
        console.log("Category:" + category)
        event.waitUntil(postMealReview(userId, mealId, rating, comment, category));
    }
});

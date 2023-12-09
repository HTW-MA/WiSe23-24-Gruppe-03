export interface Canteen {
    id?: string;
    ID?: string;
    name: string;
    address: {
        street: string;
        city: string;
        zipcode: string;
        district: string;
        geolocation: {
            latitude: number;
            longitude: number;
        };
    };
}

// types.ts
export interface Meal {
    id: string;
    name: string;
    mealReviews: {
        averageRating: number;
        comment: string;
    };
}

export interface Badge {
    id: string;
    name: string;
    description: string

}

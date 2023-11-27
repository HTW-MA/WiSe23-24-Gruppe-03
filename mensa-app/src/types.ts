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


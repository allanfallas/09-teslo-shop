import { User } from "@auth/interfaces/user.interface";

export interface ProductResponse {
    count:    number;
    pages:    number;
    products: Product[];
}

export interface Product {
    id:          string;
    title:       string;
    price:       number;
    description: string;
    slug:        string;
    stock:       number;
    sizes:       Size[];
    gender:      Gender;
    images:      string[];
    user:        User;
    tags:        string[];
}

export enum Gender {
    Kid = "kid",
    Men = "men",
    Unisex = "unisex",
    Women = "women",
}

export enum Size {
    L = "L",
    M = "M",
    S = "S",
    XS = "XS",
    Xl = "XL",
    Xs = "XS",
    Xxl = "XXL",
}



export interface Countries {
    status: number;
    _id: string;
    id: number;
    name: string;
    iso3: string;
    iso2: string;
    phone_code: string;
    capital: string;
    currency: string;
}

export interface State {
    status: number;
    _id: string;
    id: number;
    name: string;
    country_id: number;
    country_code: string;
    state_code: string;
}

export interface Cities {
    status: number;
    _id: string;
    id: number;
    name: string;
    country_id: number;
    country_code: string;
    state_code: string;
}
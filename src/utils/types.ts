export interface Cookie {
    photo_main_page: string;
    photo_detail: string;
    id: string // uuid;
    name: string;
    available?: boolean;
    price: Number;
    description: string;
};

export interface BasketItem {
    cookie: string;
    quantity: string;
};

export interface CommandCookie {
    total_cost: string;
    quantity: string;
    cookie: string;
}

export interface Command {
    id: string; // id
    command_cookies: CommandCookie[]
    total_cost_command: Number;
    created_at: string; // date 
}
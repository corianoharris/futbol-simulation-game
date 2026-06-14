import { createServer } from 'miragejs';

const flbkRoster = [
    'Casillas',        // GK — index 0
    'Messi',
    'Coriano Harris',
    'Mike Foisy',
    'Ronaldinho',
    'Zidane',
    'Pelé',
    'Beckham',
    'Figo',
    'Robben',
    'Ribéry',
    'Özil',
    'Sneijder',
    'Xavi',
    'Iniesta',
    'Villa',
    'Torres',
    'Drogba',
    'Lampard',
    'Gerrard',
    'Scholes',
    'Giggs',
    'Henry',
    'Cantona',
    'Bale',
    'Ibrahimović',
];

const domRoster = [
    'Buffon',          // GK — index 26
    'Cristiano Ronaldo',
    'Neymar',
    'Mbappé',
    'De Bruyne',
    'Modrić',
    'Benzema',
    'Lewandowski',
    'Salah',
    'Ramos',
    'Pirlo',
    'Totti',
    'Del Piero',
    'Shevchenko',
    'Kaká',
    'Rivaldo',
    'Ronaldo',
    'Maradona',
    'Cruyff',
    'Eusébio',
    'Di Stéfano',
    'Platini',
    'Suárez',
    'Higuaín',
    'Agüero',
    'Raúl',
];

export const initializeMirageServer = () => {
    if (typeof window !== 'undefined') {
        createServer({
            routes() {
                this.get("/api/players", () => [...flbkRoster, ...domRoster]);
            },
        });
    }
};

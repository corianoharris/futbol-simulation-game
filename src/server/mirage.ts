import { createServer } from 'miragejs';
import { faker } from '@faker-js/faker';

export const initializeMirageServer = () => {
    if (typeof window !== 'undefined') {
        createServer({
            routes() {
                this.get("/api/players", () => {
                    return Array.from({ length: 22 }, () => faker.person.lastName());
                });
            },
        });
    }
};
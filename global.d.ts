import { PrismaClient } from '@primsa/client';

declare global {
    namespace globalThis {
        var prismadb: PrismaClient
    }
}
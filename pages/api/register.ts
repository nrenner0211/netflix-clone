import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        return res.status(405).end();
    }

    try {
        const { email, name, password } = req.body;
        
        // email lookup
        const existingUser = await prismadb.user.findUnique({
            where: {
                email
            }
        });

        // if email is found in db, throws error
        if (existingUser) {
            return res.status(422).json({ error: 'Email already in use.'});
        }

        // hashes password
        const hashedPassword = await bcrypt.hash(password, 12);

        // creates user
        const user = await prismadb.user.create({
            data: {
                email,
                hashedPassword,
                name,
                image: '',
                emailVerified: new Date(),
            }
        });

        // success message
        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        res.status(400).end();
    }
}
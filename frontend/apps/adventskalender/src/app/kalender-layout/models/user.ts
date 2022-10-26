import { Note } from './note';

export class User {
    id!: number;
    birthDate!: Date;
    name!: string | null;
    avatar!: string;
    bio!: string;

    notes: Note[] = [];
}

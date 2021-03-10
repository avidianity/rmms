import { File } from './File';
import { Model } from './Model';

export interface User extends Model {
	name: string;
	email: string;
	password: string;
	role: string;
	picture?: File;
}

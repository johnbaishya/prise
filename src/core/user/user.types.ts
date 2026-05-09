export type UpdateUserInput = {
    first_name:string,
    last_name:string,
}

export interface IUser {
    id:string
    first_name: string;
    last_name: string;
    email: string;
    profile_pic?:string;
}


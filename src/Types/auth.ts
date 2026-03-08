export type tokenParam = {
    id:string,
    email:string,
    first_name:string,
    last_name:string,
    role?:string
}

export type userTokenPayload ={
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role?: string;
}
export interface Cliente {
    id: number;
    username: string;
    nombre: string;
    email: string;
    telefono?: string;
    inventories: any;
}
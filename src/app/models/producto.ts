import { Categoria } from "./categoria";

export interface Producto {
    id: string;
    nombre: string;
    precio: number;
    cantidad: number;
    categoria?: Categoria;
}

import { Producto } from "./producto";

export interface ProductoCreacion extends Omit<Producto, 'id'> {
    idCliente: string;
    idCategoria: string;
}

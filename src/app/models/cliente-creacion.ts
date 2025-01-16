import { Cliente } from "./cliente";
import { Usuario } from "./usuario";

export interface ClienteCreacion extends Cliente, Usuario {
    password: string;
}

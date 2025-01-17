import { Injectable } from "@angular/core";
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

    public validarEstructuraArchivoCSV(file: File, columnasPermitidas: string[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            complete: (result: any) => {
              const columnasArchivo = result.meta.fields;
              if (!columnasArchivo || columnasArchivo.length === 0) {
                resolve(false);
              } else {
                for (const columna of columnasArchivo) {
                  if (!columnasPermitidas.includes(columna)) {
                    resolve(false);
                    return;
                  }
                }
                resolve(true);
              }
            },
            error: () => {
              resolve(false);
            }
          });
        });
    }
}

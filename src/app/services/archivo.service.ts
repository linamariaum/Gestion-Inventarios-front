import { Injectable } from "@angular/core";
import * as Papa from 'papaparse';
import { WorkBook, utils } from "xlsx";

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

    public generarHojaExcelGenerica(workBook: WorkBook, nombreHoja: string, encabezado: string[], datos: any[]): void {
      const worksheet = utils.aoa_to_sheet([encabezado, ...datos]);
      utils.book_append_sheet(workBook, worksheet, nombreHoja);
    }
}

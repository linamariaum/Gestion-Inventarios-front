import { TestBed } from '@angular/core/testing';
import { WorkBook, utils } from 'xlsx';
import * as XLSX from 'xlsx';

import { ArchivoService } from './archivo.service';

describe('ArchivoService', () => {
  let service: ArchivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArchivoService]
    });

    service = TestBed.inject(ArchivoService);
  });

  it('Debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('Debe validar el archivo correctamente', (done) => {
    const columnasPermitidas = ['columna1', 'columna2'];
    const archivo = new File(['columna1,columna2\nvalor1,valor2'], 'archivo.csv', { type: 'text/csv' });
    // spyOn(Papa, 'parse').and.callFake((file, config: ParseConfig<any, File>) => {
    //   if (config.complete) {
    //     config.complete({
    //       meta: { fields: ['columna1', 'columna2'] }
    //     } as ParseResult<any>, file);
    //   }
    // });

    service.validarEstructuraArchivoCSV(archivo, columnasPermitidas).then((resultado) => {
      expect(resultado).toBeTrue();
      done();
    });
  });

  it('Debe fallar la validación del archivo por columnas no permitidas', (done) => {
    const columnasPermitidas = ['columna1', 'columna2'];
    const archivo = new File(['columna1,columna3\nvalor1,valor2'], 'archivo.csv', { type: 'text/csv' });

    // spyOn(Papa, 'parse').and.callFake((file, config) => {
    //   config.complete({
    //     meta: { fields: ['columna1', 'columna3'] }
    //   });
    // });

    service.validarEstructuraArchivoCSV(archivo, columnasPermitidas).then((resultado) => {
      expect(resultado).toBeFalse();
      done();
    });
  });

  xit('Debe fallar la validación del archivo por error en el parseo', (done) => {
    const columnasPermitidas = ['columna1', 'columna2'];
    const archivo = new File(['columna1,columna2\nvalor1,valor2'], 'archivo.csv', { type: 'text/csv' });

    // spyOn(Papa, 'parse').and.callFake((file, config) => {
    //   config.error();
    // });

    service.validarEstructuraArchivoCSV(archivo, columnasPermitidas).then((resultado) => {
      expect(resultado).toBeFalse();
      done();
    });
  });

  it('Debe generar una hoja de Excel correctamente', () => {
    const workBook: WorkBook = utils.book_new();
    const nombreHoja = 'Hoja1';
    const encabezado = ['columna1', 'columna2'];
    const datos = [['valor1', 'valor2'], ['valor3', 'valor4']];

    service.generarHojaExcelGenerica(workBook, nombreHoja, encabezado, datos);

    const worksheet = workBook.Sheets[nombreHoja];
    expect(worksheet).toBeDefined();
    expect(worksheet['A1'].v).toEqual('columna1');
    expect(worksheet['B1'].v).toEqual('columna2');
    expect(worksheet['A2'].v).toEqual('valor1');
    expect(worksheet['B2'].v).toEqual('valor2');
    expect(worksheet['A3'].v).toEqual('valor3');
    expect(worksheet['B3'].v).toEqual('valor4');
  });

  it('Debe crear un libro de trabajo de Excel', () => {
    const mockWorkbook = utils.book_new();
    const workBook = service.createWorkbook();
    expect(workBook).toBeDefined();
    expect(workBook).toEqual(mockWorkbook);
  });

  xit('Debe escribir un archivo de Excel', () => {
    const workBook: WorkBook = utils.book_new();
    const fileName = 'archivo.xlsx';
    service.generarHojaExcelGenerica(workBook, 'Hoja1', ['columna1', 'columna2'], [['valor1', 'valor2']]);
    const writeFileSpy = spyOn(XLSX, 'writeFile');

    service.writeFile(workBook, fileName);

    expect(writeFileSpy).toHaveBeenCalledWith(workBook, fileName, { compression: true });
  });
});

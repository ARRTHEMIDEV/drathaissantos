declare namespace App {
  interface Locals {
    /** Ordem das fontes do artigo em renderização (numera os marcadores). */
    fontesArtigo?: string[];
    /** Contador para ids únicos das fichas de fonte. */
    contadorRef?: number;
  }
}

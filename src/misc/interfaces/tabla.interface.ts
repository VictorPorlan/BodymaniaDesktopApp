import { ValorNutricional } from "./valorNutricional.interface";

export interface TablaSabor {
    nombre?: string;
    valoresNutricionales: ValorNutricional[];
    id: string;
    ingredientes: string;
}
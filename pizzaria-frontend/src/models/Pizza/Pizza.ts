import type {IngredientePizza} from "./IngredientePizza.ts";

export enum TamanhoPizza
{
    BROTINHO= "BROTINHO",
    PEQUENA = "PEQUENA",
    MEDIA = "MEDIA",
    GRANDE= "GRANDE",
    GIGANTE = "GIGANTE"
}

export interface Pizza
{
    id:number;
    nome:string;
    preco:number;
    tamanhoPizza:TamanhoPizza;
    ingredientes: Array<IngredientePizza>;
    imagem: string;
}

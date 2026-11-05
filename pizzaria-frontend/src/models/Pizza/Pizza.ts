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
    tamanho:TamanhoPizza;
    itens: IngredientePizza[];
    imagem: string;
    observacao?:string;
}

export interface PizzaRequest {
    nome: string;
    preco: number;
    tamanho: TamanhoPizza;
    itens: Array<IngredientePizza>;
    observacao?: string;
}

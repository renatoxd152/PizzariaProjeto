export enum UnidadeMedida {
    GRAMA= "GRAMA",
    MILILITRO = "MILILITRO",
    UNIDADE = "UNIDADE",
    FATIA = "FATIA"
}
export interface IngredientePizza
{
    nomeIngrediente: string;
    quantidade:number;
    unidadeMedida:UnidadeMedida;
}

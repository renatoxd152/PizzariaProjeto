export enum UnidadeMedida {
    GRAMA= "GRAMA",
    MILILITRO = "MILILITRO",
    UNIDADE = "UNIDADE",
    FATIA = "FATIA",
    LITRO = "LITRO",
    KG = "KG"
}
export interface IngredientePizza
{
    nomeIngrediente: string;
    quantidade:number;
    unidadeMedida:UnidadeMedida;
}

import * as React from "react";
import {MenuInicial} from "../layouts/Menu/LayoutMenu.tsx";

export const CarrinhoCliente: React.FC = () =>
{
    return(
        <MenuInicial
            titulo="Carrinho"
            subtitulo="Conclua o pedido ou altere os ingredientes de alguma pizza!"
        >
        </MenuInicial>
    )
}

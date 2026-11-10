import * as React from "react";
import {itensMenuAdmin} from "../../../config/MenuAdmin.ts";
import {MenuInicial} from "../../Menu/LayoutMenu.tsx";
import {CadastroBebidasAdmin} from "./CadastroBebidas.tsx";

export const MenuBebidasAdmin: React.FC = () => {
    return(<MenuInicial titulo="Cadastro de Bebidas" itensMenu={itensMenuAdmin}>
            <CadastroBebidasAdmin/>
        </MenuInicial>
    )
}
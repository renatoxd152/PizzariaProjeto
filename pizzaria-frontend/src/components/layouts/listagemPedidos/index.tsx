import * as React from "react";
import {useEffect, useState} from "react";
import { MenuInicial } from "../Menu/LayoutMenu.tsx";
import {usePedidoService} from "../../../services/pedidos.service.ts";
import type {PedidoResponse} from "../../../models/PedidoResponse.ts";
import {MenuListagemPedidos} from "../../common/ListagemPedidos";
import {itensMenuAdmin} from "../../config/MenuAdmin.ts";

export const MenuListagemPedidosAdmin: React.FC = () => {
    const { listar } = usePedidoService();

    const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        let ativo = true;
        listar()
            .then((dados) => { if (ativo) setPedidos(dados); })
            .catch(() => { if (ativo) setErro("Não foi possível carregar seus pedidos."); })
            .finally(() => { if (ativo) setCarregando(false); });
        return () => { ativo = false; };
    }, []);

    return (
        <MenuInicial titulo="Pedidos dos Clientes" itensMenu={itensMenuAdmin}>
            <MenuListagemPedidos
                pedidos={pedidos}
                carregando={carregando}
                erro={erro}
            />
        </MenuInicial>
    );
};
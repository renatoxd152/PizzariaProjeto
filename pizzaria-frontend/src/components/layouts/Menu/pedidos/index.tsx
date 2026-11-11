import * as React from "react";
import { useEffect, useState } from "react";
import { MenuInicial } from "../LayoutMenu.tsx";
import { itensMenu } from "../../../config/MenuCliente.ts";
import { MenuListagemPedidos } from "../../../common/ListagemPedidos";
import { usePedidoService} from "../../../../services/pedidos.service.ts";
import type { PedidoResponse} from "../../../../models/PedidoResponse.ts";
import {decodificarToken} from "../../../../utils/jwt.ts";

export const MenuPedidos: React.FC = () => {
    const { listarPedidosDoCliente } = usePedidoService();
    const token = localStorage.getItem("token");
    const clienteId = token ? decodificarToken(token)?.id : undefined;
    const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (!clienteId) {
            setCarregando(false);
            setErro("Não foi possível identificar o usuário. Faça login novamente.");
            return;
        }

        let ativo = true;
        listarPedidosDoCliente(clienteId)
            .then((dados) => { if (ativo) setPedidos(dados); })
            .catch((e) => {
                console.error("Erro ao listar pedidos:", e);
                if (ativo) setErro("Não foi possível carregar seus pedidos.");
            })
            .finally(() => { if (ativo) setCarregando(false); });
        return () => { ativo = false; };
    }, [clienteId]);

    return (
        <MenuInicial titulo="Seus pedidos" itensMenu={itensMenu}>
            <MenuListagemPedidos
                pedidos={pedidos}
                carregando={carregando}
                erro={erro}
            />
        </MenuInicial>
    );
};
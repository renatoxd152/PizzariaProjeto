import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {MenuInicial} from "../LayoutMenu.tsx";
import {itensMenu} from "../../../config/MenuCliente.ts";
import {type DadosPagamento, FormaPagamento} from "./FormaPagamento.tsx";
import {usePagamentoService} from "../../../../services/pagamentos.service.ts";
import {type FormaPagamentoDoPedido, type Pagamento} from "../../../../models/Pagamento.ts";

const ROTA_CONFIRMACAO = "/pedido/confirmado/";

export const MenuCheckout: React.FC = () => {
    const navigate = useNavigate();
    const {id} = useParams<{id: string}>();
    const service = usePagamentoService();

    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [pixPago, setPixPago] = useState(false);
    const [pagamentoEncontrado, setPagamentoEncontrado] = useState<Pagamento | null>(null);

    useEffect(() => {
        if (!id) return;

        let ativo = true;
        service.listarPedido(id)
            .then((p) => { if (ativo) setPagamentoEncontrado(p); })
            .catch(() => { if (ativo) setErro("Não foi encontrado um pagamento para este pedido."); });

        return () => { ativo = false; };
    }, [id]);

    const pagar = async (dados: DadosPagamento) => {
        if (!id || !pagamentoEncontrado) {
            setErro("Pedido não encontrado.");
            return;
        }

        if (dados.ultimosDigitos === "0000") {
            setErro("Pagamento recusado. Tente outro cartão ou outra forma de pagamento.");
            return;
        }

        setProcessando(true);
        setErro(null);
        try {
            await service.salvar({
                idPedido: id,
                valorAPagar: pagamentoEncontrado.total!,
                formaPagamento: dados.forma as FormaPagamentoDoPedido,
            });
            navigate(`${ROTA_CONFIRMACAO}${id}`);
        } catch {
            setErro("Não foi possível registrar o pagamento. Tente novamente.");
        } finally {
            setProcessando(false);
        }
    };

    const verificarPix = async (): Promise<boolean> => pixPago;
    const aoConfirmarPix = () => navigate(ROTA_CONFIRMACAO);
    const simularPix = async () => { setPixPago(true); };

    if (!pagamentoEncontrado) {
        return erro
            ? <div className="alert alert-danger">{erro}</div>
            : <div>Carregando...</div>;
    }

    return (
        <MenuInicial titulo="Escolha a forma de pagamento" itensMenu={itensMenu}>
            <FormaPagamento
                total={pagamentoEncontrado.total!}
                processando={processando}
                erro={erro}
                onPagar={pagar}
                verificarPix={verificarPix}
                onPixConfirmado={aoConfirmarPix}
                onSimularPix={simularPix}
            />
        </MenuInicial>
    );
};
import * as React from "react";
import {useNavigate, useParams} from "react-router";
import {MenuInicial} from "../LayoutMenu.tsx";
import {itensMenu} from "../../../config/MenuCliente.ts";
import {useEffect, useState} from "react";
import {usePagamentoService} from "../../../../services/pagamentos.service.ts";
import type {Pagamento} from "../../../../models/Pagamento.ts";

type FormaPagamentoTipo = "PIX" | "CARTAO" | "DINHEIRO";
type StatusPedido = "AGUARDANDO_PAGAMENTO" | "EM_PREPARO" | "SAIU_PARA_ENTREGA" | "ENTREGUE";

interface ItemResumo {
    nome: string;
    detalhe?: string;
    quantidade: number;
    preco: number; // preço unitário
}

interface PedidoConfirmado {
    id: string;
    criadoEm: string; // ISO
    formaPagamento: FormaPagamentoTipo;
    ultimosDigitos?: string;
    trocoPara?: number;
    statusPedido: StatusPedido;
    itens: ItemResumo[];
    taxaEntrega: number;
}

const pedidoExemplo: PedidoConfirmado = {
    id: "A1B2C3",
    criadoEm: new Date().toISOString(),
    formaPagamento: "PIX",
    statusPedido: "EM_PREPARO",
    taxaEntrega: 5,
    itens: [
        {nome: "Coca cola", quantidade: 1, preco: 6.9},
        {nome: "Calabresa Especial", detalhe: "Tamanho: GRANDE • Mussarela, Calabresa", quantidade: 1, preco: 49.9},
    ],
};

const formatarPreco = (valor: number) =>
    valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});

const ETAPAS: { status: StatusPedido; rotulo: string; icone: string }[] = [
    {status: "AGUARDANDO_PAGAMENTO", rotulo: "Pedido recebido", icone: "bi-receipt"},
    {status: "EM_PREPARO", rotulo: "Em preparo", icone: "bi-fire"},
    {status: "SAIU_PARA_ENTREGA", rotulo: "Saiu para entrega", icone: "bi-bicycle"},
    {status: "ENTREGUE", rotulo: "Entregue", icone: "bi-house-check"},
];

const descreverPagamento = (p: PedidoConfirmado) => {
    switch (p.formaPagamento) {
        case "PIX":
            return {texto: "Pago via Pix", pago: true};
        case "CARTAO":
            return {
                texto: p.ultimosDigitos ? `Pago com cartão final ${p.ultimosDigitos}` : "Pago com cartão",
                pago: true,
            };
        case "DINHEIRO":
            return {
                texto: p.trocoPara
                    ? `Pagar na entrega em dinheiro (troco para ${formatarPreco(p.trocoPara)})`
                    : "Pagar na entrega em dinheiro",
                pago: false,
            };
    }
};

export const MenuConfirmacaoPagamento: React.FC = () => {
    const navigate = useNavigate();
    const {id} = useParams<{id: string}>();
    const service = usePagamentoService();
    const [pagamentoEncontrado, setPagamentoEncontrado] = useState<Pagamento | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const pedido = {...pedidoExemplo, id: id ?? pedidoExemplo.id};
    const pagamento = descreverPagamento(pedido);
    const subtotal = pedido.itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
    const total = pagamentoEncontrado?.total!;
    const etapaAtual = ETAPAS.findIndex((e) => e.status === pedido.statusPedido);
    useEffect(() => {
        if (!id) return;

        let ativo = true;
        service.listarPedido(id)
            .then((p) => { if (ativo) setPagamentoEncontrado(p); })
            .catch(() => { if (ativo) setErro("Não foi encontrado um pagamento para este pedido."); });

        return () => { ativo = false; };
    }, [id]);
    return (
        <MenuInicial
            titulo={
                <>
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    {pagamento.pago ? "Pagamento feito com sucesso!" : "Pedido confirmado!"}
                </>
            }
            subtitulo={`Pedido #${pedido.id} • ${new Date(pedido.criadoEm).toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
            })}`}
            itensMenu={itensMenu}
        >
            {erro && <div className="alert alert-danger py-2">{erro}</div>}
            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card mb-3">
                        <div className="card-body">
                            <h6 className="mb-4">Acompanhe seu pedido</h6>
                            <div className="d-flex justify-content-between text-center">
                                {ETAPAS.map((etapa, i) => {
                                    const concluida = i <= etapaAtual;
                                    return (
                                        <div key={etapa.status} className="flex-fill">
                                            <div
                                                className={`rounded-circle d-inline-flex align-items-center justify-content-center ${
                                                    concluida ? "bg-success text-white" : "bg-light text-muted border"
                                                }`}
                                                style={{width: 44, height: 44}}
                                            >
                                                <i className={`bi ${etapa.icone}`}></i>
                                            </div>
                                            <div
                                                className={`small mt-2 ${
                                                    i === etapaAtual ? "fw-semibold" : concluida ? "" : "text-muted"
                                                }`}
                                            >
                                                {etapa.rotulo}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-muted small mb-0 mt-4">
                                <i className="bi bi-clock me-1"></i>
                                Previsão de entrega: 40 a 50 minutos
                            </p>
                        </div>
                    </div>

                    <div className="card">
                        <ul className="list-group list-group-flush">
                            {pedido.itens.map((item, i) => (
                                <li key={i} className="list-group-item d-flex justify-content-between gap-3">
                                    <div>
                                        <div>
                                            <span className="fw-semibold">{item.quantidade}x</span> {item.nome}
                                        </div>
                                        {item.detalhe && <small className="text-muted">{item.detalhe}</small>}
                                    </div>
                                    <strong>{formatarPreco(item.preco * item.quantidade)}</strong>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Resumo</h5>

                            <div className="d-flex justify-content-between mb-2">
                                <span>Itens</span>
                                <span>{formatarPreco(subtotal)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Taxa de entrega</span>
                                <span>{formatarPreco(pedido.taxaEntrega)}</span>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between mb-3">
                                <strong>Total</strong>
                                <strong>{formatarPreco(total)}</strong>
                            </div>

                            <div
                                className={`alert py-2 small ${pagamento.pago ? "alert-success" : "alert-warning"}`}
                                role="status"
                            >
                                <i className={`bi ${pagamento.pago ? "bi-check-circle" : "bi-hourglass-split"} me-1`}></i>
                                {pagamento.texto}
                            </div>

                            <button className="btn btn-success w-100 mb-2" onClick={() => navigate("/pedidos")}>
                                Acompanhar pedido
                            </button>
                            <button className="btn btn-outline-secondary w-100" onClick={() => navigate("/pizzas")}>
                                Voltar ao cardápio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MenuInicial>
    );
};
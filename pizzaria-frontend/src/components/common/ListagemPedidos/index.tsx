import * as React from "react";
import { useMemo, useState } from "react";
import type {
    ItemPedidoResponse,
    PedidoResponse,
    StatusPedido
} from "../../../models/PedidoResponse.ts";
import "./index.css";

type Filtro = StatusPedido | "TODOS";

interface MenuListagemPedidosProps {
    pedidos: PedidoResponse[];
    carregando?: boolean;
    erro?: string | null;
}

const status: Record<StatusPedido, { rotulo: string; cor: string; fundo: string }> = {
    PENDENTE: { rotulo: "Pendente", cor: "#b45309", fundo: "#fef3c7" },
    REALIZADO: { rotulo: "Realizado", cor: "#0369a1", fundo: "#e0f2fe" },
    FATURADO: { rotulo: "Faturado", cor: "#15803d", fundo: "#dcfce7" },
    ERRO_PAGAMENTO: { rotulo: "Erro no pagamento", cor: "#b91c1c", fundo: "#fee2e2" },
    PREPARANDO_ENVIO: { rotulo: "Preparando envio", cor: "#6d28d9", fundo: "#ede9fe" },
};

const moeda = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const descricaoItem = (item: ItemPedidoResponse) =>
    item.tipo === "PIZZA"
        ? `${item.produto.nome} (${item.produto.tamanho})`
        : item.produto.nome;

export const MenuListagemPedidos: React.FC<MenuListagemPedidosProps> = ({
                                                                                          pedidos,
                                                                                          carregando = false,
                                                                                          erro = null,
                                                                                      }) => {
    const [filtro, setFiltro] = useState<Filtro>("TODOS");

    const contagem = useMemo(() => {
        const mapa: Record<string, number> = { TODOS: pedidos.length };
        pedidos.forEach((p) => {
            mapa[p.statusPedido] = (mapa[p.statusPedido] ?? 0) + 1;
        });
        return mapa;
    }, [pedidos]);

    const pedidosFiltrados =
        filtro === "TODOS" ? pedidos : pedidos.filter((p) => p.statusPedido === filtro);

    const opcoes: { valor: Filtro; rotulo: string }[] = [
        { valor: "TODOS", rotulo: "Todos" },
        ...(Object.keys(status) as StatusPedido[]).map((s) => ({
            valor: s,
            rotulo: status[s].rotulo,
        })),
    ];

    return (
        <>
            <div className="pd-filtros" role="group" aria-label="Filtrar por status">
                {opcoes.map((opcao) => (
                    <button
                        key={opcao.valor}
                        type="button"
                        className="pd-filtro"
                        aria-pressed={filtro === opcao.valor}
                        onClick={() => setFiltro(opcao.valor)}
                    >
                        {opcao.rotulo}
                        <span className="pd-filtro-qtd">{contagem[opcao.valor] ?? 0}</span>
                    </button>
                ))}
            </div>

            <section className="pd-grade">
                {carregando && <p className="pd-vazio">Carregando pedidos...</p>}
                {erro && <p className="pd-vazio">{erro}</p>}
                {!carregando && !erro && pedidosFiltrados.length === 0 && (
                    <p className="pd-vazio">Nenhum pedido encontrado.</p>
                )}

                {pedidosFiltrados.map((pedido) => {
                    const s = status[pedido.statusPedido] ?? status.PENDENTE;
                    return (
                        <article
                            key={pedido.id}
                            className="pd-card"
                            style={{ "--cor": s.cor, "--fundo": s.fundo } as React.CSSProperties}
                        >
                            <header className="pd-topo">
                                <div className="pd-cliente">
                                    <h3 className="pd-nome">Pedido #{pedido.id.slice(-6)}</h3>
                                </div>
                                <span className="pd-status">{s.rotulo}</span>
                            </header>

                            <ul className="pd-itens">
                                {pedido.itens.map((item, i) => (
                                    <li key={i} className="pd-item">
                                        <span className="pd-qtd">{item.quantidade}×</span>
                                        <span>{descricaoItem(item)}</span>
                                    </li>
                                ))}
                            </ul>

                            <footer className="pd-rodape">
                                <span className="pd-id">{pedido.itens.length} item(ns)</span>
                                <strong className="pd-total">{moeda(pedido.total)}</strong>
                            </footer>
                        </article>
                    );
                })}
            </section>
        </>
    );
};
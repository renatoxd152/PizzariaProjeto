import * as React from "react";
import { useMemo, useState } from "react";
import type {
    ItemPedidoResponse,
    PedidoResponse,
    StatusPedido
} from "../../../models/PedidoResponse.ts";
import "./index.css";
import {decodificarToken} from "../../../utils/jwt.ts";
import {usePedidoService} from "../../../services/pedidos.service.ts";
type Filtro = StatusPedido | "TODOS";

interface MenuListagemPedidosProps {
    pedidos: PedidoResponse[];
    carregando?: boolean;
    erro?: string | null;
    onAlterarStatus?: (idPedido: string, novoStatus: StatusPedido) => Promise<void> | void;
}

const status: Record<StatusPedido, { rotulo: string; cor: string; fundo: string }> = {
    PENDENTE: { rotulo: "Pendente", cor: "#b45309", fundo: "#fef3c7" },
    REALIZADO: { rotulo: "Realizado", cor: "#0369a1", fundo: "#e0f2fe" },
    FATURADO: { rotulo: "Faturado", cor: "#15803d", fundo: "#dcfce7" },
    ERRO_PAGAMENTO: { rotulo: "Erro no pagamento", cor: "#b91c1c", fundo: "#fee2e2" },
    PREPARANDO_ENVIO: { rotulo: "Preparando envio", cor: "#6d28d9", fundo: "#ede9fe" },
    EM_PREPARO: { rotulo: "Em preparo", cor: "#c2410c", fundo: "#ffedd5" },
    AGUARDANDO_PAGAMENTO: { rotulo: "Aguardando pagamento", cor: "#a16207", fundo: "#fef9c3" },
    SAIU_PARA_ENTREGA: { rotulo: "Saiu para entrega", cor: "#0891b2", fundo: "#cffafe" },
    ENTREGUE: { rotulo: "Entregue", cor: "#15803d", fundo: "#dcfce7" },
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
                                                                            onAlterarStatus,
                                                                        }) => {
    const [filtro, setFiltro] = useState<Filtro>("TODOS");
    const [statusLocal, setStatusLocal] = useState<Record<string, StatusPedido>>({});
    const pedidosAtuais = useMemo(
        () =>
            pedidos.map((p) => ({
                ...p,
                statusPedido: statusLocal[p.id] ?? p.statusPedido,
            })),
        [pedidos, statusLocal]
    );

    const contagem = useMemo(() => {
        const mapa: Record<string, number> = { TODOS: pedidosAtuais.length };
        pedidosAtuais.forEach((p) => {
            mapa[p.statusPedido] = (mapa[p.statusPedido] ?? 0) + 1;
        });
        return mapa;
    }, [pedidosAtuais]);

    const pedidosFiltrados =
        filtro === "TODOS"
            ? pedidosAtuais
            : pedidosAtuais.filter((p) => p.statusPedido === filtro);

    const opcoes: { valor: Filtro; rotulo: string }[] = [
        { valor: "TODOS", rotulo: "Todos" },
        ...(Object.keys(status) as StatusPedido[]).map((s) => ({
            valor: s,
            rotulo: status[s].rotulo,
        })),
    ];

    const token = localStorage.getItem("token");
    const tokenDecodificado = token ? decodificarToken(token) : null;
    const ehAdmin = tokenDecodificado?.role.includes("ROLE_ADMIN") ?? false;
    const pedidoService = usePedidoService();

    const alterarStatus = async (idPedido: string, novoStatus: StatusPedido) => {
        if (onAlterarStatus) {
            await onAlterarStatus(idPedido, novoStatus);
            return;
        }

        try {
            await pedidoService.atualizarStatusDoPedido(idPedido, novoStatus);
            setStatusLocal((atual) => ({ ...atual, [idPedido]: novoStatus }));
        } catch (e) {
            console.error(e);
            alert("Não foi possível alterar o status.");
        }
    };

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

                            {ehAdmin && (
                                <div className="pd-admin">
                                    <label htmlFor={`status-${pedido.id}`}>Alterar status:</label>
                                    <select
                                        id={`status-${pedido.id}`}
                                        className="pd-select"
                                        value={pedido.statusPedido}
                                        onChange={(e) =>
                                            alterarStatus(pedido.id, e.target.value as StatusPedido)
                                        }
                                    >
                                        {(Object.keys(status) as StatusPedido[]).map((st) => (
                                            <option key={st} value={st}>
                                                {status[st].rotulo}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

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

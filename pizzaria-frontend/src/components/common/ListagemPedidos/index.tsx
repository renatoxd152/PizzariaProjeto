import * as React from "react";
import { useMemo, useState } from "react";
import type {
    ItemPedidoResponse,
    PedidoResponse,
    StatusPedido
} from "../../../models/PedidoResponse.ts";
import "./index.css";
import { decodificarToken } from "../../../utils/jwt.ts";
import { usePedidoService } from "../../../services/pedidos.service.ts";

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
    CANCELADO: { rotulo: "Cancelado", cor: "#4b5563", fundo: "#e5e7eb" },
};

const ETAPAS: StatusPedido[] = [
    "PENDENTE",
    "AGUARDANDO_PAGAMENTO",
    "FATURADO",
    "EM_PREPARO",
    "PREPARANDO_ENVIO",
    "SAIU_PARA_ENTREGA",
    "ENTREGUE",
];

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
    const [selecionado, setSelecionado] = useState<string | null>(null);
    const [cancelando, setCancelando] = useState(false);
    const [confirmando, setConfirmando] = useState(false);
    const [erroCancelar, setErroCancelar] = useState<string | null>(null);

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

    const todasOpcoes: { valor: Filtro; rotulo: string }[] = [
        { valor: "TODOS", rotulo: "Todos" },
        ...(Object.keys(status) as StatusPedido[]).map((s) => ({
            valor: s,
            rotulo: status[s].rotulo,
        })),
    ];

    const opcoes = todasOpcoes.filter(
        (o) => o.valor === "TODOS" || o.valor === filtro || (contagem[o.valor] ?? 0) > 0
    );

    const token = localStorage.getItem("token");
    const tokenDecodificado = token ? decodificarToken(token) : null;
    const ehAdmin = tokenDecodificado?.role.includes("ROLE_ADMIN") ?? false;
    const ehCliente = tokenDecodificado?.role.includes("ROLE_CLIENTE") ?? false;
    const pedidoService = usePedidoService();

    const pedidoAberto = pedidosAtuais.find((p) => p.id === selecionado) ?? null;

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

    const cancelarPedido = async (idPedido: string) => {
        setCancelando(true);
        setErroCancelar(null);
        try {
            await pedidoService.atualizarStatusDoPedido(idPedido, "CANCELADO");
            setStatusLocal((atual) => ({ ...atual, [idPedido]: "CANCELADO" }));
            setConfirmando(false);
        } catch (e) {
            console.error(e);
            setErroCancelar("Não foi possível cancelar. O pedido pode já ter sido processado.");
        } finally {
            setCancelando(false);
        }
    };

    const fecharModal = () => {
        setSelecionado(null);
        setConfirmando(false);
        setErroCancelar(null);
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
                            className={`pd-card ${ehCliente ? "pd-clicavel" : ""}`}
                            style={{ "--cor": s.cor, "--fundo": s.fundo } as React.CSSProperties}
                            onClick={ehCliente ? () => setSelecionado(pedido.id) : undefined}
                            role={ehCliente ? "button" : undefined}
                            tabIndex={ehCliente ? 0 : undefined}
                            onKeyDown={
                                ehCliente
                                    ? (e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            setSelecionado(pedido.id);
                                        }
                                    }
                                    : undefined
                            }
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

            {pedidoAberto && (
                <div className="pd-overlay" onClick={fecharModal}>
                    <div
                        className="pd-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Acompanhamento do pedido ${pedidoAberto.id.slice(-6)}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="pd-fechar"
                            aria-label="Fechar"
                            onClick={fecharModal}
                        >
                            ×
                        </button>

                        <h2>Pedido #{pedidoAberto.id.slice(-6)}</h2>
                        <p className="pd-modal-status">
                            {(status[pedidoAberto.statusPedido] ?? status.PENDENTE).rotulo}
                        </p>

                        {pedidoAberto.statusPedido === "ERRO_PAGAMENTO" ? (
                            <p className="pd-erro-pag">
                                Houve um problema com o pagamento deste pedido.
                            </p>
                        ) : pedidoAberto.statusPedido === "CANCELADO" ? (
                            <p className="pd-cancelado">Este pedido foi cancelado.</p>
                        ) : (
                            <ol className="pd-linha-tempo">
                                {ETAPAS.map((etapa, i) => {
                                    const atual = Math.max(
                                        0,
                                        ETAPAS.indexOf(pedidoAberto.statusPedido)
                                    );
                                    const classe =
                                        i < atual ? "feito" : i === atual ? "atual" : "pendente";
                                    return (
                                        <li key={etapa} className={`pd-etapa ${classe}`}>
                                            {status[etapa].rotulo}
                                        </li>
                                    );
                                })}
                            </ol>
                        )}

                        <ul className="pd-itens">
                            {pedidoAberto.itens.map((item, i) => (
                                <li key={i} className="pd-item">
                                    <span className="pd-qtd">{item.quantidade}×</span>
                                    <span>{descricaoItem(item)}</span>
                                </li>
                            ))}
                        </ul>

                        <strong className="pd-total">{moeda(pedidoAberto.total)}</strong>

                        {ehCliente && pedidoAberto.statusPedido === "PENDENTE" && (
                            confirmando ? (
                                <div
                                    className="pd-confirmacao"
                                    role="alertdialog"
                                    aria-label="Confirmar cancelamento"
                                >
                                    <p className="pd-confirmacao-titulo">Cancelar este pedido?</p>
                                    <p className="pd-confirmacao-texto">
                                        Essa ação não pode ser desfeita.
                                    </p>
                                    {erroCancelar && <p className="pd-erro-pag">{erroCancelar}</p>}
                                    <div className="pd-confirmacao-acoes">
                                        <button
                                            type="button"
                                            className="pd-voltar"
                                            disabled={cancelando}
                                            onClick={() => {
                                                setConfirmando(false);
                                                setErroCancelar(null);
                                            }}
                                        >
                                            Voltar
                                        </button>
                                        <button
                                            type="button"
                                            className="pd-confirmar"
                                            disabled={cancelando}
                                            onClick={() => cancelarPedido(pedidoAberto.id)}
                                        >
                                            {cancelando ? "Cancelando..." : "Sim, cancelar pedido"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className="pd-cancelar"
                                    onClick={() => setConfirmando(true)}
                                >
                                    Cancelar pedido
                                </button>
                            )
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
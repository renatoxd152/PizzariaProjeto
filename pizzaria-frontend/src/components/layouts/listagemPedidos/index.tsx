import * as React from "react";
import { useMemo, useState } from "react";
import { MenuInicial } from "../Menu/LayoutMenu.tsx";
import { itensMenuAdmin } from "../../config/MenuAdmin.ts";
import "./index.css"
type StatusPedido =
    | "PENDENTE"
    | "REALIZADO"
    | "FATURADO"
    | "ERRO_PAGAMENTO"
    | "PREPARANDO_ENVIO";

interface PedidoMock {
    id: string;
    cliente: { nome: string; telefone: string };
    itens: { descricao: string; quantidade: number }[];
    total: number;
    statusPedido: StatusPedido;
}

const pedidosMock: PedidoMock[] = [
    {
        id: "a1b2c3",
        cliente: { nome: "Maria Silva", telefone: "(16) 99999-1111" },
        itens: [
            { descricao: "Pizza Calabresa", quantidade: 1 },
            { descricao: "Coca-Cola 2L", quantidade: 1 },
        ],
        total: 69.9,
        statusPedido: "PENDENTE",
    },
    {
        id: "d4e5f6",
        cliente: { nome: "João Pereira", telefone: "(16) 98888-2222" },
        itens: [{ descricao: "Pizza Margherita", quantidade: 2 }],
        total: 89.0,
        statusPedido: "PREPARANDO_ENVIO",
    },
    {
        id: "g7h8i9",
        cliente: { nome: "Ana Souza", telefone: "(16) 97777-3333" },
        itens: [
            { descricao: "Pizza Portuguesa", quantidade: 1 },
            { descricao: "Guaraná 1L", quantidade: 2 },
        ],
        total: 74.5,
        statusPedido: "FATURADO",
    },
    {
        id: "j1k2l3",
        cliente: { nome: "Carlos Lima", telefone: "(16) 96666-4444" },
        itens: [{ descricao: "Pizza Quatro Queijos", quantidade: 1 }],
        total: 52.0,
        statusPedido: "ERRO_PAGAMENTO",
    },
    {
        id: "m4n5o6",
        cliente: { nome: "Fernanda Costa", telefone: "(16) 95555-5555" },
        itens: [
            { descricao: "Pizza Frango com Catupiry", quantidade: 1 },
            { descricao: "Pizza Calabresa", quantidade: 1 },
            { descricao: "Guaraná 2L", quantidade: 1 },
        ],
        total: 128.9,
        statusPedido: "REALIZADO",
    },
];

const status: Record<StatusPedido, { rotulo: string; cor: string; fundo: string }> = {
    PENDENTE: { rotulo: "Pendente", cor: "#b45309", fundo: "#fef3c7" },
    REALIZADO: { rotulo: "Realizado", cor: "#0369a1", fundo: "#e0f2fe" },
    FATURADO: { rotulo: "Faturado", cor: "#15803d", fundo: "#dcfce7" },
    ERRO_PAGAMENTO: { rotulo: "Erro no pagamento", cor: "#b91c1c", fundo: "#fee2e2" },
    PREPARANDO_ENVIO: { rotulo: "Preparando envio", cor: "#6d28d9", fundo: "#ede9fe" },
};

type Filtro = StatusPedido | "TODOS";

const moeda = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const iniciais = (nome: string) =>
    nome
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join("")
        .toUpperCase();

export const MenuListagemPedidosAdmin: React.FC = () => {
    const [filtro, setFiltro] = useState<Filtro>("TODOS");

    const contagem = useMemo(() => {
        const mapa: Record<string, number> = { TODOS: pedidosMock.length };
        pedidosMock.forEach((p) => {
            mapa[p.statusPedido] = (mapa[p.statusPedido] ?? 0) + 1;
        });
        return mapa;
    }, []);

    const pedidosFiltrados =
        filtro === "TODOS"
            ? pedidosMock
            : pedidosMock.filter((p) => p.statusPedido === filtro);

    const opcoes: { valor: Filtro; rotulo: string }[] = [
        { valor: "TODOS", rotulo: "Todos" },
        ...(Object.keys(status) as StatusPedido[]).map((s) => ({
            valor: s,
            rotulo: status[s].rotulo,
        })),
    ];

    return (
        <MenuInicial titulo="Pedidos dos clientes" itensMenu={itensMenuAdmin}>

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
                {pedidosFiltrados.length === 0 && (
                    <p className="pd-vazio">Nenhum pedido com esse status.</p>
                )}

                {pedidosFiltrados.map((pedido) => {
                    const s = status[pedido.statusPedido];
                    return (
                        <article
                            key={pedido.id}
                            className="pd-card"
                            style={{ "--cor": s.cor, "--fundo": s.fundo } as React.CSSProperties}
                        >
                            <header className="pd-topo">
                                <div className="pd-avatar" aria-hidden="true">
                                    {iniciais(pedido.cliente.nome)}
                                </div>
                                <div className="pd-cliente">
                                    <h3 className="pd-nome">{pedido.cliente.nome}</h3>
                                    <p className="pd-telefone">{pedido.cliente.telefone}</p>
                                </div>
                                <span className="pd-status">{s.rotulo}</span>
                            </header>

                            <ul className="pd-itens">
                                {pedido.itens.map((item, i) => (
                                    <li key={i} className="pd-item">
                                        <span className="pd-qtd">{item.quantidade}×</span>
                                        <span>{item.descricao}</span>
                                    </li>
                                ))}
                            </ul>

                            <footer className="pd-rodape">
                                <span className="pd-id">Pedido #{pedido.id}</span>
                                <strong className="pd-total">{moeda(pedido.total)}</strong>
                            </footer>
                        </article>
                    );
                })}
            </section>
        </MenuInicial>
    );
};
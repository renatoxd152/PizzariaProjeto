import * as React from "react";
import {useMemo, useState} from "react";
import {useNavigate} from "react-router";
import {MenuInicial} from "../LayoutMenu.tsx";
import {PizzaItem} from "../../../pizzas/PizzaItem.tsx";

type Categoria = "Tradicional" | "Especial" | "Doce";

interface Pizza {
    id: number;
    nome: string;
    descricao: string;
    categoria: Categoria;
    preco: number;
    imagem: string;
}

const CATEGORIAS: ("Todas" | Categoria)[] = ["Todas", "Tradicional", "Especial", "Doce"];

const pizzas: Pizza[] = [
    {
        id: 1,
        nome: "Mussarela",
        descricao: "Molho de tomate, mussarela, tomate fatiado e manjericão.",
        categoria: "Tradicional",
        preco: 44.9,
        imagem: "/imagens/mussarela.jpg",
    },
    {
        id: 2,
        nome: "Pepperoni",
        descricao: "Molho de tomate, mussarela e fatias de pepperoni.",
        categoria: "Especial",
        preco: 47.9,
        imagem: "/imagens/pepperoni.jpg",
    },
    {
        id: 3,
        nome: "Pepperoni",
        descricao: "Molho de tomate, mussarela e fatias de pepperoni.",
        categoria: "Especial",
        preco: 47.9,
        imagem: "/imagens/pepperoni.jpg",
    },
    {
        id: 4,
        nome: "Pepperoni",
        descricao: "Molho de tomate, mussarela e fatias de pepperoni.",
        categoria: "Especial",
        preco: 47.9,
        imagem: "/imagens/pepperoni.jpg",
    },{
        id: 5,
        nome: "Pepperoni",
        descricao: "Molho de tomate, mussarela e fatias de pepperoni.",
        categoria: "Especial",
        preco: 47.9,
        imagem: "/imagens/pepperoni.jpg",
    },
    {
        id: 6,
        nome: "Pepperoni",
        descricao: "Molho de tomate, mussarela e fatias de pepperoni.",
        categoria: "Especial",
        preco: 47.9,
        imagem: "/imagens/pepperoni.jpg",
    },
    {
        id: 7,
        nome: "Pepperoni",
        descricao: "Molho de tomate, mussarela e fatias de pepperoni.",
        categoria: "Especial",
        preco: 47.9,
        imagem: "/imagens/pepperoni.jpg",
    },
    {
        id: 7,
        nome: "Pepperoni",
        descricao: "Molho de tomate, mussarela e fatias de pepperoni.",
        categoria: "Especial",
        preco: 47.9,
        imagem: "/imagens/pepperoni.jpg",
    },
    {
        id: 7,
        nome: "Pepperoni",
        descricao: "Molho de tomate, mussarela e fatias de pepperoni.",
        categoria: "Especial",
        preco: 47.9,
        imagem: "/imagens/pepperoni.jpg",
    },
    {
        id: 7,
        nome: "Pepperoni",
        descricao: "Molho de tomate, mussarela e fatias de pepperoni.",
        categoria: "Especial",
        preco: 47.9,
        imagem: "/imagens/pepperoni.jpg",
    },
    {
        id: 7,
        nome: "Pepperoni",
        descricao: "Molho de tomate, mussarela e fatias de pepperoni.",
        categoria: "Especial",
        preco: 47.9,
        imagem: "/imagens/pepperoni.jpg",
    },
    {
        id: 7,
        nome: "Pepperoni",
        descricao: "Molho de tomate, mussarela e fatias de pepperoni.",
        categoria: "Especial",
        preco: 47.9,
        imagem: "/imagens/pepperoni.jpg",
    },
    {
        id: 7,
        nome: "Pepperoni",
        descricao: "Molho de tomate, mussarela e fatias de pepperoni.",
        categoria: "Especial",
        preco: 47.9,
        imagem: "/imagens/pepperoni.jpg",
    },{
        id: 7,
        nome: "Pepperoni",
        descricao: "Molho de tomate, mussarela e fatias de pepperoni.",
        categoria: "Especial",
        preco: 47.9,
        imagem: "/imagens/pepperoni.jpg",
    },{
        id: 7,
        nome: "Pepperoni",
        descricao: "Molho de tomate, mussarela e fatias de pepperoni.",
        categoria: "Especial",
        preco: 47.9,
        imagem: "/imagens/pepperoni.jpg",
    },{
        id: 7,
        nome: "Pepperoni",
        descricao: "Molho de tomate, mussarela e fatias de pepperoni.",
        categoria: "Especial",
        preco: 47.9,
        imagem: "/imagens/pepperoni.jpg",
    },{
        id: 7,
        nome: "Pepperoni",
        descricao: "Molho de tomate, mussarela e fatias de pepperoni.",
        categoria: "Especial",
        preco: 47.9,
        imagem: "/imagens/pepperoni.jpg",
    },{
        id: 7,
        nome: "Pepperoni",
        descricao: "Molho de tomate, mussarela e fatias de pepperoni.",
        categoria: "Especial",
        preco: 47.9,
        imagem: "/imagens/pepperoni.jpg",
    },








];

export const MenuPizzasCliente: React.FC = () => {
    const [busca, setBusca] = useState("");
    const [categoria, setCategoria] = useState<"Todas" | Categoria>("Todas");
    const [qtdPedido, setQtdPedido] = useState(0);
    const navigate = useNavigate();
    const pizzasFiltradas = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        return pizzas.filter(
            (p) =>
                (categoria === "Todas" || p.categoria === categoria) &&
                (p.nome.toLowerCase().includes(termo) ||
                    p.descricao.toLowerCase().includes(termo))
        );
    }, [busca, categoria]);

    return (
        <MenuInicial
            titulo="Cardápio de Pizzas"
            subtitulo="Escolha sua pizza favorita e monte seu pedido"
            acoes={
                <button
                    type="button"
                    className="btn btn-success rounded-circle position-relative d-flex align-items-center justify-content-center"
                    style={{ width: 48, height: 48 }}
                    aria-label={`Carrinho, ${qtdPedido} itens`}
                    onClick={() => navigate("/carrinho")}
                >
                    <i className="bi bi-cart3 fs-5"></i>
                    {qtdPedido > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {qtdPedido}
            </span>
                    )}
                </button>
            }
        >
            <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
                <input
                    type="search"
                    className="form-control"
                    style={{ maxWidth: 320 }}
                    placeholder="Buscar pizza..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    aria-label="Buscar pizza"
                />
                <div className="btn-group" role="group" aria-label="Filtrar por categoria">
                    {CATEGORIAS.map((c) => (
                        <button
                            key={c}
                            type="button"
                            className={`btn btn-sm ${categoria === c ? "btn-success" : "btn-outline-success"}`}
                            onClick={() => setCategoria(c)}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {pizzasFiltradas.length === 0 ? (
                <div className="text-center text-muted py-5">
                    <p className="fs-5 mb-1">Nenhuma pizza encontrada</p>
                    <p className="mb-0">Tente outro nome ou categoria.</p>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-4 g-4">
                    {pizzasFiltradas.map((p) => (
                        <div key={p.id} className="col">
                            <PizzaItem
                                nome={p.nome}
                                descricao={p.descricao}
                                categoria={p.categoria}
                                preco={p.preco}
                                imagem={p.imagem}
                                onAdicionar={() => setQtdPedido((q) => q + 1)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </MenuInicial>
    );
};
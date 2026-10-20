import * as React from "react";
import {useMemo, useState} from "react";
import {useNavigate} from "react-router";
import {MenuInicial} from "../LayoutMenu.tsx";
import {PizzaItem} from "../../../pizzas/PizzaItem.tsx";
import type {Pizza} from "../../../../models/Pizza/Pizza.ts";
import {TamanhoPizza} from "../../../../models/Pizza/Pizza.ts";
import {UnidadeMedida} from "../../../../models/Pizza/IngredientePizza.ts";
import {useCarrinho} from "../../../../contexts/CarrinhoContext.tsx";

export const pizzas: Pizza[] = [
    {
        id: 1,
        nome: "Mussarela",
        preco: 44.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/mussarela.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Tomate", quantidade: 4, unidadeMedida: UnidadeMedida.FATIA },
            { nomeIngrediente: "Manjericão", quantidade: 5, unidadeMedida: UnidadeMedida.UNIDADE }
        ]
    },
    {
        id: 2,
        nome: "Pepperoni",
        preco: 47.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/pepperoni.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Pepperoni", quantidade: 12, unidadeMedida: UnidadeMedida.FATIA }
        ]
    },
    {
        id: 3,
        nome: "Pepperoni",
        preco: 47.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/pepperoni.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Pepperoni", quantidade: 12, unidadeMedida: UnidadeMedida.FATIA }
        ]
    },
    {
        id: 4,
        nome: "Pepperoni",
        preco: 47.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/pepperoni.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Pepperoni", quantidade: 12, unidadeMedida: UnidadeMedida.FATIA }
        ]
    },
    {
        id: 5,
        nome: "Pepperoni",
        preco: 47.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/pepperoni.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Pepperoni", quantidade: 12, unidadeMedida: UnidadeMedida.FATIA }
        ]
    },
    {
        id: 6,
        nome: "Pepperoni",
        preco: 47.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/pepperoni.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Pepperoni", quantidade: 12, unidadeMedida: UnidadeMedida.FATIA }
        ]
    },
    {
        id: 7,
        nome: "Pepperoni",
        preco: 47.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/pepperoni.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Pepperoni", quantidade: 12, unidadeMedida: UnidadeMedida.FATIA }
        ]
    },
    {
        id: 8,
        nome: "Pepperoni",
        preco: 47.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/pepperoni.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Pepperoni", quantidade: 12, unidadeMedida: UnidadeMedida.FATIA }
        ]
    },
    {
        id: 9,
        nome: "Pepperoni",
        preco: 47.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/pepperoni.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Pepperoni", quantidade: 12, unidadeMedida: UnidadeMedida.FATIA }
        ]
    },
    {
        id: 10,
        nome: "Pepperoni",
        preco: 47.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/pepperoni.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Pepperoni", quantidade: 12, unidadeMedida: UnidadeMedida.FATIA }
        ]
    },
    {
        id: 11,
        nome: "Pepperoni",
        preco: 47.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/pepperoni.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Pepperoni", quantidade: 12, unidadeMedida: UnidadeMedida.FATIA }
        ]
    },
    {
        id: 12,
        nome: "Pepperoni",
        preco: 47.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/pepperoni.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Pepperoni", quantidade: 12, unidadeMedida: UnidadeMedida.FATIA }
        ]
    },
    {
        id: 13,
        nome: "Pepperoni",
        preco: 47.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/pepperoni.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Pepperoni", quantidade: 12, unidadeMedida: UnidadeMedida.FATIA }
        ]
    },
    {
        id: 14,
        nome: "Pepperoni",
        preco: 47.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/pepperoni.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Pepperoni", quantidade: 12, unidadeMedida: UnidadeMedida.FATIA }
        ]
    },
    {
        id: 15,
        nome: "Pepperoni",
        preco: 47.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/pepperoni.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Pepperoni", quantidade: 12, unidadeMedida: UnidadeMedida.FATIA }
        ]
    },
    {
        id: 16,
        nome: "Pepperoni",
        preco: 47.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/pepperoni.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Pepperoni", quantidade: 12, unidadeMedida: UnidadeMedida.FATIA }
        ]
    },
    {
        id: 17,
        nome: "Pepperoni",
        preco: 47.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/pepperoni.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Pepperoni", quantidade: 12, unidadeMedida: UnidadeMedida.FATIA }
        ]
    },
    {
        id: 18,
        nome: "Pepperoni",
        preco: 47.90,
        tamanhoPizza: TamanhoPizza.GRANDE,
        imagem: "/imagens/pizzas/pepperoni.jpg",
        ingredientes: [
            { nomeIngrediente: "Molho de tomate", quantidade: 100, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Mussarela", quantidade: 250, unidadeMedida: UnidadeMedida.GRAMA },
            { nomeIngrediente: "Pepperoni", quantidade: 12, unidadeMedida: UnidadeMedida.FATIA }
        ]
    }
];

export const MenuPizzasCliente: React.FC = () => {
    const [busca, setBusca] = useState("");
    const navigate = useNavigate();
    const {totalItens, adicionar} = useCarrinho();
    const pizzasFiltradas = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        return pizzas.filter(
            (p) =>
                p.nome.toLowerCase().includes(termo) ||
                p.ingredientes.some((i) =>
                    i.nomeIngrediente.toLowerCase().includes(termo)
                )
        );
    }, [busca]);

    const descricaoPizza = (p: Pizza) =>
        p.ingredientes
            .map((i) => `${i.nomeIngrediente} (${i.quantidade} ${i.unidadeMedida.toLowerCase()})`)
            .join(", ");

    const handleAdicionarPizza =(pizza: Pizza) =>
    {
        adicionar("pizza",pizza);
    }

    return (
        <MenuInicial
            titulo="Cardápio de Pizzas"
            subtitulo="Escolha sua pizza favorita e monte seu pedido"
            acoes={
                <button
                    type="button"
                    className="btn btn-success rounded-circle position-relative d-flex align-items-center justify-content-center"
                    style={{ width: 48, height: 48 }}
                    aria-label={`Carrinho, ${totalItens} itens`}
                    onClick={() => navigate("/carrinho")}
                >
                    <i className="bi bi-cart3 fs-5"></i>
                    {totalItens > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {totalItens}
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
                                descricao={descricaoPizza(p)}
                                preco={p.preco}
                                imagem={p.imagem}
                                onAdicionar={() => handleAdicionarPizza(p)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </MenuInicial>
    );
};
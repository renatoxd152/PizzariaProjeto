import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router";
import {MenuInicial} from "../LayoutMenu.tsx";
import {PizzaItem} from "../../../pizzas/PizzaItem.tsx";
import type {Pizza} from "../../../../models/Pizza/Pizza.ts";
import {useCarrinho} from "../../../../contexts/CarrinhoContext.tsx";
import {itensMenu} from "../../../config/MenuCliente.ts";
import {useCadastroPizzaService} from "../../../../services/cadastro.pizzas.service.ts";

export const MenuPizzasCliente: React.FC = () => {
    const [busca, setBusca] = useState("");
    const navigate = useNavigate();
    const {totalItens} = useCarrinho();
    const [pizzas, setPizzas] = useState<Pizza[]>([]);
    const service = useCadastroPizzaService();
    const url = import.meta.env.VITE_SERVICO_PIZZA_URL;

    useEffect(() => {
        service.listar().then((response) => {
            setPizzas(response);
        });
    }, []);

    const pizzasFiltradas = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        return pizzas.filter(
            (p) =>
                p.nome.toLowerCase().includes(termo) ||
                p.itens.some((i) =>
                    i.nomeIngrediente.toLowerCase().includes(termo)
                )
        );
    }, [busca, pizzas]);

    const descricaoPizza = (p: Pizza) =>
        p.itens
            .map((i) => `${i.nomeIngrediente} (${i.quantidade} ${i.unidadeMedida.toLowerCase()})`)
            .join(", ");

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
            itensMenu={itensMenu}
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
                                imagem={`${url}${p.imagem}`}
                                onClick={() => navigate(`/editar/pizza/${p.id}`)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </MenuInicial>
    );
};
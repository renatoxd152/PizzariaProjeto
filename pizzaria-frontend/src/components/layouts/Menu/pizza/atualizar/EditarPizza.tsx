import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {MenuInicial} from "../../LayoutMenu.tsx";
import {useCarrinho} from "../../../../../contexts/CarrinhoContext.tsx";
import {type Pizza} from "../../../../../models/Pizza/Pizza.ts";
import {itensMenu} from "../../../../config/MenuCliente.ts";
import {useCadastroPizzaService} from "../../../../../services/cadastro.pizzas.service.ts";

const formatarPreco = (valor: number) =>
    valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});

export const MenuEditPizza: React.FC = () => {
    const navigate = useNavigate();
    const {adicionar} = useCarrinho();
    const [removidos, setRemovidos] = useState<string[]>([]);
    const [observacao, setObservacao] = useState("");
    const [quantidade, setQuantidade] = useState(1);
    const {id} = useParams<{ id: string }>();
    const service = useCadastroPizzaService();
    const [pizza, setPizza] = useState<Pizza | null>(null);
    const [carregando, setCarregando] = useState(true);
    const url = import.meta.env.VITE_SERVICO_PIZZA_URL;

    useEffect(() => {
        if (!id) {
            setCarregando(false);
            return;
        }

        service.listarPizza(id)
            .then(setPizza)
            .catch(() => setPizza(null))
            .finally(() => setCarregando(false));
    }, [id]);

    if (carregando) {
        return (
            <MenuInicial titulo="Carregando..." subtitulo="" itensMenu={itensMenu}>
                <p>Carregando pizza...</p>
            </MenuInicial>
        );
    }

    if (!pizza) {
        return (
            <MenuInicial titulo="Pizza não encontrada" subtitulo="Não encontramos essa pizza no cardápio." itensMenu={itensMenu}>
                <button className="btn btn-success" onClick={() => navigate("/pizzas")}>
                    Voltar ao cardápio
                </button>
            </MenuInicial>
        );
    }

    const semIngredientes = removidos.length === pizza.itens.length;

    const alternarIngrediente = (nome: string) =>
        setRemovidos((atual) =>
            atual.includes(nome) ? atual.filter((n) => n !== nome) : [...atual, nome]
        );

    const handleAdicionar = () => {
        if (semIngredientes) return;
        const pizzaFinal: Pizza = {
            ...pizza,
            id: pizza.id,
            itens: pizza.itens.filter(
                (ing) => !removidos.includes(ing.nomeIngrediente)
            ),
            observacao: observacao
        };

        adicionar("pizza", pizzaFinal, quantidade);
        navigate("/carrinho");
    };

    return (
        <MenuInicial
            titulo="Personalize a pizza da sua forma!"
            subtitulo="Deixe sua pizza mais especial e do seu jeito."
            itensMenu={itensMenu}
        >
            <button className="btn btn-link px-0 mb-3" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left me-1"></i>Voltar
            </button>
            {semIngredientes && (
                <div className="alert alert-warning d-flex align-items-center gap-2 mt-3 mb-0" role="alert">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <span>Sua pizza precisa ter pelo menos um ingrediente. Marque algum para continuar.</span>
                </div>
            )}
            <div className="row g-4">
                <div className="col-lg-5">
                    <div className="card shadow-sm">
                        <img
                            src={`${url}${pizza.imagem}`}
                            alt={pizza.nome}
                            className="card-img-top"
                            style={{height: 300, objectFit: "cover"}}
                        />
                        <div className="card-body">
                            <h2 className="h4 mb-1">{pizza.nome}</h2>
                            <span className="badge bg-secondary mb-2">{pizza.tamanho}</span>
                            <p className="fs-4 fw-bold text-success mb-0">{formatarPreco(pizza.preco)}</p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-7">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h3 className="h5">Ingredientes</h3>
                            <p className="text-muted small">Desmarque o que você não quer.</p>

                            <ul className="list-group list-group-flush">
                                {pizza.itens.map((ing) => {
                                    const ativo = !removidos.includes(ing.nomeIngrediente);
                                    return (
                                        <li
                                            key={ing.nomeIngrediente}
                                            className="list-group-item d-flex justify-content-between align-items-center px-0"
                                        >
                                            <div className="form-check form-switch mb-0">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    id={`ing-${ing.nomeIngrediente}`}
                                                    checked={ativo}
                                                    onChange={() => alternarIngrediente(ing.nomeIngrediente)}
                                                />
                                                <label
                                                    className={`form-check-label ${ativo ? "" : "text-decoration-line-through text-muted"}`}
                                                    htmlFor={`ing-${ing.nomeIngrediente}`}
                                                >
                                                    {ing.nomeIngrediente}
                                                </label>
                                            </div>
                                            <small className="text-muted">
                                                {ing.quantidade} {ing.unidadeMedida.toLowerCase()}
                                            </small>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h3 className="h5">Observações</h3>
                            <textarea
                                className="form-control"
                                rows={3}
                                maxLength={200}
                                placeholder="Ex: bem assada, cortar em 12 pedaços..."
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                            />
                            <div className="form-text text-end">{observacao.length}/200</div>
                        </div>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body d-flex flex-wrap gap-3 align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <button
                                    className="btn btn-outline-secondary"
                                    disabled={quantidade <= 1}
                                    onClick={() => setQuantidade((q) => q - 1)}
                                    aria-label="Diminuir quantidade"
                                >
                                    −
                                </button>
                                <span style={{minWidth: 32}} className="text-center fw-bold">{quantidade}</span>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setQuantidade((q) => q + 1)}
                                    aria-label="Aumentar quantidade"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                className="btn btn-success btn-lg flex-grow-1"
                                onClick={handleAdicionar}
                                disabled={semIngredientes}
                            >
                                Adicionar • {formatarPreco(pizza.preco * quantidade)}
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </MenuInicial>
    );
};
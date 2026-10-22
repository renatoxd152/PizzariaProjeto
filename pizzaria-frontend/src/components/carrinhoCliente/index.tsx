import * as React from "react";
import {useNavigate} from "react-router";
import {MenuInicial} from "../layouts/Menu/LayoutMenu.tsx";
import {useCarrinho} from "../../contexts/CarrinhoContext.tsx";
import {itensMenu} from "../config/MenuCliente.ts";

const formatarPreco = (valor: number) =>
    valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});

export const CarrinhoCliente: React.FC = () =>
{
    const navigate = useNavigate();
    const {itens, totalItens, valorTotal: subtotal, alterarQuantidade, removerItem, limparCarrinho} = useCarrinho();

    const taxaEntrega = itens.length > 0 ? 5 : 0;
    const total = subtotal + taxaEntrega;

    return(
        <MenuInicial
            titulo={<><i className="bi bi-cart3 me-2"></i>Seu pedido</>}
            subtitulo={`${totalItens} ${totalItens === 1 ? "item" : "itens"} no carrinho. Revise antes de finalizar.`}
            tituloClassName="titulo-compacto"
            itensMenu={itensMenu}>
            {itens.length === 0 ? (
                <div className="text-center text-muted py-5">
                    <p className="fs-5 mb-3">Seu carrinho está vazio</p>
                    <button className="btn btn-success" onClick={() => navigate("/pizzas")}>
                        Ver cardápio
                    </button>
                </div>
            ) : (
                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="card">
                            <ul className="list-group list-group-flush">
                                {itens.map((item) => {
                                    const {tipo, produto, quantidade} = item;
                                    return (
                                        <li key={`${tipo}-${produto.id}`} className="list-group-item">
                                            <div className="d-flex gap-3 align-items-center">
                                                <img
                                                    src={produto.imagem}
                                                    alt={produto.nome}
                                                    className="rounded"
                                                    style={{width: 80, height: 80, objectFit: "cover"}}
                                                />

                                                <div className="flex-grow-1">
                                                    <h6 className="mb-0">{produto.nome}</h6>
                                                    {item.tipo === "pizza" && (
                                                        <>
                                                            <small className="text-muted d-block">
                                                                Tamanho: {item.produto.tamanhoPizza}
                                                            </small>
                                                            <small className="text-muted">
                                                                {item.produto.ingredientes.map((i) => i.nomeIngrediente).join(", ")}
                                                            </small>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="d-flex align-items-center gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => alterarQuantidade(tipo, produto.id, -1)}
                                                        aria-label="Diminuir quantidade"
                                                    >
                                                        −
                                                    </button>
                                                    <span style={{minWidth: 24}} className="text-center">
                                                        {quantidade}
                                                    </span>
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => alterarQuantidade(tipo, produto.id, 1)}
                                                        aria-label="Aumentar quantidade"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="text-end" style={{minWidth: 100}}>
                                                    <strong>{formatarPreco(produto.preco * quantidade)}</strong>
                                                    <div>
                                                        <button
                                                            className="btn btn-link btn-sm text-danger p-0"
                                                            onClick={() => removerItem(tipo, produto.id)}
                                                        >
                                                            Remover
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <button className="btn btn-link text-danger mt-2 px-0" onClick={limparCarrinho}>
                            Esvaziar carrinho
                        </button>
                    </div>

                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Resumo do pedido</h5>

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Itens ({totalItens})</span>
                                    <span>{formatarPreco(subtotal)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Taxa de entrega</span>
                                    <span>{formatarPreco(taxaEntrega)}</span>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between mb-3">
                                    <strong>Total</strong>
                                    <strong>{formatarPreco(total)}</strong>
                                </div>

                                <button
                                    className="btn btn-success w-100"
                                    onClick={() => navigate("/checkout")}
                                >
                                    Finalizar pedido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MenuInicial>
    )
}
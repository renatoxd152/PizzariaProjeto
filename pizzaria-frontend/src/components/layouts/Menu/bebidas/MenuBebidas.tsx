import * as React from "react";
import {MenuInicial} from "../LayoutMenu.tsx";
import {useMemo, useState} from "react";
import {useNavigate} from "react-router";
import {useCarrinho} from "../../../../contexts/CarrinhoContext.tsx";
import type {Bebida} from "../../../../models/Bebida.ts";
import {BebidaItem} from "../../../bebidas/BebidaItem.tsx";

const bebidas: Bebida[] = [ {
    id: 1,
    nome: "Coca-Cola 350ml",
    preco: 6.00,
    imagem: "/imagens/bebidas/coca-cola.png"
},
    {
        id: 2,
        nome: "Guaraná Antarctica 350ml",
        preco: 6.00,
        imagem: "/imagens/bebidas/guarana.png"
    },
    {
        id: 3,
        nome: "Fanta Laranja 350ml",
        preco: 6.00,
        imagem: "/imagens/bebidas/fanta.png"
    },
    {
        id: 4,
        nome: "Sprite 350ml",
        preco: 6.00,
        imagem: "/imagens/bebidas/sprite.png"
    }]


export const MenuBebidas: React.FC = () =>
{
    const [busca, setBusca] = useState("");
    const navigate = useNavigate();
    const {totalItens, adicionar} = useCarrinho();
    const bebidasFiltradas = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        return bebidas.filter(
            (p) =>
                p.nome.toLowerCase().includes(termo)
        );
    }, [busca]);

    const handleAdicionarBebida = (bebida: Bebida) =>
    {
        adicionar("bebida",bebida);
    }
    return (
        <MenuInicial
            titulo="Cardápio de Bebidas"
            subtitulo="Escolha sua bebida favorita"
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

            {bebidasFiltradas.length === 0 ? (
                <div className="text-center text-muted py-5">
                    <p className="fs-5 mb-1">Nenhuma bebida encontrada</p>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-4 g-4">
                    {bebidasFiltradas.map((p) => (
                        <div key={p.id} className="col">
                            <BebidaItem
                                nome={p.nome}
                                preco={p.preco}
                                imagem={p.imagem}
                                onAdicionar={() => handleAdicionarBebida(p)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </MenuInicial>
    );
}

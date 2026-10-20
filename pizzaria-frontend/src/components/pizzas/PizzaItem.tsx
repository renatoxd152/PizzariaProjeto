import * as React from "react";
import "./index.css";

interface PizzaItemProps {
    nome: string;
    descricao: string;
    preco: number;
    imagem: string;
    onClick: () => void;
}

export const PizzaItem: React.FC<PizzaItemProps> = ({
                                                        nome,
                                                        descricao,
                                                        preco,
                                                        imagem,
                                                        onClick
                                                    }) => {
    const precoFormatado = preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    return (
        <article className="card h-100 shadow-sm card-produto" onClick={onClick}>
            <div className="card-produto__imagem">
                <img src={imagem} alt={nome} loading="lazy" className="card-img-top" />
            </div>

            <div className="card-body d-flex flex-column">
                <h2 className="h5 card-title mb-1">{nome}</h2>
                <p className="card-text text-muted small card-produto__descricao">{descricao}</p>

                <div className="d-flex align-items-center justify-content-between mt-auto pt-3">
                    <span className="fw-bold text-success fs-5">{precoFormatado}</span>
                </div>
            </div>
        </article>
    );
};
import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";
import type {Pizza} from "../models/Pizza/Pizza.ts";

export interface ItemCarrinho {
    pizza: Pizza;
    quantidade: number;
}

interface CarrinhoContextType {
    itens: ItemCarrinho[];
    totalItens: number;
    adicionarPizza: (pizza: Pizza) => void;
    alterarQuantidade: (id: number, delta: number) => void;
    removerPizza: (id: number) => void;
    limparCarrinho: () => void;
}

const CHAVE_CARRINHO = "carrinho";

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

const carregarCarrinho = (): ItemCarrinho[] => {
    try {
        const salvo = localStorage.getItem(CHAVE_CARRINHO);
        const dados = salvo ? JSON.parse(salvo) : [];
        // Ignora o formato antigo (array de pizzas sem "quantidade")
        return Array.isArray(dados) && dados.every((i) => i?.pizza && typeof i.quantidade === "number")
            ? (dados as ItemCarrinho[])
            : [];
    } catch {
        return [];
    }
};

export const CarrinhoProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [itens, setItens] = useState<ItemCarrinho[]>(carregarCarrinho);

    useEffect(() => {
        localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
    }, [itens]);

    const adicionarPizza = (pizza: Pizza) =>
        setItens((atual) => {
            const existe = atual.some((i) => i.pizza.id === pizza.id);
            return existe
                ? atual.map((i) => i.pizza.id === pizza.id ? {...i, quantidade: i.quantidade + 1} : i)
                : [...atual, {pizza, quantidade: 1}];
        });

    const alterarQuantidade = (id: number, delta: number) =>
        setItens((atual) =>
            atual
                .map((i) => i.pizza.id === id ? {...i, quantidade: i.quantidade + delta} : i)
                .filter((i) => i.quantidade > 0)
        );

    const removerPizza = (id: number) =>
        setItens((atual) => atual.filter((i) => i.pizza.id !== id));

    const limparCarrinho = () => setItens([]);

    const totalItens = itens.reduce((soma, i) => soma + i.quantidade, 0);

    return (
        <CarrinhoContext.Provider
            value={{itens, totalItens, adicionarPizza, alterarQuantidade, removerPizza, limparCarrinho}}
        >
            {children}
        </CarrinhoContext.Provider>
    );
};

export const useCarrinho = () => {
    const ctx = useContext(CarrinhoContext);
    if (!ctx) throw new Error("useCarrinho deve ser usado dentro de CarrinhoProvider");
    return ctx;
};
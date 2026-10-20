import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";
import type {Pizza} from "../models/Pizza/Pizza.ts";
import type {Bebida} from "../models/Bebida.ts";

export interface ProdutosPorTipo {
    pizza: Pizza;
    bebida: Bebida;
}

export type TipoItem = keyof ProdutosPorTipo;

export type ItemCarrinho = {
    [K in TipoItem]: { tipo: K; produto: ProdutosPorTipo[K]; quantidade: number };
}[TipoItem];

interface CarrinhoContextType {
    itens: ItemCarrinho[];
    totalItens: number;
    valorTotal: number;
    adicionar: <K extends TipoItem>(tipo: K, produto: ProdutosPorTipo[K]) => void;
    alterarQuantidade: (tipo: TipoItem, id: number, delta: number) => void;
    removerItem: (tipo: TipoItem, id: number) => void;
    limparCarrinho: () => void;
}

const CHAVE_CARRINHO = "carrinho";
const TIPOS_VALIDOS: string[] = ["pizza", "bebida"];

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

const carregarCarrinho = (): ItemCarrinho[] => {
    try {
        const salvo = localStorage.getItem(CHAVE_CARRINHO);
        const dados = salvo ? JSON.parse(salvo) : [];
        return Array.isArray(dados) && dados.every(
            (i) => TIPOS_VALIDOS.includes(i?.tipo) && i.produto && typeof i.quantidade === "number"
        )
            ? (dados as ItemCarrinho[])
            : [];
    } catch {
        return [];
    }
};

const mesmoItem = (i: ItemCarrinho, tipo: TipoItem, id: number) =>
    i.tipo === tipo && i.produto.id === id;

export const CarrinhoProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [itens, setItens] = useState<ItemCarrinho[]>(carregarCarrinho);

    useEffect(() => {
        localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
    }, [itens]);

    const adicionar = <K extends TipoItem>(tipo: K, produto: ProdutosPorTipo[K]) =>
        setItens((atual) => {
            const existe = atual.some((i) => mesmoItem(i, tipo, produto.id));
            return existe
                ? atual.map((i) => mesmoItem(i, tipo, produto.id) ? {...i, quantidade: i.quantidade + 1} : i)
                : [...atual, {tipo, produto, quantidade: 1} as ItemCarrinho];
        });

    const alterarQuantidade = (tipo: TipoItem, id: number, delta: number) =>
        setItens((atual) =>
            atual
                .map((i) => mesmoItem(i, tipo, id) ? {...i, quantidade: i.quantidade + delta} : i)
                .filter((i) => i.quantidade > 0)
        );

    const removerItem = (tipo: TipoItem, id: number) =>
        setItens((atual) => atual.filter((i) => !mesmoItem(i, tipo, id)));

    const limparCarrinho = () => setItens([]);

    const totalItens = itens.reduce((soma, i) => soma + i.quantidade, 0);
    const valorTotal = itens.reduce((soma, i) => soma + i.produto.preco * i.quantidade, 0);

    return (
        <CarrinhoContext.Provider
            value={{itens, totalItens, valorTotal, adicionar, alterarQuantidade, removerItem, limparCarrinho}}
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
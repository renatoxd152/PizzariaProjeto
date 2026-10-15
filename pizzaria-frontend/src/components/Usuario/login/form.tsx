import {type Usuario} from "../../../models/Usuario/Usuario.ts";
import * as React from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import type {UsuarioLogin} from "../../../models/Usuario/UsuarioLogin.ts";
import {useNavigate} from "react-router";

interface UsuarioFormProps {
    onSubmit: (usuario: UsuarioLogin) => void | Promise<void>;
    usuario?: Usuario;
}

const usuarioSchema = z.object({
    cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 números"),
    senha: z.string().min(6, "Mínimo de 6 caracteres")
});

type UsuarioFormData = z.infer<typeof usuarioSchema>;

interface CampoProps {
    label: string;
    erro?: string;
    children: React.ReactNode;
}

const Campo = ({label, erro, children}: CampoProps) => (
    <div className="mb-3">
        <label className="form-label fw-semibold">{label}</label>
        {children}
        <div className="invalid-feedback">{erro}</div>
    </div>
);

const classe = (base: string, erro?: string) => (erro ? `${base} is-invalid` : base);

export const LoginUsuarioForm: React.FC<UsuarioFormProps> = ({onSubmit, usuario}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<UsuarioFormData>({
        resolver: zodResolver(usuarioSchema),
        defaultValues: {
            cpf: usuario?.cpf ?? "",
            senha: ""
        },
    });
    const navigate = useNavigate();

    const enviar = async (dados: UsuarioFormData) => {
        await onSubmit(dados);
        navigate("/pizzas")
        reset();
    };

    return (
        <form
            onSubmit={handleSubmit(enviar)}
            noValidate
            className="border p-4 rounded shadow bg-white mx-auto"
            style={{width: "100%", maxWidth: 440}}
        >
            <Campo label="CPF" erro={errors.cpf?.message}>
                <input
                    {...register("cpf")}
                    className={classe("form-control", errors.cpf?.message)}
                    placeholder="Somente números"
                    inputMode="numeric"
                    maxLength={11}
                />
            </Campo>

            <Campo label="Senha" erro={errors.senha?.message}>
                <input
                    {...register("senha")}
                    type="password"
                    className={classe("form-control", errors.senha?.message)}
                    placeholder="Mínimo de 6 caracteres"
                    autoComplete="new-password"
                />
            </Campo>

            <button type="submit" className="btn btn-primary w-100 mt-2" disabled={isSubmitting}>
                {isSubmitting ? "Entrando..." : "Fazer Login"}
            </button>
        </form>
    );
};
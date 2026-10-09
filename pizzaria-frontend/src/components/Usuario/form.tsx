import {type Usuario, UsuarioRole} from "../../models/Usuario/Usuario.ts";
import * as React from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

interface UsuarioFormProps {
    onSubmit: (usuario: Usuario) => void | Promise<void>;
    usuario?: Usuario;
}

const usuarioSchema = z.object({
    nome: z.string().min(2, "Informe o nome"),
    telefone: z.string().regex(/^\d{10,11}$/, "Telefone com DDD, somente números"),
    cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 números"),
    email: z.email("E-mail inválido"),
    senha: z.string().min(6, "Mínimo de 6 caracteres"),
    usuarioRole: z.enum(UsuarioRole, {error: "Selecione o perfil"}),
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

export const CadastroUsuarioForm: React.FC<UsuarioFormProps> = ({onSubmit, usuario}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<UsuarioFormData>({
        resolver: zodResolver(usuarioSchema),
        defaultValues: {
            nome: usuario?.nome ?? "",
            telefone: usuario?.telefone ?? "",
            cpf: usuario?.cpf ?? "",
            email: usuario?.email ?? "",
            senha: "",
            usuarioRole: usuario?.usuarioRole,
        },
    });

    const enviar = async (dados: UsuarioFormData) => {
        await onSubmit(dados);
        reset();
    };

    return (
        <form
            onSubmit={handleSubmit(enviar)}
            noValidate
            className="border p-4 rounded shadow bg-white mx-auto"
            style={{width: "100%", maxWidth: 440}}
        >
            <Campo label="Nome" erro={errors.nome?.message}>
                <input
                    {...register("nome")}
                    className={classe("form-control", errors.nome?.message)}
                    placeholder="Nome completo"
                    autoComplete="name"
                />
            </Campo>

            <div className="row">
                <div className="col-md-6">
                    <Campo label="Telefone" erro={errors.telefone?.message}>
                        <input
                            {...register("telefone")}
                            className={classe("form-control", errors.telefone?.message)}
                            placeholder="16999999999"
                            inputMode="numeric"
                            maxLength={11}
                            autoComplete="tel"
                        />
                    </Campo>
                </div>
                <div className="col-md-6">
                    <Campo label="CPF" erro={errors.cpf?.message}>
                        <input
                            {...register("cpf")}
                            className={classe("form-control", errors.cpf?.message)}
                            placeholder="Somente números"
                            inputMode="numeric"
                            maxLength={11}
                        />
                    </Campo>
                </div>
            </div>

            <Campo label="E-mail" erro={errors.email?.message}>
                <input
                    {...register("email")}
                    type="email"
                    className={classe("form-control", errors.email?.message)}
                    placeholder="nome@email.com"
                    autoComplete="email"
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

            <Campo label="Perfil" erro={errors.usuarioRole?.message}>
                <select
                    {...register("usuarioRole")}
                    className={classe("form-select", errors.usuarioRole?.message)}
                >
                    <option value="">Selecione o perfil</option>
                    <option value={UsuarioRole.CLIENTE}>Cliente</option>
                    <option value={UsuarioRole.ADMIN}>Administrador</option>
                </select>
            </Campo>

            <button type="submit" className="btn btn-primary w-100 mt-2" disabled={isSubmitting}>
                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </button>
        </form>
    );
};
export enum UsuarioRole{
    ADMIN = "ADMIN",
    CLIENTE = "CLIENTE"
}

export interface Usuario
{
    nome:string;
    telefone:string;
    cpf:string;
    email:string;
    senha:string;
    usuarioRole:UsuarioRole

}

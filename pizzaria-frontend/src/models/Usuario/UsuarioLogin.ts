export interface UsuarioLogin
{
    cpf:string;
    senha:string;
}

export interface TokenResponse {
    token:string;
    expireIn:number;
}
package projeto.microservices.pedidos.client.representation;

import projeto.microservices.pedidos.client.enums.UsuarioRole;

public record ClienteRepresentation (String nome, String telefone, String cpf , String id, UsuarioRole usuarioRole){
}

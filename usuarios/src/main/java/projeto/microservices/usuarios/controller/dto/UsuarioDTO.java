package projeto.microservices.usuarios.controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import projeto.microservices.usuarios.model.enums.UsuarioRole;

public record UsuarioDTO(
        @NotBlank(message = "Nome não pode ser vazio!")
        String nome,
        @NotBlank(message = "Telefone não pode ser vazio!")
        String telefone,
        @NotBlank(message = "O CPF não pode ser vazio!")
        String cpf,
        @NotBlank(message = "Email não pode ser vazio!")
        @Email(message = "Email inválido!")
        String email,
        @NotBlank(message = "A senha deve ter no mínimo 8 caracteres")
        String senha,
        @NotNull(message = "É necessário colocar o nível do usuário")
        UsuarioRole usuarioRole
) {
}

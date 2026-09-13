package projeto.microservices.clientes.controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ClienteDTO (
        @NotBlank(message = "Nome não pode ser vazio!")
        String nome,
        @NotBlank(message = "Telefone não pode ser vazio!")
        String telefone,
        @NotBlank(message = "O CPF não pode ser vazio!")
        String cpf,
        @NotBlank(message = "Email não pode ser vazio!")
        @Email(message = "Email inválido!")
        String email) {
}

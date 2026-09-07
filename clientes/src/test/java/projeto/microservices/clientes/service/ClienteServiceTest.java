package projeto.microservices.clientes.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import projeto.microservices.clientes.exception.ClienteException;
import projeto.microservices.clientes.model.Cliente;
import projeto.microservices.clientes.repository.ClienteRepository;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private ClienteService clienteService;

    @Test
    @DisplayName("Deve lançar uma exceção em caso de o CPF já existir")
    public void deveEmitirExcecaoComCpfExistente()
    {
        Cliente cliente = new Cliente();
        cliente.setCpf("48121231221");

        when(clienteRepository.existsByCpf("48121231221")).thenReturn(true);
        ClienteException exception = assertThrows(ClienteException.class,
                () -> clienteService.adicionarCliente(cliente));

        assertThat(exception.getMessage()).isEqualTo("Esse CPF já está cadastrado!");
    }




}

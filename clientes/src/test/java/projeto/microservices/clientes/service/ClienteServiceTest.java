package projeto.microservices.clientes.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import projeto.microservices.clientes.client.PedidoClient;
import projeto.microservices.clientes.client.enums.StatusPedido;
import projeto.microservices.clientes.client.representation.PedidoRepresentation;
import projeto.microservices.clientes.client.representation.PizzaRepresentation;
import projeto.microservices.clientes.exception.ClienteException;
import projeto.microservices.clientes.model.Cliente;
import projeto.microservices.clientes.repository.ClienteRepository;

import javax.swing.text.html.Option;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private ClienteService clienteService;

    private Cliente cliente;

    @Mock
    private PedidoClient pedidoClient;

    @Mock
    private PizzaRepresentation pizzaRepresentation;

    @Mock
    private List<PedidoRepresentation> pedidoRepresentation;

    @BeforeEach
    void setup()
    {
        cliente = new Cliente();

        cliente.setId("idCliente");
        cliente.setCpf("47613163121");
        cliente.setTelefone("17113123123");
        cliente.setEmail("teste@gmail.com");
        cliente.setNome("Cliente");

        pizzaRepresentation = new PizzaRepresentation("Frango com Catupiry", BigDecimal.valueOf(49.9),"id");

        pedidoRepresentation = List.of(new PedidoRepresentation("idPedido",
                StatusPedido.PENDENTE,
                BigDecimal.valueOf(49.9),
                List.of(pizzaRepresentation)));
    }

    @Nested
    public class AdicionarClientes
    {
        @Test
        @DisplayName("Deve lançar uma exceção em caso se o CPF já existir")
        public void deveEmitirExcecaoComCpfExistente()
        {
            Cliente cliente = new Cliente();
            cliente.setCpf("48121231221");

            when(clienteRepository.existsByCpf("48121231221")).thenReturn(true);
            ClienteException exception = assertThrows(ClienteException.class,
                    () -> clienteService.adicionarCliente(cliente));

            assertThat(exception.getMessage()).isEqualTo("Esse CPF já está cadastrado!");
        }

        @Test
        @DisplayName("Deve cadastrar um novo cliente")
        public void deveCadastrarCliente()
        {
            when(clienteRepository.existsByCpf(cliente.getCpf())).thenReturn(false);
            when(clienteRepository.save(cliente)).thenReturn(cliente);
            Cliente resultado = clienteService.adicionarCliente(cliente);
            assertEquals(cliente,resultado);
        }
    }

    @Nested
    public class ListarClientes
    {
        @Test
        @DisplayName("Deve listar cliente por ID")
        public void deveListarClientePorId()
        {

            when(clienteRepository.findById("idCliente")).thenReturn(Optional.of(cliente));

            Cliente resultado = clienteService.listarClientePorId("idCliente");

            assertEquals(cliente, resultado);
        }

        @Test
        @DisplayName("Deve listar se não tiver clientes")
        public void deveListarSeNãoTiverClientes()
        {
            when(clienteRepository.findById("idCliente")).thenReturn(Optional.empty());

            ResponseStatusException exception = assertThrows(
                    ResponseStatusException.class,
                    () -> clienteService.listarClientePorId("idCliente")
            );

            assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        }

        @Test
        @DisplayName("Deve listar um cliente pelo CPF")
        public void listarClientePorCPF()
        {
            when(clienteRepository.findByCpf(cliente.getCpf())).thenReturn(Optional.of(cliente));

            Cliente resultado = clienteService.listarClientePorCPF(cliente.getCpf());

            assertEquals(cliente,resultado);
        }

        @Test
        @DisplayName("Deve gerar uma mensagem de erro com o status de não encontrado")
        public void deveGerarMensagemComNotFound()
        {
            when(clienteRepository.findByCpf("46412315212")).thenReturn(Optional.empty());

            ResponseStatusException exception = assertThrows(
                    ResponseStatusException.class,
                    () -> clienteService.listarClientePorCPF("46412315212")
            );

            assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        }
    }

    @Nested
    public class AtualizarClientes
    {
        @Test
        @DisplayName("Deve atualizar um cliente existente")
        public void deveAtualizarUmClienteExistente()
        {
            Cliente cliente = new Cliente();
            cliente.setId("idCliente");
            cliente.setCpf("47613163121");
            cliente.setTelefone("17113123123");
            cliente.setEmail("teste@gmail.com");
            cliente.setNome("Cliente");

            Cliente clienteAtualizado = new Cliente();
            clienteAtualizado.setId("idCliente");
            clienteAtualizado.setCpf("47613163121");
            clienteAtualizado.setTelefone("1699312641");
            clienteAtualizado.setEmail("renato@gmail.com");
            clienteAtualizado.setNome("Renato");

            when(clienteRepository.save(cliente)).thenReturn(cliente);
            when(clienteRepository.findByCpf("47613163121"))
                    .thenReturn(Optional.of(cliente));

            Cliente resultado = clienteService.atualizarCliente("47613163121",clienteAtualizado);

            assertEquals(cliente, resultado);
        }

        @Test
        @DisplayName("Deve retornar erro se não encontrar o cliente para atualizar")
        public void deveRetornarErroSeNaoEncontrarOCliente()
        {
            Cliente clienteAtualizado = new Cliente();
            clienteAtualizado.setId("idCliente");
            clienteAtualizado.setCpf("47613163121");
            clienteAtualizado.setTelefone("1699312641");
            clienteAtualizado.setEmail("renato@gmail.com");
            clienteAtualizado.setNome("Renato");

            ResponseStatusException exception = assertThrows(
                    ResponseStatusException.class,
                    () -> clienteService.atualizarCliente("47613163121",clienteAtualizado)
            );

            assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        }

    }

    @Nested
    public class DeletarCliente
    {
        @Test
        @DisplayName("Deve retornar erro se excluir um cliente que não existe")
        public void deveRetornarErroAoDeletarUmClienteQueNaoExiste()
        {
            ResponseStatusException exception = assertThrows(
                    ResponseStatusException.class,
                    () -> clienteService.deletarCliente("47613163121")
            );

            assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        }

        @Test
        @DisplayName("Deve excluir um cliente que existe")
        public void deveExcluirOCliente()
        {
            when(clienteRepository.findByCpf("47613163121")).thenReturn(Optional.of(cliente));
            clienteService.deletarCliente("47613163121");

            verify(clienteRepository).deleteById("idCliente");
        }
    }

    @Nested
    public class ListarPedidos
    {
        @Test
        @DisplayName("Deve listar todos os pedidos de um cliente")
        public void deveListarTodosPedidosDeUmCliente()
        {
            when(pedidoClient.obterPedidosPorIdCliente(cliente.getId())).thenReturn(pedidoRepresentation);

            List<PedidoRepresentation> resultados = clienteService.listarPedidosClientePorId(cliente.getId());

            assertEquals(pedidoRepresentation, resultados);
        }

    }

}

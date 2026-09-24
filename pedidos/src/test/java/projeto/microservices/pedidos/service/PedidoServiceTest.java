package projeto.microservices.pedidos.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import projeto.microservices.pedidos.client.ClienteClient;
import projeto.microservices.pedidos.client.PizzaClient;
import projeto.microservices.pedidos.client.representation.ClienteRepresentation;
import projeto.microservices.pedidos.client.representation.PizzaRepresentation;
import projeto.microservices.pedidos.controller.dto.PedidoDTO;
import projeto.microservices.pedidos.model.Pedido;
import projeto.microservices.pedidos.model.enums.StatusPedido;
import projeto.microservices.pedidos.publisher.PedidoPublisher;
import projeto.microservices.pedidos.repository.PedidoRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PedidoServiceTest {
    @InjectMocks
    private PedidoService pedidoService;
    @Mock
    private PedidoRepository pedidoRepository;
    @Mock
    private ClienteClient clienteClient;
    @Mock
    private PizzaClient pizzaClient;
    @Mock
    private PedidoPublisher pedidoPublisher;
    @Mock
    private PedidoDTO pedidoDTO;
    @Mock
    private ResponseEntity<ClienteRepresentation> clienteResponse;
    @Mock
    private ResponseEntity<List<PizzaRepresentation>> pizzasResponse;
    @Mock
    private ClienteRepresentation clienteRepresentation;
    @Mock
    private PizzaRepresentation pizzaRepresentation;

    private Pedido pedido;
    private  List<Pedido> pedidos;
    @BeforeEach
    void setup()
    {
        clienteRepresentation = new ClienteRepresentation("Renato","1644123312","id");
        pizzaRepresentation = new PizzaRepresentation("Frango com Catupiry", BigDecimal.valueOf(49.9),"id");
        this.pizzasResponse = ResponseEntity.ok(List.of(pizzaRepresentation));
        this.clienteResponse = ResponseEntity.ok(clienteRepresentation);

        pedido = new Pedido();
        pedido.setId("id");
        pedido.setClienteRepresentation(clienteRepresentation);
        pedido.setStatusPedido(StatusPedido.PENDENTE);
        pedido.setTotal(BigDecimal.valueOf(49.9));
        pedido.setPizzas(List.of(pizzaRepresentation));
        pedidos = List.of(pedido);
    }

    @Nested
    public class AdicionarPedido
    {
        @Test
        @DisplayName("Deve adicionar um pedido")
        public void deveAdicionarUmPedido()
        {
            List<String> ids = List.of("id");
            pedidoDTO = new PedidoDTO("47416316312",ids);
            when(clienteClient.obterDadosDoCliente("47416316312")).thenReturn(clienteResponse);
            when(pizzaClient.obterDadosDaPizza(ids)).thenReturn(pizzasResponse);
            when(pedidoRepository.save(any(Pedido.class))).thenReturn(pedido);
            Pedido resultado = pedidoService.adicionarPedido(pedidoDTO);

            assertEquals(pedido,resultado);
            verify(clienteClient).obterDadosDoCliente("47416316312");
            verify(pizzaClient).obterDadosDaPizza(ids);
            verify(pedidoRepository).save(any(Pedido.class));
            verify(pedidoPublisher).publicar(pedido);
        }

    }

    @Nested
    public class ListarPedidos
    {
        @Test
        @DisplayName("Deve listar todos os pedidos")
        public void deveListarPedidos()
        {
            when(pedidoRepository.findAll()).thenReturn(pedidos);
            List<Pedido> resultado = pedidoService.listarPedidos();
            assertEquals(pedidos, resultado);
        }

        @Test
        @DisplayName("Deve listar todos os pedidos pelo Id do Cliente")
        public void deveListarPedidosPeloCPF()
        {

            String idCliente = clienteRepresentation.id();
            when(pedidoRepository.findByIdCliente(idCliente)).thenReturn(pedidos);

            List<Pedido> resultado = pedidoService.listarPedidosPorIdCliente(idCliente);

            assertEquals(pedidos, resultado);
        }


    }


}

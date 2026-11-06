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
import projeto.microservices.pedidos.client.enums.UsuarioRole;
import projeto.microservices.pedidos.client.representation.ClienteRepresentation;
import projeto.microservices.pedidos.controller.dto.IngredienteDTO;
import projeto.microservices.pedidos.controller.dto.ItemPedidoDTO;
import projeto.microservices.pedidos.controller.dto.PedidoDTO;
import projeto.microservices.pedidos.controller.dto.PizzaDTO;
import projeto.microservices.pedidos.controller.mapper.ItemPedidoMapper;
import projeto.microservices.pedidos.model.IngredientePizza;
import projeto.microservices.pedidos.model.ItemPedido;
import projeto.microservices.pedidos.model.Pedido;
import projeto.microservices.pedidos.model.Pizza;
import projeto.microservices.pedidos.model.enums.StatusPedido;
import projeto.microservices.pedidos.model.enums.TamanhoPizza;
import projeto.microservices.pedidos.model.enums.TipoProduto;
import projeto.microservices.pedidos.model.enums.UnidadeMedida;
import projeto.microservices.pedidos.publisher.PedidoPublisher;
import projeto.microservices.pedidos.repository.PedidoRepository;

import java.awt.event.ItemEvent;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
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
    private PedidoPublisher pedidoPublisher;
    @Mock
    private PedidoDTO pedidoDTO;
    @Mock
    private ItemPedidoDTO itemPedidoDTO;
    @Mock
    private ResponseEntity<ClienteRepresentation> clienteResponse;
    @Mock
    private ClienteRepresentation clienteRepresentation;

    private ItemPedido itemPedido;
    private Pedido pedido;
    private  List<Pedido> pedidos;

    @Mock
    private ItemPedidoMapper itemPedidoMapper;
    @BeforeEach
    void setup() {
        clienteRepresentation = new ClienteRepresentation("Renato", "1644123312", "4613123", "id", UsuarioRole.CLIENTE);
        clienteResponse = ResponseEntity.ok(clienteRepresentation);

        PizzaDTO pizzaDTO = new PizzaDTO(
                "idpizza", "Frango com Catupiry", BigDecimal.valueOf(49.9), TamanhoPizza.GIGANTE,
                List.of(new IngredienteDTO(UUID.randomUUID().toString(), "Mussarela", 250, "GRAMAS")));

        itemPedidoDTO = new ItemPedidoDTO(TipoProduto.PIZZA, pizzaDTO, 1);
        pedidoDTO = new PedidoDTO("4613123", List.of(itemPedidoDTO));

        Pizza pizzaPedido = new Pizza();
        pizzaPedido.setId("idpizza");
        pizzaPedido.setNome("Frango com Catupiry");
        pizzaPedido.setTamanho(TamanhoPizza.GIGANTE);
        pizzaPedido.setPreco(BigDecimal.valueOf(49.9));

        itemPedido = new ItemPedido(TipoProduto.PIZZA, pizzaPedido, 1);

        pedido = new Pedido();
        pedido.setId("id");
        pedido.setClienteRepresentation(clienteRepresentation);
        pedido.setStatusPedido(StatusPedido.PENDENTE);
        pedido.setTotal(BigDecimal.valueOf(49.9));
        pedido.setItens(List.of(itemPedido));
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
            pedidoDTO = new PedidoDTO("47416316312",List.of(itemPedidoDTO));
            when(clienteClient.obterDadosDoCliente("47416316312")).thenReturn(clienteResponse);
            when(pedidoRepository.save(any(Pedido.class))).thenReturn(pedido);
            Pedido resultado = pedidoService.adicionarPedido(pedidoDTO);

            assertEquals(pedido,resultado);
            verify(clienteClient).obterDadosDoCliente("47416316312");
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

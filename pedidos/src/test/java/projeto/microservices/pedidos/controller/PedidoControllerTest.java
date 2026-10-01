package projeto.microservices.pedidos.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import projeto.microservices.pedidos.client.representation.ClienteRepresentation;
import projeto.microservices.pedidos.client.representation.PizzaRepresentation;
import projeto.microservices.pedidos.configs.SecurityConfig;
import projeto.microservices.pedidos.controller.dto.PedidoDTO;
import projeto.microservices.pedidos.model.Pedido;
import projeto.microservices.pedidos.model.enums.StatusPedido;
import projeto.microservices.pedidos.service.PedidoService;
import tools.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.List;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PedidoController.class)
@Import(SecurityConfig.class)
public class PedidoControllerTest {
    private PedidoDTO pedidoDTO;
    private Pedido pedido;
    @Mock
    private ClienteRepresentation clienteRepresentation;
    @Mock
    private PizzaRepresentation pizzaRepresentation;
    @MockitoBean
    private PedidoService pedidoService;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockitoBean
    private JwtDecoder jwtDecoder;

    @BeforeEach
    void setup()
    {
        pedidoDTO = new PedidoDTO("41613161212", List.of("id1"));
        pizzaRepresentation = new PizzaRepresentation("Frango com Catupiry", BigDecimal.valueOf(49.9),"id");
        clienteRepresentation = new ClienteRepresentation("Client", "1613123132", "idCliente");
        pedido = new Pedido("idPedido", clienteRepresentation, List.of(pizzaRepresentation), BigDecimal.valueOf(49.9),StatusPedido.PENDENTE);
    }

    @Nested
    public class AdicionarPedido
    {
        @Test
        @DisplayName("Deve adicionar o pedido do cliente se tiver o token do Cliente")
        public void deveAdicionarOPedidoDoCliente() throws Exception
        {
            when(pedidoService.adicionarPedido(pedidoDTO)).thenReturn(pedido);

            mockMvc.perform(post("/pedidos")
                            .with(jwt().jwt(j -> j.claim("cpf", pedidoDTO.clienteCPF())))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(pedidoDTO)))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Deve dar erro de autorização se não tiver o token")
        public void deveGerarErroDeAutorizacaoSemOToken() throws Exception
        {
            mockMvc.perform(post("/pedidos")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(pedidoDTO)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.mensagem").value("É necessário estar logado para realizar esta ação"))
            ;
        }

    }

    @Nested
    public class ListarPedidos
    {
        @Test
        @DisplayName("Deve listar os pedidos se o cliente estiver autenticado")
        public void deveListarOsPedidosSeOClienteEstiverAutenticado() throws Exception
        {
            when(pedidoService.listarPedidos()).thenReturn(List.of(pedido));

            mockMvc.perform(get("/pedidos")
                            .with(jwt().jwt(j -> j.claim("cpf", pedidoDTO.clienteCPF())))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(pedidoDTO)))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Deve listar os pedidos se o cliente estiver autenticado")
        public void deveNaoListarOsPedidosSeOClienteNaoEstiverAutenticado() throws Exception
        {
            when(pedidoService.listarPedidos()).thenReturn(List.of(pedido));

            mockMvc.perform(get("/pedidos")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(pedidoDTO)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.mensagem").value("É necessário estar logado para realizar esta ação"))
            ;
        }


        @Test
        @DisplayName("Deve listar os pedido de um cliente se estiver autenticado")
        public void deveListarPedidoDeUmClienteAutenticado() throws Exception
        {
            when(pedidoService.listarPedidosPorIdCliente("idCliente")).thenReturn(List.of(pedido));

            mockMvc.perform(get("/pedidos/clientes/{id}", clienteRepresentation.id())
                            .with(jwt().jwt(j -> j.claim("cpf", pedidoDTO.clienteCPF())))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(pedidoDTO)))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Deve listar os pedido de um cliente se estiver autenticado")
        public void deveNaoListarOPedidoDeUmClienteNaoAutenticado() throws Exception
        {
            when(pedidoService.listarPedidosPorIdCliente("idCliente")).thenReturn(List.of(pedido));

            mockMvc.perform(get("/pedidos/clientes/{id}", clienteRepresentation.id())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(pedidoDTO)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.mensagem").value("É necessário estar logado para realizar esta ação"))
            ;
        }

    }


}

package projeto.microservices.pagamentos.controller;

import org.apache.kafka.common.config.SecurityConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import projeto.microservices.pagamentos.controller.dto.PagamentoDTO;
import projeto.microservices.pagamentos.controller.mappers.PagamentoMapper;
import projeto.microservices.pagamentos.model.Pagamento;
import projeto.microservices.pagamentos.model.enums.StatusPedido;
import projeto.microservices.pagamentos.service.PagamentoService;
import tools.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
@WebMvcTest(Pagamentos.class)
@Import(SecurityConfig.class)
public class PagamentosTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    private PagamentoDTO pagamentoDTO;
    @MockitoBean
    private PagamentoService pagamentoService;
    private List<Pagamento> pagamentos;
    private Pagamento pagamento1;
    private Pagamento pagamento2;
    @MockitoBean
    private PagamentoMapper pagamentoMapper;
    @BeforeEach
    void setup()
    {
        pagamentos = new ArrayList<>();
        pagamentoDTO = new PagamentoDTO("idPedido", BigDecimal.valueOf(49.50));
        pagamento1 = new Pagamento();
        pagamento1.setStatusPedido(StatusPedido.PENDENTE);
        pagamento1.setTotal(BigDecimal.valueOf(29.9));
        pagamento1.setIdPedido("idPedido");
        pagamento1.setCpf("4615126121");
        pagamento1.setId("id");

        pagamento2 = new Pagamento();
        pagamento2.setStatusPedido(StatusPedido.PENDENTE);
        pagamento2.setTotal(BigDecimal.valueOf(49.5));
        pagamento2.setIdPedido("idPedidoCliente2");
        pagamento2.setCpf("4161312312");
        pagamento2.setId("id2");

        pagamentos.add(pagamento1);
        pagamentos.add(pagamento2);
    }

    @Nested
    public class ListarPedidosPagamentos {
        @Test
        @DisplayName("Deve listar os pagamentos se o cliente estiver autenticado")
        public void deveListarOsPagamentosSeOClienteEstiverAutenticado() throws Exception {
            when(pagamentoService.listarPagamentos("4615126121")).thenReturn(pagamentos);

            mockMvc.perform(get("/pagamentos/{cpf}", pagamento1.getCpf())
                            .with(jwt().jwt(j -> j.subject(pagamento1.getCpf())))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(pagamentoDTO)))
                    .andExpect(status().isOk());
        }
    }
}

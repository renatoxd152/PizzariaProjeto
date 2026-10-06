package projeto.microservices.pagamentos.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import projeto.microservices.pagamentos.model.Pagamento;
import projeto.microservices.pagamentos.model.enums.StatusPedido;
import projeto.microservices.pagamentos.repository.PagamentoRepository;
import projeto.microservices.pagamentos.subscriber.representation.PedidoRepresentation;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PagamentoServiceTest {
    @Mock
    private PagamentoRepository pagamentoRepository;
    @InjectMocks
    private PagamentoService pagamentoService;
    private Pagamento p1;
    private Pagamento p2;
    @BeforeEach
    void setup()
    {
        p1 = new Pagamento();
        p1.setId("6aa9beaba430d802b5b88376");
        p1.setIdPedido("idpedido1");
        p1.setTotal(BigDecimal.valueOf(150.0));
        p1.setStatusPedido(StatusPedido.PAGAMENTO_APROVADO);
        p1.setCpf("4113123123");

        p2 = new Pagamento();
        p2.setId("6aa9beaba430d802b5b88412");
        p2.setIdPedido("idpedido2");
        p2.setTotal(BigDecimal.valueOf(150.0));
        p2.setStatusPedido(StatusPedido.ERRO_PAGAMENTO);
        p2.setCpf("41513123123");

    }

    @Nested
    public class Pagamentos
    {
        @Test
        @DisplayName("Deve aprovar o pagamento se os valores forem corretos")
        public void deveAprovarOPagamentoQuandoOValorForCorreto() {

            Pagamento pagamento = new Pagamento();
            pagamento.setIdPedido("6aa9beaba430d802b5b88376");
            pagamento.setTotal(BigDecimal.valueOf(48.00));

            PedidoRepresentation pedido = new PedidoRepresentation(
                    "6aa9beaba430d802b5b88376",
                    StatusPedido.PENDENTE,
                    BigDecimal.valueOf(48.00),
                    "351312231"
            );

            when(pagamentoRepository.findByIdPedido(pagamento.getIdPedido()))
                    .thenReturn(Optional.of(pedido));

            when(pagamentoRepository.save(any(Pagamento.class)))
                    .thenAnswer(invocation -> invocation.getArgument(0));

            Pagamento resultado = pagamentoService.pagar(pagamento);

            assertEquals(pedido.total(),resultado.getTotal());
            assertEquals(StatusPedido.PAGAMENTO_APROVADO, resultado.getStatusPedido());
        }

        @Test
        @DisplayName("Deve dar erro de pagamento se o valor for errado")
        public void deveGerarErroDePagamentoComValorErrado() {

            Pagamento pagamento = new Pagamento();
            pagamento.setIdPedido("6aa9beaba430d802b5b88376");
            pagamento.setTotal(BigDecimal.valueOf(47.00));

            PedidoRepresentation pedido = new PedidoRepresentation(
                    "6aa9beaba430d802b5b88376",
                    StatusPedido.PENDENTE,
                    BigDecimal.valueOf(48.00)
                    ,"351312231"
            );

            when(pagamentoRepository.findByIdPedido(pagamento.getIdPedido()))
                    .thenReturn(Optional.of(pedido));

            when(pagamentoRepository.save(any(Pagamento.class)))
                    .thenAnswer(invocation -> invocation.getArgument(0));

            Pagamento resultado = pagamentoService.pagar(pagamento);

            assertNotEquals(pedido.total(),resultado.getTotal());
            assertEquals(StatusPedido.ERRO_PAGAMENTO, resultado.getStatusPedido());
        }
    }



    @Nested
    public class Listagem
    {
        @Test
        @DisplayName("Deve listar todos os pagamentos")
        public void deverListarOsPagamentos()
        {

            List<Pagamento> pagamentos = List.of(p1,p2);

            when(pagamentoRepository.findByCPFCliente(p1.getCpf())).thenReturn(pagamentos);

            List<Pagamento> resultado = pagamentoService.listarPagamentos(p1.getCpf());

            assertEquals(pagamentos,resultado);
        }


        @Test
        @DisplayName("Deve listar todos os pagamentos")
        public void deveListarSemPagamentos()
        {
            List<Pagamento> pagamentos = List.of();

            when(pagamentoRepository.findByCPFCliente(p1.getCpf())).thenReturn(pagamentos);

            List<Pagamento> resultado = pagamentoService.listarPagamentos(p1.getCpf());

            assertEquals(pagamentos,resultado);
        }
    }
}

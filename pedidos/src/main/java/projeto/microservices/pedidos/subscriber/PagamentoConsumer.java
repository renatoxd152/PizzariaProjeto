package projeto.microservices.pedidos.subscriber;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import projeto.microservices.pedidos.service.PedidoService;
import projeto.microservices.pedidos.subscriber.representation.PagamentoRepresentation;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
@Slf4j
public class PagamentoConsumer {

    private final ObjectMapper objectMapper;
    private final PedidoService pedidoService;

    @KafkaListener(
            topics = "pagamentos-aprovados",
            groupId = "pedidos"
    )
    public void listen(String json) {

        log.info("MENSAGEM RECEBIDA: {}", json);

        try {
            PagamentoRepresentation pagamento =
                    objectMapper.readValue(
                            json,
                            PagamentoRepresentation.class
                    );

            log.info("Pedido recebido: {}", pagamento.idPedido());

            pedidoService.atualizarStatusPagamento(
                    pagamento.idPedido()
            );

            log.info("Pedido atualizado para EM_PREPARO");

        } catch (Exception e) {
            log.error("Erro ao processar mensagem", e);
        }
    }
}

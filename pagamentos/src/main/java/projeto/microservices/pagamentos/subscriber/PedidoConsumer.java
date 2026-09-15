package projeto.microservices.pagamentos.subscriber;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import projeto.microservices.pagamentos.service.PagamentoService;
import projeto.microservices.pagamentos.subscriber.representation.PedidoRepresentation;
import tools.jackson.databind.ObjectMapper;

@Component
@Slf4j
@RequiredArgsConstructor
public class PedidoConsumer {
    private final ObjectMapper objectMapper;
    private final PagamentoService pagamentoService;
    @KafkaListener(topics = "pedidos-realizados", groupId = "pagamentos")
    public void listen(String json)
    {
        try {
            log.info("Pedido criado com sucesso, esperando o pagamento!");
            var pedidoCriado = objectMapper.readValue(json, PedidoRepresentation.class);
            pagamentoService.criarPedido(pedidoCriado);

        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }


}

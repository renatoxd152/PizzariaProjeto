package projeto.microservices.pedidos.publisher;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import projeto.microservices.pedidos.model.Pedido;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
@Slf4j
public class PedidoPublisher {

    @Value("${clients.config.kafka.topics.pedidos}")
    private String topico;

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    public void publicar(Pedido pedido)
    {
        try {
            String pedidoJson = objectMapper.writeValueAsString(pedido);
            kafkaTemplate.send(topico, "dados", pedidoJson);
        } catch (Exception e) {
            log.error("Erro ao processar o Json", e);
            throw new RuntimeException(e);
        }
    }
}

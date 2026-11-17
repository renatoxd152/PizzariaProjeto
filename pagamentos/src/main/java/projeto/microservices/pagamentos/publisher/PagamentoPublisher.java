package projeto.microservices.pagamentos.publisher;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import projeto.microservices.pagamentos.model.Pagamento;
import tools.jackson.databind.ObjectMapper;

@Slf4j
@Component
@RequiredArgsConstructor
public class PagamentoPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${clients.config.kafka.topics.pagamentos-aprovados}")
    private String topico;

    public void publicar(Pagamento pagamento) {

        try {
            String json =
                    objectMapper.writeValueAsString(pagamento);
            log.info("PUBLICANDO NO KAFKA: {}", json);

            kafkaTemplate.send(
                    topico,
                    pagamento.getIdPedido(),
                    json
            );

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
package projeto.microservices.pagamentos.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import projeto.microservices.pagamentos.model.Pagamento;
import projeto.microservices.pagamentos.model.enums.StatusPedido;
import projeto.microservices.pagamentos.repository.PagamentoRepository;
import projeto.microservices.pagamentos.subscriber.representation.PedidoRepresentation;

@Service
@RequiredArgsConstructor
@Slf4j
public class PagamentoService {
    private final PagamentoRepository pagamentoRepository;
    public Pagamento pagar(Pagamento pagamento) {

        PedidoRepresentation pedidoRepresentation =
                pagamentoRepository.findByIdPedido(pagamento.getIdPedido())
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Pedido não encontrado!"
                                ));

        Pagamento pagamentoCriado = new Pagamento();

        pagamentoCriado.setIdPedido(pedidoRepresentation.id());
        pagamentoCriado.setTotal(pagamento.getTotal());

        if (pedidoRepresentation.statusPedido() != StatusPedido.PENDENTE) {

            pagamentoCriado.setStatusPedido(StatusPedido.ERRO_PAGAMENTO);

            return pagamentoRepository.save(pagamentoCriado);
        }

        if (pagamento.getTotal().compareTo(pedidoRepresentation.total()) != 0) {

            pagamentoCriado.setStatusPedido(StatusPedido.ERRO_PAGAMENTO);

            return pagamentoRepository.save(pagamentoCriado);
        }

        pagamentoCriado.setStatusPedido(StatusPedido.PAGAMENTO_APROVADO);

        return pagamentoRepository.save(pagamentoCriado);
    }

    public void criarPedido(PedidoRepresentation pedidoCriado) {
        log.info("O pedido com status pendente de pagamento foi criado!");
        Pagamento pagamento = new Pagamento();
        pagamento.setIdPedido(pedidoCriado.id());
        pagamento.setStatusPedido(pedidoCriado.statusPedido());
        pagamento.setTotal(pedidoCriado.total());
        pagamentoRepository.save(pagamento);
    }
}

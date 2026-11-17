package projeto.microservices.pagamentos.service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import projeto.microservices.pagamentos.model.Pagamento;
import projeto.microservices.pagamentos.model.enums.StatusPedido;
import projeto.microservices.pagamentos.publisher.PagamentoPublisher;
import projeto.microservices.pagamentos.repository.PagamentoRepository;
import projeto.microservices.pagamentos.subscriber.representation.PedidoRepresentation;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PagamentoService {
    private final PagamentoRepository pagamentoRepository;
    private final PagamentoPublisher pagamentoPublisher;
    public Pagamento pagar(Pagamento pagamento) {
        Pagamento pagamentoEncontrado =
                pagamentoRepository.findByIdPedido(pagamento.getIdPedido())
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Pedido não encontrado!"
                                ));

        if (pagamentoEncontrado.getStatusPedido() != StatusPedido.PENDENTE) {

            pagamentoEncontrado.setStatusPedido(StatusPedido.ERRO_PAGAMENTO);

            return pagamentoRepository.save(pagamentoEncontrado);
        }

        if (pagamento.getTotal().compareTo(pagamentoEncontrado.getTotal()) != 0) {

            pagamentoEncontrado.setStatusPedido(StatusPedido.ERRO_PAGAMENTO);

            return pagamentoRepository.save(pagamentoEncontrado);
        }

        pagamentoEncontrado.setFormaPagamento(
                pagamento.getFormaPagamento()
        );

        pagamentoEncontrado.setStatusPedido(
                StatusPedido.PAGAMENTO_APROVADO
        );
        pagamentoPublisher.publicar(pagamentoEncontrado);
        return pagamentoRepository.save(pagamentoEncontrado);
    }

    public void criarPedido(PedidoRepresentation pedidoCriado) {
        log.info("O pedido com status pendente de pagamento foi criado!");
        Pagamento pagamento = new Pagamento();
        pagamento.setIdPedido(pedidoCriado.id());
        pagamento.setStatusPedido(pedidoCriado.statusPedido());
        pagamento.setTotal(pedidoCriado.total());
        pagamento.setCpf(pedidoCriado.clienteRepresentation().cpf());
        pagamentoRepository.save(pagamento);
    }

    public List<Pagamento> listarPagamentos(String cpf) {
        List<Pagamento> pagamentos = pagamentoRepository.findByCPFCliente(cpf);
        return pagamentos;
    }

    public Pagamento listarPagamento(String id) {
        Pagamento pagamento = pagamentoRepository.findByIdPedido(id).orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Pedido não encontrado!"
                                ));
        return pagamento;
    }
}

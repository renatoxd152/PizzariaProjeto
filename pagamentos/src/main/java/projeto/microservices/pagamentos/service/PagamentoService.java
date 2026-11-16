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

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PagamentoService {
    private final PagamentoRepository pagamentoRepository;
    public Pagamento pagar(Pagamento pagamento) {

        Pagamento pagamentoEncontrado =
                pagamentoRepository.findByIdPedido(pagamento.getIdPedido())
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Pedido não encontrado!"
                                ));

        Pagamento pagamentoCriado = new Pagamento();

        pagamentoCriado.setIdPedido(pagamentoEncontrado.getId());
        pagamentoCriado.setTotal(pagamentoEncontrado.getTotal());
        pagamentoCriado.setCpf(pagamentoEncontrado.getCpf());
        if (pagamentoEncontrado.getStatusPedido() != StatusPedido.PENDENTE) {

            pagamentoCriado.setStatusPedido(StatusPedido.ERRO_PAGAMENTO);

            return pagamentoRepository.save(pagamentoCriado);
        }

        if (pagamento.getTotal().compareTo(pagamentoEncontrado.getTotal()) != 0) {
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

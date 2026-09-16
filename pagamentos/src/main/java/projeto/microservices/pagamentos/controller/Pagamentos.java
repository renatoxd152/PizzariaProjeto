package projeto.microservices.pagamentos.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projeto.microservices.pagamentos.controller.dto.PagamentoDTO;
import projeto.microservices.pagamentos.controller.mappers.PagamentoMapper;
import projeto.microservices.pagamentos.model.Pagamento;
import projeto.microservices.pagamentos.service.PagamentoService;

import java.util.List;

@RestController
@RequestMapping("pagamentos")
@RequiredArgsConstructor
@Slf4j
public class Pagamentos {
    private final PagamentoMapper pagamentoMapper;
    private final PagamentoService pagamentoService;

    @PostMapping
    public ResponseEntity<Pagamento> fazerPagamento(@RequestBody PagamentoDTO pagamentoDTO)
    {
        log.info("Pedido foi pago com sucesso!");
        Pagamento pagamento = pagamentoService.pagar(pagamentoMapper.map(pagamentoDTO));
        return ResponseEntity.ok(pagamento);
    }

    @GetMapping
    public ResponseEntity<List<Pagamento>> listarPagamentos()
    {
        log.info("Listando todos os pagamentos!");
        return ResponseEntity.ok(pagamentoService.listarPagamentos());
    }
}

package projeto.microservices.pagamentos.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projeto.microservices.pagamentos.controller.dto.PagamentoDTO;
import projeto.microservices.pagamentos.controller.mappers.PagamentoMapper;
import projeto.microservices.pagamentos.model.Pagamento;
import projeto.microservices.pagamentos.service.PagamentoService;
import projeto.microservices.pagamentos.subscriber.representation.PedidoRepresentation;

import java.util.List;

@RestController
@RequestMapping("pagamentos")
@RequiredArgsConstructor
@Slf4j
public class Pagamentos {
    private final PagamentoMapper pagamentoMapper;
    private final PagamentoService pagamentoService;
    @Operation(summary = "Cadastrar pagamento")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pagamento feito com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<Pagamento> fazerPagamento(@RequestBody PagamentoDTO pagamentoDTO)
    {
        log.info("Pedido foi pago com sucesso!");
        Pagamento pagamento = pagamentoService.pagar(pagamentoMapper.map(pagamentoDTO));
        return ResponseEntity.ok(pagamento);
    }
    @Operation(summary = "Listar todos os pagamentos")
    @ApiResponse(responseCode = "200", description = "Lista de pagamentos")
    @GetMapping("{cpf}")
    public ResponseEntity<List<Pagamento>> listarPagamentos(@PathVariable String cpf)
    {
        log.info("Listando todos os pagamentos!");
        return ResponseEntity.ok(pagamentoService.listarPagamentos(cpf));
    }
}

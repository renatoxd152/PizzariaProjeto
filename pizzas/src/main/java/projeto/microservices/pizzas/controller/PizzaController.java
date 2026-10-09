package projeto.microservices.pizzas.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import projeto.microservices.pizzas.controller.dto.PizzaDTO;
import projeto.microservices.pizzas.controller.mapper.PizzaMapper;
import projeto.microservices.pizzas.model.Pizza;
import projeto.microservices.pizzas.service.PizzaService;

import java.util.List;

@RestController
@RequestMapping("pizzas")
@RequiredArgsConstructor
public class PizzaController {

    private final PizzaService pizzaService;

    private final PizzaMapper pizzaMapper;
    @Operation(summary = "Cadastrar pizza")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pizza criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<Pizza> criarPizza(@RequestBody PizzaDTO pizzaDTO)
    {
        Pizza pizza = pizzaService.criarPizza(pizzaMapper.map(pizzaDTO));
        return ResponseEntity.ok(pizza);
    }

    @Operation(summary = "Listar todas as pizzas")
    @ApiResponse(responseCode = "200", description = "Lista de pizzas")
    @GetMapping
    public ResponseEntity<List<Pizza>> listarPizzas()
    {
        List<Pizza> pizzas = pizzaService.listarPizzas();
        return ResponseEntity.ok(pizzas);
    }
    @Operation(summary = "Buscar pizza por ID")
    @GetMapping("{id}")
    public ResponseEntity<Pizza> listarPizza(@PathVariable("id") String id)
    {
        Pizza pizza = pizzaService.listarPizza(id);
        return ResponseEntity.ok(pizza);
    }
    @Operation(summary = "Filtrar pizzas por lista de IDs")
    @GetMapping("/filtrar/{ids}")
    public ResponseEntity<List<Pizza>> filtrarPizzas(@PathVariable("ids") List<String> ids)
    {
        return ResponseEntity.ok(pizzaService.buscarPorIds(ids));
    }
    @Operation(summary = "Excluir pizza por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Pizza excluída"),
            @ApiResponse(responseCode = "404", description = "Pizza não encontrada")
    })
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deletarPizza(@PathVariable("id") String id)
    {
        pizzaService.deletarPizza(id);
        return ResponseEntity.noContent().build();
    }
    @Operation(summary = "Atualizar pizza por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pizza atualizada"),
            @ApiResponse(responseCode = "404", description = "Pizza não encontrada")
    })
    @PutMapping("{id}")
    public ResponseEntity<Pizza> atualizarPizza(@PathVariable("id") String id, @RequestBody PizzaDTO pizzaDTO)
    {
        return ResponseEntity.ok(pizzaService.atualizarPizza(id, pizzaMapper.map(pizzaDTO)));
    }
}

package projeto.microservices.pizzas.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    @PostMapping
    public ResponseEntity<Pizza> criarPizza(@RequestBody PizzaDTO pizzaDTO)
    {
        Pizza pizza = pizzaService.criarPizza(pizzaMapper.map(pizzaDTO));
        return ResponseEntity.ok(pizza);
    }

    @GetMapping
    public ResponseEntity<List<Pizza>> listarPizzas()
    {
        List<Pizza> pizzas = pizzaService.listarPizzas();
        return ResponseEntity.ok(pizzas);
    }
    @GetMapping("{id}")
    public ResponseEntity<Pizza> listarPizza(@PathVariable("id") String id)
    {
        Pizza pizza = pizzaService.listarPizza(id);
        return ResponseEntity.ok(pizza);
    }

    @GetMapping("/filtrar/{ids}")
    public ResponseEntity<List<Pizza>> filtrarPizzas(@PathVariable("ids") List<String> ids)
    {
        return ResponseEntity.ok(pizzaService.buscarPorIds(ids));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deletarPizza(@PathVariable("id") String id)
    {
        pizzaService.deletarPizza(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("{id}")
    public ResponseEntity<Pizza> atualizarPizza(@PathVariable("id") String id, @RequestBody PizzaDTO pizzaDTO)
    {
        return ResponseEntity.ok(pizzaService.atualizarPizza(id, pizzaMapper.map(pizzaDTO)));
    }
}

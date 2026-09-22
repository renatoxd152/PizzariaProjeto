package projeto.microservices.pizzas.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import projeto.microservices.pizzas.controller.dto.PizzaDTO;
import projeto.microservices.pizzas.model.IngredientePizza;
import projeto.microservices.pizzas.model.Pizza;
import projeto.microservices.pizzas.repository.PizzaRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PizzaService {
    private final PizzaRepository pizzaRepository;
    public Pizza criarPizza(Pizza pizza) {
        return pizzaRepository.save(pizza);
    }

    public List<Pizza> listarPizzas() {
        return pizzaRepository.findAll();
    }

    public void deletarPizza(String id) {
        Pizza pizza = pizzaRepository.findById(id).
                orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Esse id não foi encontrado!"));

        pizzaRepository.deleteById(pizza.getId());
    }

    public Pizza atualizarPizza(String id, Pizza pizza) {
        Pizza pizzaEncontrada = pizzaRepository.findById(id).
                orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Esse id não foi encontrado!"));

        pizzaEncontrada.setPreco(pizza.getPreco());
        pizzaEncontrada.setTamanho(pizza.getTamanho());
        pizzaEncontrada.setItens(pizza.getItens());
        return pizzaRepository.save(pizzaEncontrada);
    }

    public Pizza listarPizza(String id) {
        return pizzaRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Esse id não foi encontrado!"));
    }

    public List<Pizza> buscarPorIds(List<String> ids) {
        return pizzaRepository.findAllById(ids);
    }

    public Pizza deletarItemPizza(String idPizza,String idIngrediente) {
        Pizza pizzaEncontrada = pizzaRepository.findById(idPizza).
                orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Esse id não foi encontrado!"));

        IngredientePizza ingredientePizza = pizzaEncontrada.getItens()
                .stream()
                .filter(ingrediente -> ingrediente.getId().equals(idIngrediente))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Esse id de ingrediente não foi encontrado!"));

        pizzaEncontrada.getItens().remove(ingredientePizza);

        return pizzaRepository.save(pizzaEncontrada);
    }

    public Pizza atualizarItemPizza(String idPizza, String idIngrediente, IngredientePizza ingredientePizza) {

        Pizza pizzaEncontrada = pizzaRepository.findById(idPizza).
                orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Esse id não foi encontrado!"));

        IngredientePizza ingredientePizzaEncontrado = pizzaEncontrada.getItens()
                .stream()
                .filter(ingrediente -> ingrediente.getId().equals(idIngrediente))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Esse id de ingrediente não foi encontrado!"));

        ingredientePizzaEncontrado.setUnidadeMedida(ingredientePizza.getUnidadeMedida());
        ingredientePizzaEncontrado.setQuantidade(ingredientePizza.getQuantidade());
        ingredientePizzaEncontrado.setNomeIngrediente(ingredientePizza.getNomeIngrediente());

        return pizzaRepository.save(pizzaEncontrada);
    }
}

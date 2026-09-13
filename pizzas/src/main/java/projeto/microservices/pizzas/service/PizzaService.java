package projeto.microservices.pizzas.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import projeto.microservices.pizzas.controller.dto.PizzaDTO;
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
}

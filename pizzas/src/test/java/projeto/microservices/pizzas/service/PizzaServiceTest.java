package projeto.microservices.pizzas.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import projeto.microservices.pizzas.model.IngredientePizza;
import projeto.microservices.pizzas.model.Pizza;
import projeto.microservices.pizzas.model.enums.TamanhoPizza;
import projeto.microservices.pizzas.model.enums.UnidadeMedida;
import projeto.microservices.pizzas.repository.PizzaRepository;

import javax.swing.text.html.Option;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PizzaServiceTest {
    @Mock
    private PizzaRepository pizzaRepository;

    @InjectMocks
    private PizzaService pizzaService;
    private Pizza pizza;
    private Pizza pizzaAtualizada;
    @BeforeEach
    void setup()
    {
        pizza = new Pizza();
        IngredientePizza ingredientePizza1 = new IngredientePizza();
        IngredientePizza ingredientePizza2 = new IngredientePizza();
        IngredientePizza ingredientePizza3 = new IngredientePizza();
        IngredientePizza ingredientePizza4 = new IngredientePizza();

        pizza.setId("idpizza");
        pizza.setNome("Frango com Catupiry");
        pizza.setTamanho(TamanhoPizza.GIGANTE);
        pizza.setPreco(BigDecimal.valueOf(49.9));

        ingredientePizza1.setNomeIngrediente("Mussarela");
        ingredientePizza1.setQuantidade(BigDecimal.valueOf(250));
        ingredientePizza1.setUnidadeMedida(UnidadeMedida.GRAMA);

        ingredientePizza2.setNomeIngrediente("Frango");
        ingredientePizza2.setQuantidade(BigDecimal.valueOf(1000));
        ingredientePizza2.setUnidadeMedida(UnidadeMedida.GRAMA);
        pizza.setItens(List.of(ingredientePizza1,ingredientePizza2));

        pizzaAtualizada = new Pizza();
        pizzaAtualizada.setId("idpizza");
        pizzaAtualizada.setNome("Frango com Catupiry");
        pizzaAtualizada.setTamanho(TamanhoPizza.GIGANTE);
        pizzaAtualizada.setPreco(BigDecimal.valueOf(60.0));

        ingredientePizza3.setNomeIngrediente("Mussarela");
        ingredientePizza3.setQuantidade(BigDecimal.valueOf(250));
        ingredientePizza3.setUnidadeMedida(UnidadeMedida.GRAMA);

        ingredientePizza4.setNomeIngrediente("Frango");
        ingredientePizza4.setQuantidade(BigDecimal.valueOf(1000));
        ingredientePizza4.setUnidadeMedida(UnidadeMedida.GRAMA);
        pizzaAtualizada.setItens(List.of(ingredientePizza3,ingredientePizza4));
    }

    @Nested
    public class AdicionarPizza
    {
        @Test
        @DisplayName("Deve adicionar uma pizza")
        public void deveAdicionarUmaPizza()
        {
            when(pizzaRepository.save(pizza)).thenReturn(pizza);
            Pizza resultado = pizzaService.criarPizza(pizza);

            assertEquals(pizza,resultado);
        }
    }

    @Nested
    public class ListarPizzas
    {
        @Test
        @DisplayName("Deve listar todas as pizzas")
        public void deveListarPizzas()
        {
            when(pizzaRepository.findAll()).thenReturn(List.of(pizza));
            List<Pizza> resultado = pizzaService.listarPizzas();
            assertEquals(List.of(pizza),resultado);
        }
        @Test
        @DisplayName("Deve listar uma pizza")
        public void deveListarUmaPizza()
        {
            when(pizzaRepository.findById("idpizza")).thenReturn(Optional.of(pizza));
            Pizza resultado = pizzaService.listarPizza("idpizza");

            assertEquals(pizza,resultado);
        }

        @Test
        @DisplayName("Deve gerar uma mensagem de erro quando não encontrar uma pizza")
        public void deveGerarMensagemSeNaoEncontrar()
        {
            ResponseStatusException exception = assertThrows(
                    ResponseStatusException.class,
                    () -> pizzaService.listarPizza("id")
            );
            assertEquals(HttpStatus.NOT_FOUND,exception.getStatusCode());
            assertEquals("Esse id não foi encontrado!", exception.getReason());
        }

        @Test
        @DisplayName("Deve listar as pizzas pelos ids")
        public void deveListarPizzaPorIds()
        {
            List<String> pizzasIds = List.of("idpizza");
            List<Pizza> pizzasEncontradas =List.of(pizza);
            when(pizzaRepository.findAllById(pizzasIds)).thenReturn(pizzasEncontradas);

            assertEquals(pizzasEncontradas, pizzaService.buscarPorIds(pizzasIds));
        }
    }

    @Nested
    public class AtualizarPizza
    {
        @Test
        @DisplayName("Deve atualizar uma pizza")
        public void deveAtualizarPizza()
        {
            when(pizzaRepository.save(pizza)).thenReturn(pizza);
            when(pizzaRepository.findById("idpizza")).thenReturn(Optional.of(pizza));

            Pizza resultado = pizzaService.atualizarPizza("idpizza",pizzaAtualizada);
            assertEquals(pizza,resultado);
            assertEquals(pizza.getPreco(),resultado.getPreco());
        }

        @Test
        @DisplayName("Deve gerar uma mensagem se a pizza não for encontrada")
        public void deveGerarUmaMensagemSeAPizzaNaoForEncontrada()
        {
            ResponseStatusException exception = assertThrows(
                    ResponseStatusException.class,
                    () -> pizzaService.atualizarPizza("47613163121",pizzaAtualizada)
            );
            assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
            assertEquals("Esse id não foi encontrado!", exception.getReason());
        }
    }

    @Nested
    public class DeletarPizza
    {
        @Test
        @DisplayName("Deve deletar uma pizza")
        public void deveDeletarUmaPizza()
        {
            when(pizzaRepository.findById("idpizza")).thenReturn(Optional.of(pizza));

            verify(pizzaRepository).deleteById("idpizza");
        }

    }





}

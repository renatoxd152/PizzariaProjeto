package projeto.microservices.pizzas.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import projeto.microservices.pizzas.controller.mapper.BebidaMapper;
import projeto.microservices.pizzas.model.Bebida;
import projeto.microservices.pizzas.service.BebidaService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
@WebMvcTest(BebidaController.class)
public class BebidaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BebidaService bebidaService;

    @MockitoBean
    private BebidaMapper bebidaMapper;

    private List<Bebida> bebidas;

    @BeforeEach
    void setup() {
        Bebida bebida = new Bebida();
        bebida.setId("id");
        bebida.setImagem("imagem");
        bebida.setNome("Coca-Cola");
        bebida.setPreco(BigDecimal.valueOf(6.0));

        bebidas = new ArrayList<>();
        bebidas.add(bebida);
    }

    @Nested
    class ListarBebidas {

        @Test
        @DisplayName("Deve listar todas as bebidas")
        void deveListarBebidas() throws Exception {
            when(bebidaService.listarBebidas()).thenReturn(bebidas);

            mockMvc.perform(get("/bebidas").accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(1))
                    .andExpect(jsonPath("$[0].id").value("id"))
                    .andExpect(jsonPath("$[0].nome").value("Coca-Cola"));

            verify(bebidaService).listarBebidas();
        }
    }
}

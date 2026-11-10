package projeto.microservices.pizzas.service.utils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

public class ImagemUtils {

    public static String salvarImagem(MultipartFile imagem, String tipo) throws IOException {

        String nomeArquivo = UUID.randomUUID() + "_" + imagem.getOriginalFilename();

        Path caminho = Paths.get("uploads", tipo, nomeArquivo);

        Files.createDirectories(caminho.getParent());

        Files.copy(
                imagem.getInputStream(),
                caminho,
                StandardCopyOption.REPLACE_EXISTING
        );

        return "/uploads/" + tipo + "/" + nomeArquivo;
    }
}

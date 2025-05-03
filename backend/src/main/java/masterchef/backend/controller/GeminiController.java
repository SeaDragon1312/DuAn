package masterchef.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import masterchef.backend.dto.StarterRecipeDTO;
import masterchef.backend.service.GeminiTextService;
import masterchef.backend.service.GenerativeRecipeService;
import masterchef.backend.service.ImagenService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/gemini")
public class GeminiController {

    @Autowired
    ImagenService imagenService;

    @Autowired
    GeminiTextService geminiTextService;

    @Autowired
    GenerativeRecipeService generativeRecipeService;

    @GetMapping("/image")
    public String getImage(@RequestParam String prompt) {
        return imagenService.getImage(prompt);
    }

    @GetMapping("/hello")
    public String test() {
        return new String("hellooo");
    }

    @GetMapping("/aitext")
    public String getText(@RequestParam String prompt) {
        return geminiTextService.generateText(prompt);
    }

    @GetMapping("/generative-recipe")
    public ResponseEntity<?> generativeRecipe(@RequestBody StarterRecipeDTO recipeDTO) {
        String recipeId = generativeRecipeService.generateRecipe(recipeDTO);
        if (recipeId == null)
            return ResponseEntity.badRequest().body("Error generating recipe. Please try again.");
        
        return new ResponseEntity<>(recipeId, HttpStatus.OK);
    }

}

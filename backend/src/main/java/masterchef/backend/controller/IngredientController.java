package masterchef.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import masterchef.backend.dto.IngredientDTO;
import masterchef.backend.model.Ingredient;
import masterchef.backend.model.Recipe;
import masterchef.backend.repository.IngredientRepository;
import masterchef.backend.repository.RecipeRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/ingredient/")
public class IngredientController {
    @Autowired
    IngredientRepository ingredientRepository;

    @Autowired
    RecipeRepository recipeRepository;

    @PostMapping("get")
    public ResponseEntity<?> getIngredient(@RequestBody Integer id) {
        Ingredient ingredient = ingredientRepository.findById(id).get();

        return new ResponseEntity<>(ingredient, HttpStatus.OK);
    }

    @GetMapping("recipe/get")
    public ResponseEntity<?> getAllIngredientByRecipe(@RequestParam Integer recipeId) {
        Optional<Recipe> recipe = recipeRepository.findById(recipeId);
        if (recipe.isEmpty())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        List<Ingredient> ingredientList = ingredientRepository.findAllByRecipe(recipe.get());

        return new ResponseEntity<>(ingredientList, HttpStatus.OK);
    }

    @PostMapping("add")
    public ResponseEntity<?> addIngredient(@RequestBody IngredientDTO ingredientDTO) {
        Optional<Recipe> recipe = recipeRepository.findById(ingredientDTO.getRecipeId());

        Ingredient ingredient = new Ingredient(ingredientDTO, recipe.get());

        ingredientRepository.save(ingredient);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("delete")
    public ResponseEntity<?> deleteIngredient(@RequestBody Integer id) {
        ingredientRepository.deleteById(id);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}

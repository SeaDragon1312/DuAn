package masterchef.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import masterchef.backend.model.Recipe;
import masterchef.repository.RecipeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/recipe/")
public class RecipeController {
    @Autowired
    RecipeRepository recipeRepository;

    @PostMapping("get")
    public ResponseEntity<?> getRecipe(@RequestBody Integer id) {
        Recipe recipe = recipeRepository.findById(id).get();
        
        return new ResponseEntity<>(recipe, HttpStatus.OK);
    }
    
}

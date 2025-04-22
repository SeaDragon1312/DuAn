package masterchef.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import masterchef.backend.model.Recipe;
import masterchef.backend.model.User;
import masterchef.backend.repository.RecipeRepository;
import masterchef.backend.repository.UserRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/recipe/")
public class RecipeController {
    @Autowired
    RecipeRepository recipeRepository;

    @Autowired
    UserRepository userRepository;

    @PostMapping("get")
    public ResponseEntity<?> getRecipe(@RequestBody Integer id) {
        Recipe recipe = recipeRepository.findById(id).get();

        return new ResponseEntity<>(recipe, HttpStatus.OK);
    }
    
    @GetMapping("user/get")
    public ResponseEntity<?> getAllRecipeByUser(@RequestParam String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        List<Recipe> recipeList = recipeRepository.findAllByUser(user);

        return new ResponseEntity<>(recipeList, HttpStatus.OK);
    }

    @PostMapping("delete")
    public ResponseEntity<?> deleteRecipe(@RequestBody Integer id) {
        recipeRepository.deleteById(id);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("add")
    public ResponseEntity<?> addRecipe(@RequestBody Recipe recipe) {
        recipeRepository.save(recipe);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}

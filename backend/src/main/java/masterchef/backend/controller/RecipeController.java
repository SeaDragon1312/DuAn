package masterchef.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import masterchef.backend.dto.FullRecipeDTO;
import masterchef.backend.model.Recipe;
import masterchef.backend.model.User;
import masterchef.backend.model.WebsiteImage;
import masterchef.backend.repository.RecipeRepository;
import masterchef.backend.repository.UserRepository;
import masterchef.backend.repository.WebsiteImageRepository;

import java.sql.Blob;
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

    @Autowired
    WebsiteImageRepository websiteImageRepository;

    @PostMapping("get")
    public ResponseEntity<?> getRecipe(@RequestBody Integer id) {
        Recipe recipe = recipeRepository.findById(id).get();

        return new ResponseEntity<>(recipe, HttpStatus.OK);
    }

    @GetMapping("user/get")
    public ResponseEntity<?> getAllRecipeByUser(@RequestParam String username) {
        User user = userRepository.findByUsername(username);
        if (user == null)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        List<Recipe> recipeList = recipeRepository.findAllByUser(user);

        return new ResponseEntity<>(recipeList, HttpStatus.OK);
    }

    @PostMapping("delete")
    public ResponseEntity<?> deleteRecipe(@RequestBody Integer id) {
        recipeRepository.deleteById(id);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("manual/add")
    public ResponseEntity<?> addRecipe(@RequestBody FullRecipeDTO fullRecipeDTO, @RequestParam Blob image) {
        User user = userRepository.findByUsername(fullRecipeDTO.getUsername());
        if (user == null)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        WebsiteImage websiteImage = new WebsiteImage(image);
        websiteImageRepository.save(websiteImage);

        Recipe recipe = new Recipe(fullRecipeDTO.getDishName(), fullRecipeDTO.getIntroduction(),
                fullRecipeDTO.getHealthImpact(), fullRecipeDTO.getHealthScore(),
                fullRecipeDTO.getAllergyWarning(), websiteImage, user);
        recipeRepository.save(recipe);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}

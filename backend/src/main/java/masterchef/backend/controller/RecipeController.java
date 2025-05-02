package masterchef.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import masterchef.backend.dto.DisplayRecipeDTO;
import masterchef.backend.dto.FullRecipeDTO;
import masterchef.backend.model.Ingredient;
import masterchef.backend.model.Recipe;
import masterchef.backend.model.Step;
import masterchef.backend.model.WebUser;
import masterchef.backend.model.WebsiteImage;
import masterchef.backend.repository.IngredientRepository;
import masterchef.backend.repository.RecipeRepository;
import masterchef.backend.repository.StepRepository;
import masterchef.backend.repository.UserRepository;
import masterchef.backend.repository.WebsiteImageRepository;

import java.sql.Blob;
import java.util.ArrayList;
import java.util.List;
// import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/recipe/")
public class RecipeController {
    @Autowired
    RecipeRepository recipeRepository;

    @Autowired
    StepRepository stepRepository;

    @Autowired
    IngredientRepository ingredientRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    WebsiteImageRepository websiteImageRepository;

    @PostMapping("get")
    public ResponseEntity<?> getRecipe(@RequestBody Integer id) {
        Recipe recipe = recipeRepository.findById(id).get();

        return new ResponseEntity<>(recipe, HttpStatus.OK);
    }

    @GetMapping("get-by-param-id")
    public ResponseEntity<?> getRecipeByParamId(@RequestParam Integer id) {
        Recipe recipe = recipeRepository.findById(id).get();

        return new ResponseEntity<>(recipe, HttpStatus.OK);
    }

    @GetMapping("get/all")
    public ResponseEntity<?> getAllRecipe() {
        List<Recipe> recipeList = recipeRepository.findAll();

        return new ResponseEntity<>(recipeList, HttpStatus.OK);
    }

    @GetMapping("get/homepage-all")
    public ResponseEntity<?> getAllRecipeForHomepage() {
        List<Recipe> recipeList = recipeRepository.findAll();
        List<DisplayRecipeDTO> displayRecipeDTOs = new ArrayList<>();
        for (Recipe recipe : recipeList) {
            DisplayRecipeDTO recipeDTO = new DisplayRecipeDTO(recipe);
            displayRecipeDTOs.add(recipeDTO);
        }

        return new ResponseEntity<>(displayRecipeDTOs, HttpStatus.OK);
    }

    // @GetMapping("search")
    // public ResponseEntity<?> searchRecipe(@RequestParam String text) {
    // List<Recipe> recipeList =
    // recipeRepository.findAllByDishNameContainingIgnoreCase(text);

    // return new ResponseEntity<>(recipeList, HttpStatus.OK);
    // }

    @GetMapping("user/get")
    public ResponseEntity<?> getAllRecipeByUser(@RequestParam String userId) {
        WebUser user = userRepository.findByUserId(userId);
        // if (user == null)
        //     return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        List<Recipe> recipeList = recipeRepository.findAllByUser(user);
        return new ResponseEntity<>(recipeList, HttpStatus.OK);
    }

    @PostMapping("delete/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Integer id) {
        Recipe recipe = recipeRepository.findById(id).get();
        if (recipe == null)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        
        List<Step> stepList = stepRepository.findAllByRecipe(recipe);
        List<Ingredient> ingredientList = ingredientRepository.findAllByRecipe(recipe);
        
        for (Step step : stepList) {
            stepRepository.delete(step);
        }
        for (Ingredient ingredient : ingredientList) {
            ingredientRepository.delete(ingredient);
        }
        websiteImageRepository.delete(recipe.getImage());

        recipeRepository.deleteById(id);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("manual/add")
    public ResponseEntity<?> addRecipe(@RequestBody FullRecipeDTO fullRecipeDTO, @RequestParam Blob image) {
        WebUser user = userRepository.findByUserId(fullRecipeDTO.getUserId());
        // if (user == null)
        //     return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        WebsiteImage websiteImage = new WebsiteImage(image);

        Recipe recipe = new Recipe(fullRecipeDTO.getDishName(), fullRecipeDTO.getIntroduction(),
                fullRecipeDTO.getHealthImpact(), fullRecipeDTO.getHealthScore(),
                fullRecipeDTO.getAllergyWarning(), fullRecipeDTO.getDietType(), websiteImage, user);
        recipeRepository.save(recipe);

        websiteImage.setRecipeId(recipe.getId());
        websiteImageRepository.save(websiteImage);

        String[] stepList = fullRecipeDTO.getStepList();
        for (int i = 0; i < stepList.length; i++) {
            Step step = new Step(stepList[i], i, recipe);
            stepRepository.save(step);
        }

        String[] ingredientList = fullRecipeDTO.getIngredientList();
        for (String ingredientString: ingredientList) {
            Ingredient ingredient = new Ingredient(ingredientString, recipe);
            ingredientRepository.save(ingredient);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }
}

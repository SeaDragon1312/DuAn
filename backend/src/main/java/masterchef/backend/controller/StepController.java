package masterchef.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import masterchef.backend.dto.StepListDTO;
import masterchef.backend.model.Recipe;
import masterchef.backend.model.Step;
import masterchef.backend.repository.RecipeRepository;
import masterchef.backend.repository.StepRepository;

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
@RequestMapping("/api/step/")
public class StepController {
    @Autowired
    StepRepository stepRepository;

    @Autowired
    RecipeRepository recipeRepository;

    @PostMapping("get")
    public ResponseEntity<?> getStep(@RequestBody Integer id) {
        Step step = stepRepository.findById(id).get();

        return new ResponseEntity<>(step, HttpStatus.OK);
    }

    @GetMapping("recipe/get")
    public ResponseEntity<?> getAllStepByRecipe(@RequestParam Integer recipeId) {
        Optional<Recipe> recipe = recipeRepository.findById(recipeId);
        if (recipe.isEmpty())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        List<Step> stepList = stepRepository.findAllByRecipe(recipe.get());

        return new ResponseEntity<>(stepList, HttpStatus.OK);
    }

    @PostMapping("list/add")
    public ResponseEntity<?> addStep(@RequestBody StepListDTO stepListDTO) {
        Optional<Recipe> recipe = recipeRepository.findById(stepListDTO.getRecipeId());

        String[] stepList = stepListDTO.getStepList();
        for (int i = 0; i < stepList.length; i++) {
            Step step = new Step(stepList[i], i, recipe.get());
            stepRepository.save(step);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    // @PostMapping("delete")
    // public ResponseEntity<?> deleteStep(@RequestBody Integer id) {
    //     stepRepository.deleteById(id);

    //     return new ResponseEntity<>(HttpStatus.OK);
    // }

}

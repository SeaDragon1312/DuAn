package masterchef.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import masterchef.backend.model.Ingredient;
import masterchef.backend.repository.IngredientRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/ingredient/")
public class IngredientController {
    @Autowired
    IngredientRepository ingredientRepository;

    @PostMapping("get")
    public ResponseEntity<?> getIngredient(@RequestBody Integer id) {
        Ingredient ingredient = ingredientRepository.findById(id).get();
        
        return new ResponseEntity<>(ingredient, HttpStatus.OK);
    }
    
}

package masterchef.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor

public class IngredientDTO {
    private String name;
    
    private Integer recipeId;
    
}

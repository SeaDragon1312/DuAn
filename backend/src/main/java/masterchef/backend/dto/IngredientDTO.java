package masterchef.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor

public class IngredientDTO {
    private String name;
    
    private Integer recipeId;
    
}

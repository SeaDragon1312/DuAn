package masterchef.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor

public class StepDTO {
    private String description;

    private Integer recipeId;
    
}

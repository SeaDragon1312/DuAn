package masterchef.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor

public class FullRecipeDTO {
    private String dishName;
    private String introduction;
    private String healthImpact;
    private Integer healthScore;
    private String allergyWarning;
    private String dietType;
    private String[] stepList;
    private String[] ingredientList;

    private String userId;
}

package masterchef.backend.util;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor

public class ResponseRecipeFormat {
    private String introduction;
    private String[] steps;
    private String[] ingredients;
    private String healthImpact;
    private int healthScore;
    private String allergyWarning;
    private String dietType;
    private String preparationTime;
}
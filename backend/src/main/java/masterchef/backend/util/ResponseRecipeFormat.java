package masterchef.backend.util;

import lombok.Getter;

@Getter

public class ResponseRecipeFormat {
    private String introduction;
    private String[] steps;
    private String[] ingredients;
    private String healthImpact;
    private int healthScore;
    private String allergyWarning;
}
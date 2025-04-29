package masterchef.backend.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import masterchef.backend.ConstantList;
import masterchef.backend.dto.StarterRecipeDTO;
import masterchef.backend.model.Ingredient;
import masterchef.backend.model.Recipe;
import masterchef.backend.model.Step;
import masterchef.backend.model.User;
import masterchef.backend.repository.IngredientRepository;
import masterchef.backend.repository.RecipeRepository;
import masterchef.backend.repository.StepRepository;
import masterchef.backend.repository.UserRepository;
import masterchef.backend.repository.WebsiteImageRepository;
import masterchef.backend.util.ClassParser;
import masterchef.backend.util.ResponseRecipeFormat;

@Service
public class GenerativeRecipeService {
    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private GeminiTextService geminiTextService;

    @Autowired
    private ImagenService imagenService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StepRepository stepRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private WebsiteImageRepository websiteImageRepository;

    public String generateRecipe(StarterRecipeDTO recipeDTO) {
        User user = userRepository.findByUsername(recipeDTO.getUsername());
        if (user == null)
            return null;

        String imageIdResponse = imagenService.getImage(recipeDTO.getDishName());
        if (!imageIdResponse.contains(ConstantList.successfulHeader)) {
            return null;
        }

        int imageId = Integer.parseInt(imageIdResponse.replace(ConstantList.successfulHeader, ""));

        String godPrompt = "You will receive the procedure for how to cook \"" + recipeDTO.getDishName() +
                "\". Your task is to generate introduction for this dish, create a list of step for this dish," +
                " a list of ingredients needed to cook it, its health impact, "
                + "the allergy warning for this dish, "
                + "determine the diet type of this dish in only one of these three types: Vegan, Vegetarian or Non-Vegetarian "
                + "and give this recipe an integer health score between 0 and 10, " +
                "with 10 implying that the recipe is extremely healthy and 0 implying that it is extremely unhealthy." +
                "The output must be only a JSON object in this exact format: " +
                ClassParser.parseClassToJson(ResponseRecipeFormat.class);
        String godResponse = geminiTextService.generateText(godPrompt);

        try {
            JSONObject jsonObject = new JSONObject(sanitizeResponse(godResponse));
            String introduction = jsonObject.getString("introduction");
            String[] steps = jsonObject.getJSONArray("steps").toList().toArray(new String[0]);
            String[] ingredients = jsonObject.getJSONArray("ingredients").toList().toArray(new String[0]);
            String healthImpact = jsonObject.getString("healthImpact");
            int healthScore = jsonObject.getInt("healthScore");
            String allergyWarning = jsonObject.getString("allergyWarning");
            String dietType = jsonObject.getString("dietType");

            Recipe recipe = new Recipe(recipeDTO.getDishName(), introduction, healthImpact, healthScore, allergyWarning,
                    dietType, websiteImageRepository.findById(imageId).get(), user);

            recipeRepository.save(recipe);

            for (String step : steps) {
                stepRepository.save(new Step(step, recipe));
            }
            for (String ingredient : ingredients) {
                ingredientRepository.save(new Ingredient(ingredient, recipe));
            }

            return sanitizeResponse(godResponse);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private String sanitizeResponse(String jsonResponse) {
        int startIndex = jsonResponse.indexOf("{");
        int endIndex = jsonResponse.lastIndexOf("}");
        if (startIndex != -1 && endIndex != -1)
            return jsonResponse.substring(startIndex, endIndex + 1);
        else
            return null;
    }

}

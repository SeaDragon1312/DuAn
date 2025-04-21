package masterchef.repository;

import org.springframework.stereotype.Repository;

import masterchef.backend.model.Ingredient;

@Repository
public interface IngredientRepository {
    Ingredient findById(Integer id);
}

package masterchef.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import masterchef.backend.model.Recipe;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Integer> {
}

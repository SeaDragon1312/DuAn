package masterchef.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import masterchef.backend.model.Recipe;
import masterchef.backend.model.Step;

@Repository
public interface StepRepository extends JpaRepository<Step, Integer> {
    List<Step> findAllByRecipe(Recipe recipe);
}

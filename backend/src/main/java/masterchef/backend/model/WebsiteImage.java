package masterchef.backend.model;

import java.sql.Blob;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "images")

public class WebsiteImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonIgnore
    @Column(columnDefinition = "bytea") // Chỉ định kiểu dữ liệu PostgreSQL
    private byte[] imageData; // Sử dụng byte[] thay vì Blob

    private Integer recipeId;

    public WebsiteImage(byte[] imageData) {
        this.imageData = imageData;
    }

    public WebsiteImage(byte[] imageData, Integer recipeId) {
        this.imageData = imageData;
        this.recipeId = recipeId;
    }

    public void setRecipeId(Integer recipeId) {
        this.recipeId = recipeId;
    }

}

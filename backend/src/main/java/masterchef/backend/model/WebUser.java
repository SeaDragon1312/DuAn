package masterchef.backend.model;

import java.util.List;

import com.clerk.backend_api.models.components.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "users")

public class WebUser {
    @Id
    private String userId;

    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    @Transient
    private String fullName;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Recipe> recipes;

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public WebUser(User user) {
        this.userId = user.id().get();
        this.username = user.username().get();
        this.email = user.emailAddresses().get().get(0).emailAddress();
        this.firstName = user.firstName().get();
        this.lastName = user.lastName().get();
        this.fullName = user.firstName().get() + " " + user.lastName().get();
    }

}

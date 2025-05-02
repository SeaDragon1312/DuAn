package masterchef.backend.model;

import com.clerk.backend_api.models.components.User;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public WebUser(User user) {
        this.userId = user.id().get();
        this.username = user.username().get();
        this.email = user.emailAddresses().get().get(0).emailAddress();
        this.firstName = user.firstName().get();
        this.lastName = user.lastName().get();
    }

}

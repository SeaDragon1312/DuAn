package masterchef.backend.clerk_connector;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.clerk.backend_api.Clerk;
import com.clerk.backend_api.models.components.User;
import com.clerk.backend_api.models.operations.GetUserListRequest;
import com.clerk.backend_api.models.operations.GetUserListResponse;

import jakarta.annotation.PostConstruct;
import masterchef.backend.model.WebUser;
import masterchef.backend.repository.UserRepository;

@Component
public class PostConstructClerkUser {
    @Value("${CLERK_SECRET_KEY}")
    private String clerkSecretKey;

    @Autowired
    UserRepository userRepository;

    @PostConstruct
    public void init() {
        try {
            Clerk sdk = Clerk.builder()
                    .bearerAuth(clerkSecretKey)
                    .build();

            GetUserListRequest req = GetUserListRequest.builder().build();
            GetUserListResponse res = sdk.users().list().request(req).call();

            List<User> users = res.userList().get();
            for (User user : users) {
                WebUser webUser = userRepository.findByUserId(user.id().get());
                if (webUser == null) {
                    userRepository.save(new WebUser(user));
                } else {
                    webUser.setUsername(user.username().get());
                    webUser.setEmail(user.emailAddresses().get().get(0).emailAddress());
                    webUser.setFirstName(user.firstName().get());
                    webUser.setLastName(user.lastName().get());
                    userRepository.save(webUser);
                }
            }

        } catch (Exception e) {
            System.err.println("Failed to fetch users from Clerk: " + e.getMessage());
        }
    }

}
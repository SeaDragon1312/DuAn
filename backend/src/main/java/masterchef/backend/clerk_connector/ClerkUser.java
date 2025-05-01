package masterchef.backend.clerk_connector;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ClerkUser {
    @Value("${CLERK_SECRET_KEY}")
    private String clerkSecretKey;

}
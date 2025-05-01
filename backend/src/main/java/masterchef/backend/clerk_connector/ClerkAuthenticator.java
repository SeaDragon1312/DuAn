package masterchef.backend.clerk_connector;

import com.clerk.backend_api.Clerk;
import com.clerk.backend_api.models.components.User;
import com.clerk.backend_api.models.errors.ClerkErrors;
import com.clerk.backend_api.models.operations.GetUserListRequest;
import com.clerk.backend_api.models.operations.GetUserListResponse;

import java.io.IOException;
import java.io.InputStream;
import java.lang.Exception;
import java.util.List;
import java.util.Properties;

public class ClerkAuthenticator {
    private static String loadClerkKey() throws IOException {
        Properties props = new Properties();
        InputStream inputStream = ClerkUser.class.getClassLoader().getResourceAsStream("application.properties");
        props.load(inputStream);
        String clerkKey = props.getProperty("CLERK_SECRET_KEY");

        return clerkKey;
    }

    public static void main(String[] args) throws ClerkErrors, Exception {

        Clerk sdk = Clerk.builder()
                .bearerAuth(loadClerkKey())
                .build();

        GetUserListRequest req = GetUserListRequest.builder()
                .build();

        GetUserListResponse res = sdk.users().list()
                .request(req)
                .call();

        if (res.userList().isPresent()) {
            List<User> users = res.userList().get();
            for (User user : users) {
                System.out.println(user.emailAddresses().get().get(0).emailAddress() + " " + user.firstName() + " "
                        + user.lastName());
            }

        }
    }
}
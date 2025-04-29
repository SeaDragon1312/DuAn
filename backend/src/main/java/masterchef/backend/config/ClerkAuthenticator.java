package masterchef.backend.config;

import com.clerk.backend_api.Clerk;
import com.clerk.backend_api.models.errors.ClerkErrors;
import com.clerk.backend_api.models.operations.VerifyPasswordRequestBody;
import com.clerk.backend_api.models.operations.VerifyPasswordResponse;
import java.lang.Exception;

public class ClerkAuthenticator {
    public static void main(String[] args) throws ClerkErrors, Exception {

        Clerk sdk = Clerk.builder()
                .bearerAuth("<YOUR_BEARER_TOKEN_HERE>")
            .build();

        VerifyPasswordResponse res = sdk.users().verifyPassword()
                .userId("<id>")
                .requestBody(VerifyPasswordRequestBody.builder()
                    .password("1fwgbLjqCRGKsWc")
                    .build())
                .call();

        if (res.object().isPresent()) {
            // handle response
        }
    }
}

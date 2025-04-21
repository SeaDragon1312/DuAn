package masterchef.backend.service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import masterchef.backend.ConstantList;

@Service
public class ImagenService {
    private String API_KEY = ConstantList.GEMINI_KEY;
    private final String ENDPOINT = ConstantList.IMAGEN_ENDPOINT + API_KEY;

    @Autowired
    WebsiteImageService websiteImageService;

    public String getImage(String prompt) {
        try {
            // Prepare JSON payload
            JSONObject json = new JSONObject();
            json.put("generationConfig", new JSONObject().put("responseModalities", new String[] { "Text", "Image" }));
            json.put("contents", new org.json.JSONArray().put(new JSONObject()
                    .put("parts", new org.json.JSONArray().put(new JSONObject().put("text",
                            prompt)))));

            // Send HTTP request
            HttpURLConnection connection = (HttpURLConnection) new URL(ENDPOINT).openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            try (OutputStream os = connection.getOutputStream()) {
                os.write(json.toString().getBytes());
                os.flush();
            }

            // Read response
            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                InputStream is = connection.getInputStream();
                String response = new String(is.readAllBytes());

                // Extract base64 image data
                String base64Data = extractBase64Image(response);
                if (base64Data != null) {
                    saveBase64Image(base64Data, "gemini-native-image.png");
                    return "Image saved as gemini-native-image.png";
                } else {
                    return "Failed to extract image data.";
                }
            } else {
                System.out.println("Request failed with response code: " + responseCode);
            }

            connection.disconnect();
            return "response code: " + responseCode;

        } catch (Exception e) {
            return e.getStackTrace().toString();
        }
    }

    private String extractBase64Image(String response) {
        int startIndex = response.indexOf("\"data\": \"") + 9;
        int endIndex = response.indexOf("\"", startIndex);
        if (startIndex != -1 && endIndex != -1) {
            return response.substring(startIndex, endIndex);
        }
        return null;
    }

    private void saveBase64Image(String base64Image, String fileName) {
        try (FileOutputStream fos = new FileOutputStream(fileName)) {
            byte[] decodedBytes = Base64.getDecoder().decode(base64Image);
            fos.write(decodedBytes);

            // save image to database
            websiteImageService.saveImage(decodedBytes);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

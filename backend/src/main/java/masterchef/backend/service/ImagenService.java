package masterchef.backend.service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;

import org.json.JSONArray;
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

                // System.out.println(response);

                String base64Data = extractBase64Image(response);
                if (base64Data != null) {
                    int imageId = saveBase64Image(base64Data, "frontend/src/components/Recipe/garlic-bread.png");
                    return ConstantList.successfulHeader + imageId;
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

    private String extractBase64Image(String jsonResponse) {
        try {
            JSONObject jsonObject = new JSONObject(jsonResponse);
            JSONArray candidates = jsonObject.getJSONArray("candidates");
            if (candidates.length() > 0) {
                JSONObject firstCandidate = candidates.getJSONObject(0);
                JSONObject content = firstCandidate.getJSONObject("content");
                JSONArray parts = content.getJSONArray("parts");

                boolean foundImage = false;

                for (int i = 0; i < parts.length(); i++) {
                    JSONObject part = parts.getJSONObject(i);
                    if (part.has("inlineData")) {
                        JSONObject inlineData = part.getJSONObject("inlineData");
                        if (inlineData.has("data")) {
                            foundImage = true;
                            return inlineData.getString("data");
                        }
                    }
                }

                if (!foundImage)
                    return null;
            } else
                return null;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private int saveBase64Image(String base64Image, String fileName) {
        try (FileOutputStream fos = new FileOutputStream(fileName)) {
            byte[] decodedBytes = Base64.getDecoder().decode(base64Image);
            fos.write(decodedBytes);

            // save image to database
            int imageId = websiteImageService.saveImage(decodedBytes);
            return imageId;

        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }
}

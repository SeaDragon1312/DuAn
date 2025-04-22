package masterchef.backend.service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.*;
import org.springframework.stereotype.Service;

import masterchef.backend.ConstantList;

@Service
public class GeminiTextService {
    private final String API_KEY = ConstantList.GEMINI_KEY;
    private final String ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY;

    public String generateText(String prompt) {
        try {
            // Prepare JSON payload
            JSONObject json = new JSONObject();
            json.put("contents", new JSONArray().put(new JSONObject()
                    .put("parts", new JSONArray().put(new JSONObject().put("text", prompt)))));

            // Send HTTP request
            HttpURLConnection connection = (HttpURLConnection) new URL(ENDPOINT).openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            // Write JSON payload
            try (OutputStream os = connection.getOutputStream()) {
                os.write(json.toString().getBytes());
                os.flush();
            }

            // Read response
            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                InputStream is = connection.getInputStream();
                String response = new String(is.readAllBytes());
                return extractTextFromResponse(response);
            } else {
                System.out.println("Request failed with response code: " + responseCode);
            }

            connection.disconnect();
            return "Request failed with response code: " + responseCode;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private String extractTextFromResponse(String jsonResponse) {
        try {
            JSONObject jsonObject = new JSONObject(jsonResponse);
            JSONArray candidates = jsonObject.getJSONArray("candidates");
            if (candidates.length() > 0) {
                JSONObject firstCandidate = candidates.getJSONObject(0);
                JSONArray parts = firstCandidate.getJSONObject("content").getJSONArray("parts");
                if (parts.length() > 0) {
                    return parts.getJSONObject(0).getString("text");
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return null;
    }
    
}

package masterchef.backend.util;

import com.google.gson.Gson;
import java.lang.reflect.*;
import java.util.*;

public class ClassParser {

    public static Object parseType(Type type) {
        if (type instanceof Class<?>) {
            Class<?> clazz = (Class<?>) type;

            // Handle primitive, wrapper, String
            if (clazz.isPrimitive() || clazz == String.class || Number.class.isAssignableFrom(clazz) || clazz == Boolean.class) {
                return clazz.getSimpleName();
            }

            // Handle arrays
            if (clazz.isArray()) {
                return List.of(parseType(clazz.getComponentType()));
            }

            // Handle custom classes
            Map<String, Object> fieldsMap = new LinkedHashMap<>();
            for (Field field : clazz.getDeclaredFields()) {
                field.setAccessible(true);
                fieldsMap.put(field.getName(), parseType(field.getGenericType()));
            }
            return fieldsMap;

        } else if (type instanceof ParameterizedType) {
            ParameterizedType pType = (ParameterizedType) type;
            Type rawType = pType.getRawType();
            Type[] typeArgs = pType.getActualTypeArguments();

            if (rawType == List.class || rawType == ArrayList.class) {
                return List.of(parseType(typeArgs[0]));
            }

            return parseType(rawType);
        }

        return "Unknown";
    }

    public static String parseClassToJson(Class<?> clazz) {
        Object structure = parseType(clazz);
        return new Gson().toJson(structure);
    }


    // public static void main(String[] args) {
    //     System.out.println(parseClassToJson(ResponseRecipeFormat.class));
    // }
}

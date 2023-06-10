package com.example.mall.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class JwtUtil {
    private static final String SECRET_KEY = "$@#NDI!@ND!*@F*F*(hd9@H92hdqd"; // 设置密钥，请使用足够强度的密钥来保护JWT的安全性

    public static String generateToken(Map<String, Object> payload) {
        Date now = new Date();

        return Jwts.builder()
                .setClaims(payload)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + 86400000)) // 设置过期时间（这里为 24 小时）
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public static boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static Map<String, Object> parseToken(String token) {
        Claims claims = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
        return claims;
    }

    public static String generateLoginToken(String userId, String username, String identity, String avatar) {
        Map<String, Object> map = new HashMap<>();
        map.put("userId", userId);
        map.put("username", username);
        map.put("identity", identity);
        map.put("avatar", avatar);
        return generateToken(map);
    }

    public static String generateSellerLoginToken(String userId, String username, String identity) {
        Map<String, Object> map = new HashMap<>();
        map.put("userId", userId);
        map.put("username", username);
        map.put("identity", identity);
        return generateToken(map);
    }

    public static void main(String[] args) {
        Map<String, Object> map = new HashMap<>();
        map.put("userId", "123");
        map.put("username", "tywang");
        String token = "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2ODQ1NjU2NzAsInVzZXJJZCI6IjEyMyIsImlhdCI6MTY4NDQ3OTI3MCwidXNlcm5hbWUiOiJ0eXdhbmcifQ._iAkJNHATyKUsodmlbQPU0qr3otuK_pJEAKBl2K5x2w";
        if(JwtUtil.validateToken(token)){
            System.out.println(token);
            System.out.println(JwtUtil.parseToken(token));
        }
    }
}

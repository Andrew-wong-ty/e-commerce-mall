package com.example.mall.controller;

import com.example.mall.POJO.DTO.LoginDTO;
import com.example.mall.POJO.DTO.ResponseObject;
import com.example.mall.utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/security")
public class IdentityController {
    public static class JwtToken {
        private String token;
    }
    @RequestMapping(value = "/jwtValidate", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject validateJwt(@RequestBody String jwtToken) {
        if(null==jwtToken) {
            return ResponseObject.error();
        }
        jwtToken = jwtToken.replace("\"", "");
        if(JwtUtil.validateToken(jwtToken)) {
            Map<String, Object> usernameAndId = JwtUtil.parseToken(jwtToken);
            return ResponseObject.success(usernameAndId);
        } else {
            return ResponseObject.error();
        }
    }
}

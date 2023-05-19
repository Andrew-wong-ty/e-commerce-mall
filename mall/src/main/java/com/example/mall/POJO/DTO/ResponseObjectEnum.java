package com.example.mall.POJO.DTO;

public enum ResponseObjectEnum {
    SUCCESS(200L, "成功"),
    ERROR(500L, "失败"),
    LOGIN_ERROR(501L,"登录错误: 用户名或密码错误");

    private final Long code;
    private final String message;
    ResponseObjectEnum(Long code, String message){
        this.code = code;
        this.message = message;
    }

    public Long getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}

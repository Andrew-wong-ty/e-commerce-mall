package com.example.mall.POJO.DTO;



public class ResponseObject {
    // 相应返回的代码
    private Long code;
    // 响应返回的信息
    private String message;
    // 响应返回的实体
    private Object object;

    public static ResponseObject success(Object object){
        return new ResponseObject(ResponseObjectEnum.SUCCESS.getCode(),ResponseObjectEnum.SUCCESS.getMessage(),object);
    }
    public static ResponseObject error(){
        return new ResponseObject(ResponseObjectEnum.ERROR.getCode(),ResponseObjectEnum.ERROR.getMessage(),null);
    }
    public static ResponseObject success(){
        return new ResponseObject(ResponseObjectEnum.SUCCESS.getCode(),ResponseObjectEnum.SUCCESS.getMessage(),null);
    }

    public ResponseObject(Long code, String message, Object object) {
        this.code = code;
        this.message = message;
        this.object = object;
    }

    public Long getCode() {
        return code;
    }

    public void setCode(Long code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getObject() {
        return object;
    }

    public void setObject(Object object) {
        this.object = object;
    }
}

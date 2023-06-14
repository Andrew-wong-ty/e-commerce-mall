package com.example.mall.kafka;

import com.alibaba.fastjson2.JSON;
import com.example.mall.POJO.Orders;
import org.apache.kafka.common.header.Headers;
import org.apache.kafka.common.serialization.Deserializer;

import java.util.Map;

public class OrderJsonDeserializer implements Deserializer<Orders> {
    @Override
    public void configure(Map<String, ?> configs, boolean isKey) {
    }

    @Override
    public Orders deserialize(String s, byte[] bytes) {
        return JSON.parseObject(bytes, Orders.class);
    }

    @Override
    public void close() {
    }
}

package com.example.mall.kafka;

import com.alibaba.fastjson2.JSON;
import com.example.mall.POJO.Orders;
import org.apache.kafka.common.header.Headers;
import org.apache.kafka.common.serialization.Serializer;

import java.util.Map;

public class OrderJsonSerializer implements Serializer<Orders> {
    @Override
    public void configure(Map<String, ?> configs, boolean isKey) {
    }

    @Override
    public byte[] serialize(String s, Orders orders) {
        return JSON.toJSONBytes(orders);
    }



    @Override
    public void close() {
    }
}

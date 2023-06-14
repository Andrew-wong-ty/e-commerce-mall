package com.example.mall.kafka;

import com.example.mall.POJO.Orders;
import com.example.mall.config.KafkaConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class QueueProducer {
    @Autowired
    @Qualifier("kafkaProducerBean")
    private KafkaProducer<String, Orders> kafkaProducer;

    public void send(String key, Orders order) {
        kafkaProducer.send(new ProducerRecord<String, Orders>(KafkaConfig.TOPIC,key,order));
    }


}
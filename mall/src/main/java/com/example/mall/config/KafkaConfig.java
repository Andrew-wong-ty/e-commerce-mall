package com.example.mall.config;


import com.example.mall.POJO.Orders;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.example.mall.kafka.OrderJsonDeserializer;
import com.example.mall.kafka.OrderJsonSerializer;

import java.util.Arrays;
import java.util.Collections;
import java.util.Properties;

@Configuration
public class KafkaConfig {
    final public static String TOPIC = "topic3";
    final public static String IP_PORT = "124.223.47.124:9092";
    @Bean
    public KafkaProducer<String, Orders> kafkaProducerBean() {
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, IP_PORT);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, OrderJsonSerializer.class.getName());
        return new KafkaProducer<>(props);
    }


    private static KafkaConsumer<String, Orders> generateConsumer() {
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, IP_PORT);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "test");
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true"); // offsets are committed automatically with a frequency controlled by the config auto.commit.interval.ms
        props.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, "1000");
        props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, "30000");
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG , "earliest");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, OrderJsonDeserializer.class.getName());
        KafkaConsumer<String, Orders> consumer = new KafkaConsumer<>(props);
        consumer.subscribe(Collections.singletonList(TOPIC));
        return consumer;
    }
    final public static KafkaConsumer<String, Orders> kafkaQueueConsumer = generateConsumer();
    public static KafkaConsumer<String, Orders> getConsumer() {
        return kafkaQueueConsumer;
    }
}

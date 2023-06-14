package com.example.mall;


import com.example.mall.POJO.Goods;
import com.example.mall.POJO.Orders;
import com.example.mall.POJO.User;
import com.example.mall.constant.OrderStatus;
import com.example.mall.kafka.QueueProducer;
import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.TimeUnit;

@RunWith(SpringRunner.class)
@SpringBootTest
public class kafkaTest {
//    @Autowired
//    @Qualifier("kafkaProducerBean")
//    private KafkaProducer<String, Orders> kafkaProducer;



    @Resource
    QueueProducer queueProducer;

    @Test
    public void send() {
//        try{
//            for (int i=0;i<=30;i++){
//                kafkaProducer.send(new ProducerRecord<String, String>("topic3", "xxx"+i, "111"+i));
//            }
//        }catch (Exception e) {
//            e.printStackTrace();
//        }
    }

    @Test
    public void consumeAuto() {
//        try{
//            while (true) {
//                /*自动commit: 在poll返回之后, 这些record就会认为被commit了. 这些record的逻辑即使没有被成功执行, 也被定义为commit了*/
//                ConsumerRecords<String, String> records = kafkaConsumer.poll(Duration.ofMillis(100));
//                if (null==records || records.isEmpty()) continue;
//                for (ConsumerRecord<String, String> record : records)
//                    System.out.printf("offset = %d, key = %s, value = %s%n", record.offset(), record.key(), record.value());
//            }
//        }catch (Exception e) {
//            e.printStackTrace();
//        }
    }

    @Test
    public void orderConsumerThreadTest() throws InterruptedException {

    }

    @Test
    public void consumerThreadTest() throws InterruptedException {
//        QueueConsumer consumer = new QueueConsumer();
//        Thread consumerThread = new Thread(consumer);
//        consumerThread.start();

        for (int i = 0; i < 10; i++) {
            User user = new User(Integer.toUnsignedLong(i),"asdas","123","312","31124", "f113f", "sad");
            Orders order = new Orders(UUID.randomUUID().toString(),user,new Goods(),new BigDecimal("10"),1L,new Date(), OrderStatus.SIGNED);
            queueProducer.send(Integer.toString(i), order);
            TimeUnit.SECONDS.sleep(1);
        }
//        consumerThread.join();
    }

    @Test
    public void consumeAutoCommit() {
        Properties props = new Properties();
        props.put("bootstrap.servers", "124.223.47.124:9092");
        props.put("group.id", "test");
        props.put("enable.auto.commit", "true"); // offsets are committed automatically with a frequency controlled by the config auto.commit.interval.ms
        props.put("auto.commit.interval.ms", "1000");
        props.put("session.timeout.ms", "30000");
        props.put("auto.offset.reset", "earliest");
        props.put("key.deserializer", StringDeserializer.class.getName());
        props.put("value.deserializer", StringDeserializer.class.getName());
        KafkaConsumer<String, String> consumer = new KafkaConsumer<String, String>(props);
        consumer.subscribe(Collections.singletonList("topic3"));
        System.out.println("start now--------------");
        while (true) {
            /*自动commit: 在poll返回之后, 这些record就会认为被commit了. 这些record的逻辑即使没有被成功执行, 也被定义为commit了*/
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
            for (ConsumerRecord<String, String> record : records)
                System.out.printf("offset = %d, key = %s, value = %s%n", record.offset(), record.key(), record.value());
        }
    }

    @Test
    public void consumeManualCommit() {
        Properties props = new Properties();
        props.put("bootstrap.servers", "124.223.47.124:9092");
        props.put("group.id", "test");
        props.setProperty("enable.auto.commit", "false"); // offsets are committed automatically with a frequency controlled by the config auto.commit.interval.ms
        props.put("key.deserializer", StringDeserializer.class.getName());
        props.put("value.deserializer", StringDeserializer.class.getName());
        KafkaConsumer<String, String> consumer = new KafkaConsumer<String, String>(props);
        consumer.subscribe(Collections.singletonList("topic3"));
        final boolean running = true;
        try {
            while(running) {
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(Long.MAX_VALUE));
                for (TopicPartition partition : records.partitions()) {
                    List<ConsumerRecord<String, String>> partitionRecords = records.records(partition);
                    for (ConsumerRecord<String, String> record : partitionRecords) {
                        System.out.printf("offset = %d, key = %s, value = %s%n", record.offset(), record.key(), record.value());
                    }
                    long lastOffset = partitionRecords.get(partitionRecords.size() - 1).offset();
                    consumer.commitSync(Collections.singletonMap(partition, new OffsetAndMetadata(lastOffset + 1)));
                }
            }
        } finally {
            consumer.close();
        }
    }

}

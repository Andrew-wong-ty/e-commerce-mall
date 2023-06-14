package com.example.mall.kafka;

import com.example.mall.POJO.Goods;
import com.example.mall.POJO.Orders;
import com.example.mall.config.KafkaConfig;
import com.example.mall.constant.OrderStatus;
import com.example.mall.repository.GoodsRepository;
import com.example.mall.repository.OrdersRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Collections;
import java.util.Date;
import java.util.Properties;

@Component
@Slf4j
public class ConsumerThread implements Runnable{
    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private GoodsRepository goodsRepository;

    @Override
    public void run() {
        assert ordersRepository!=null;
        KafkaConsumer<String, Orders> kafkaConsumer = KafkaConfig.getConsumer();
        try {
            for(;;) {
                ConsumerRecords<String, Orders> records = kafkaConsumer.poll(Duration.ofMillis(100));
                if (null==records || records.isEmpty()) continue;
                for (ConsumerRecord<String, Orders> record : records) {
                    /*
                     * 由于consumer线程为单线程, 因此不需要考虑ordering线程之间的资源共享问题
                     * */
                    Orders order = record.value();
                    // 对订单进行处理
                    System.out.printf("CONSUMER:  offset = %d, key = %s, value = %s%n", record.offset(), record.key(), order.toString());
                    Goods targetGoods = goodsRepository.findOneById(order.getGoods().getId());
                    if(targetGoods.getGoodsNum()>=order.getNum() && order.getNum()>=0) {
                        // 库存足够
                        targetGoods.setGoodsNum(targetGoods.getGoodsNum()- order.getNum());
                        Goods savedGoods = goodsRepository.save(targetGoods);
                        if(savedGoods.getId()!=null) {
                            // 保存成功
                            order.setOrderStatus(OrderStatus.CREATED);
                        } else {
                            // 保存失败
                            order.setOrderStatus(OrderStatus.CREATE_FAILED);
                        }
                    } else {
                        // 库存不足
                        order.setOrderStatus(OrderStatus.CREATE_FAILED);
                    }
                    ordersRepository.save(order);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

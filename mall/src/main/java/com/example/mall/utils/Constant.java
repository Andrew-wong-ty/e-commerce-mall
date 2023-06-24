package com.example.mall.utils;

import com.example.mall.constant.GoodsCategory;
import com.example.mall.constant.GoodsStatus;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Constant {
    public final static String JWT_COOKIE_KEY = "JWT-TOKEN";
    public final static Map<String, GoodsStatus> STATUS_STRING_2_OBJECT = Stream.of(
            new Object[][] {
                    {"ON_SALE", GoodsStatus.ON_SALE},
                    {"SOLD_OUT", GoodsStatus.SOLD_OUT},
                    {"DOWN", GoodsStatus.DOWN},
                    {"DELETED", GoodsStatus.DELETED}
            }
        ).collect(Collectors.toMap(data -> (String) data[0], data -> (GoodsStatus) data[1]));

    public final static Map<String, GoodsCategory> STRING_2_CATEGORY = Stream.of(
            new Object[][] {
                    {"BAGS", GoodsCategory.BAGS},
                    {"CAMERAS", GoodsCategory.CAMERAS},
                    {"CLOTHES", GoodsCategory.CLOTHES},
                    {"KIDS", GoodsCategory.KIDS},
                    {"GLASSES", GoodsCategory.GLASSES},
                    {"MOBILE", GoodsCategory.MOBILE},
                    {"MAKEUP", GoodsCategory.MAKEUP},
                    {"SHOES", GoodsCategory.SHOES},
                    {"LAPTOPS", GoodsCategory.LAPTOPS},
                    {"FOOD", GoodsCategory.FOOD}

            }
    ).collect(Collectors.toMap(data -> (String) data[0], data -> (GoodsCategory) data[1]));

    public static void main(String[] args) {
        GoodsStatus g = STATUS_STRING_2_OBJECT.get("DOWN");
    }
}

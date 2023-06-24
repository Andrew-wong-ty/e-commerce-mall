package com.example.mall.controller;

import com.example.mall.POJO.DTO.LoginDTO;
import com.example.mall.POJO.DTO.ResponseObject;
import com.example.mall.POJO.Goods;
import com.example.mall.constant.GoodsCategory;
import com.example.mall.constant.GoodsStatus;
import com.example.mall.service.GoodsService;
import com.example.mall.service.SellerService;
import com.example.mall.utils.Constant;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.tomcat.util.bcel.Const;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/goods")
public class GoodsController {
    @Resource
    private GoodsService goodsService;

    @Resource
    private SellerService sellerService;

    @RequestMapping(value = "/deleteGoodsById", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject deleteGoodsById(@RequestBody Map<String, String> paramMap) {
        try {
            goodsService.deleteById(paramMap.get("goodsId"));
            return ResponseObject.success();
        } catch (Exception e) {
            log.error("getProductById ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
    }
    /*

        try {
            return ResponseObject.success();
        } catch (Exception e) {
            log.error("ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }


     */

    @RequestMapping(value = "/getGoodsById", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject getGoodsById(@RequestBody Map<String, String> paramMap) {
        try {
            Goods goods = goodsService.getOneById(Long.parseLong(paramMap.get("goodsId")));
            return ResponseObject.success(goods);
        } catch (Exception e) {
            log.error("getProductById ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
    }


    @RequestMapping(value = "/getProductById", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject getProductBySellerId(@RequestBody Map<String, String> paramMap) {
        Map<String, Object> result = new HashMap<>();
        try {
            String sellerId = paramMap.get("sellerId");
            int pageSize = Integer.parseInt(paramMap.get("pageSize"));
            int nthPage = Integer.parseInt(paramMap.get("nthPage"))-1;
            assert nthPage>=0;
            assert pageSize>=0;
            Page<Goods> goods = goodsService.getPageGoodsBySellerId(sellerId, pageSize, nthPage);
            result.put("totalElements", goods.getTotalElements());
            result.put("totalPages", goods.getTotalPages());
            result.put("goods", goods.getContent());
            return ResponseObject.success(result);
        } catch (Exception e) {
            log.error("getProductById ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
    }

    @RequestMapping(value = "/getAllGoods", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject getAllGoods(@RequestBody Map<String, String> paramMap) {
        Map<String, Object> result = new HashMap<>();
        try {
            int pageSize = Integer.parseInt(paramMap.get("pageSize"));
            int nthPage = Integer.parseInt(paramMap.get("nthPage"))-1;
            assert nthPage>=0;
            assert pageSize>=0;
            Page<Goods> goods = goodsService.getGoodsByStatus(GoodsStatus.ON_SALE, nthPage, pageSize, true);
            result.put("totalElements", goods.getTotalElements());
            result.put("totalPages", goods.getTotalPages());
            result.put("goods", goods.getContent());
            return ResponseObject.success(result);
        } catch (Exception e) {
            log.error("getProductById ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
    }

    @RequestMapping(value = "/getAllGoodsByCategory", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject getAllGoodsByCategory(@RequestBody Map<String, String> paramMap) {
        Map<String, Object> result = new HashMap<>();
        try {
            int pageSize = Integer.parseInt(paramMap.get("pageSize"));
            int nthPage = Integer.parseInt(paramMap.get("nthPage"))-1;
            GoodsCategory category = Constant.STRING_2_CATEGORY.get(paramMap.get("goodsCategory"));
            assert nthPage>=0;
            assert pageSize>=0;
            Page<Goods> goods = goodsService.getOnSaleGoodsByCategory(category, nthPage, pageSize, true);
            result.put("totalElements", goods.getTotalElements());
            result.put("totalPages", goods.getTotalPages());
            result.put("goods", goods.getContent());
            return ResponseObject.success(result);
        } catch (Exception e) {
            log.error("getAllGoodsByCategory ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
    }

    @RequestMapping(value = "/fuzzySearch", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject fuzzySearch(@RequestBody Map<String, String> paramMap) {
        Map<String, Object> result = new HashMap<>();
        try {
            int pageSize = Integer.parseInt(paramMap.get("pageSize"));
            int nthPage = Integer.parseInt(paramMap.get("nthPage"))-1;
            String goodsName = paramMap.get("goodsName");
            assert nthPage>=0;
            assert pageSize>=0;
            Page<Goods> goods = goodsService.fuzzySearchViaGoodsName(goodsName, pageSize, nthPage);
            result.put("totalElements", goods.getTotalElements());
            result.put("totalPages", goods.getTotalPages());
            result.put("goods", goods.getContent());
            return ResponseObject.success(result);
        } catch (Exception e) {
            log.error("getProductById ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
    }



    @RequestMapping(value = "/new", method = RequestMethod.POST)
    @ResponseBody
    public ResponseObject newProduct(@RequestBody Map<String, String> paramMap) {
        try {
            Goods goods = new Goods();
            if(paramMap.containsKey("goodsId") && StringUtils.isNotBlank(paramMap.get("goodsId"))) {
                goods.setId(Long.parseLong(paramMap.get("goodsId")));
            }
            goods.setGoodsName(paramMap.get("goodsName"));
            goods.setGoodsPrice(new BigDecimal(paramMap.get("goodsPrice")));
            goods.setGoodsHeadline(paramMap.get("goodsHeadline"));
            goods.setGoodsDescription(paramMap.get("goodsDescription"));
            goods.setGoodsDiscount(new BigDecimal(paramMap.get("goodsDiscount")));
            goods.setGoodsSales(0L);
            goods.setCategory(Constant.STRING_2_CATEGORY.get(paramMap.get("goodsCategory")));
            goods.setGoodsNum(Long.valueOf(paramMap.get("goodsNum")));
            goods.setGoodsDetailImages(paramMap.get("goodsDetailImages"));
            goods.setGoodsCurrStatus(Constant.STATUS_STRING_2_OBJECT.get(paramMap.get("goodsCurrStatus")));
            goods.setSeller(sellerService.findSellerById(paramMap.get("sellerId")));
            boolean saveGoods = goodsService.saveGoods(goods);
            if(saveGoods) {
                return ResponseObject.success();
            } else {
                return ResponseObject.error();
            }
        } catch (Exception e) {
            log.error("newProduct ERROR=>{}",e.getMessage(), e);
            return ResponseObject.error();
        }
    }


}
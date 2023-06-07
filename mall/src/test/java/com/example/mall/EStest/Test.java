package com.example.mall.EStest;


import com.alibaba.fastjson.JSON;
import com.example.mall.POJO.DTO.Person;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.util.EntityUtils;
import org.apache.lucene.search.TotalHits;
import org.elasticsearch.ElasticsearchException;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.admin.cluster.health.ClusterHealthRequest;
import org.elasticsearch.action.admin.cluster.health.ClusterHealthResponse;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.admin.indices.stats.IndicesStatsRequest;
import org.elasticsearch.action.admin.indices.stats.IndicesStatsResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.search.ShardSearchFailure;
import org.elasticsearch.action.support.replication.ReplicationResponse;
import org.elasticsearch.client.*;
import org.elasticsearch.client.indices.GetIndexRequest;
import org.elasticsearch.action.admin.indices.get.GetIndexResponse;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.support.master.AcknowledgedResponse;
import org.elasticsearch.client.indices.CreateIndexRequest;  //
import org.elasticsearch.client.indices.CreateIndexResponse;
import org.elasticsearch.cluster.health.ClusterHealthStatus;
import org.elasticsearch.cluster.health.ClusterIndexHealth;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.common.xcontent.XContentFactory;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.*;
import org.elasticsearch.rest.RestStatus;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.joda.time.DateTime;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;

/*
注意使用
org.elasticsearch.client.indices.CreateIndexRequest属于Elasticsearch高级别客户端库（RestHighLevelClient）
 */

@RunWith(SpringRunner.class)
@SpringBootTest
@Slf4j
public class Test {
    @Autowired
    private RestHighLevelClient highLevelClient;
    final static String INDEX_NAME = "test_index";
    @org.junit.Test
    public void connectAndIndex() throws IOException {
        String jsonObject = "{\"age\":15,\"dateOfBirth\":14714660726564,"
                +"\"fullName\":\"Joh42n Doe\"}";
        IndexRequest request = new IndexRequest(INDEX_NAME);
        request.source(jsonObject, XContentType.JSON);

        IndexResponse response = highLevelClient.index(request, RequestOptions.DEFAULT);
        String index = response.getIndex();
        long version = response.getVersion();
        assertEquals(DocWriteResponse.Result.CREATED, response.getResult());
        assertEquals(1, version);
        assertEquals(INDEX_NAME, index);
        log.info("!!!!!!!!!!!res:{}", response);
    }


    @org.junit.Test
    public void indexOne() throws IOException {
        Map<String, Object> jsonMap = new HashMap<>();
        // 对于一个java model, 把字段加入到map中
        jsonMap.put("user", null);
        jsonMap.put("postDate", new Date());
        jsonMap.put("message", null);
        IndexRequest indexRequest = new IndexRequest("posts")
                .id("2").source(jsonMap); // 这里需要抓取错误, 在create的时候不允许重复的id
        IndexResponse response = highLevelClient.index(indexRequest, RequestOptions.DEFAULT);
        log.info("res=> {}", response);
        String index = response.getIndex();
        long version = response.getVersion();
        assertEquals(DocWriteResponse.Result.CREATED, response.getResult());
        assertEquals(1, version);
        assertEquals("posts", index);
    }

    @org.junit.Test
    public void query() throws IOException {
        String indexName = "twitter";
        SearchRequest searchRequest = new SearchRequest(indexName); // 指定index搜索
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder(); // 搜索条件
//        searchSourceBuilder.sort(new FieldSortBuilder("orderTime").order(SortOrder.DESC)); // 搜索结果按时间排序
        searchSourceBuilder.size(999);
        searchSourceBuilder.from(0);
        searchRequest.source(searchSourceBuilder);
        SearchResponse searchResponse = highLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        // 搜索响应的状态

        SearchHits hits = searchResponse.getHits();
        TotalHits totalHits = hits.getTotalHits();
        long numHits = totalHits.value; // 结果数量
        System.out.println("数量:"+numHits);
        SearchHit[] searchHits = hits.getHits();
        for (SearchHit hit : searchHits) {
            Map<String, Object> sourceAsMap = hit.getSourceAsMap();
            System.out.println("结果"+sourceAsMap);
        }
    }
    public static String convertToESTime(String dateString) {
        // 字符串转日期
        LocalDateTime dateTime = LocalDateTime.parse(dateString, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        return dateTime.format(formatter);
    }
    @org.junit.Test
    public void numberOfShards() throws IOException {
        String indexName = "order_test";
        ClusterHealthRequest healthRequest = new ClusterHealthRequest(indexName);
        ClusterHealthResponse healths = highLevelClient.cluster().health(healthRequest, RequestOptions.DEFAULT);
        System.out.println(healths.toString());
        String clusterName = healths.getClusterName();
        int numberOfDataNodes = healths.getNumberOfDataNodes();
        int numberOfNodes = healths.getNumberOfNodes();
        int numberOfShards = healths.getActiveShards();
        Map<String, ClusterIndexHealth> map = healths.getIndices();
        Request request = new Request("GET", "/_cat/nodes?v");
        Response response = highLevelClient.getLowLevelClient().performRequest(request);
        String responseBody = EntityUtils.toString(response.getEntity());
        System.out.println("responseBody:\n"+responseBody);
        JsonNode jsonNode = new ObjectMapper().readTree(responseBody);

        List<Node> nodes  = highLevelClient.getLowLevelClient().getNodes();
        String masterHost = null;

        for (Node node : nodes) {
            System.out.println(node.toString());
        }
    }
    @org.junit.Test
    public void advancedSearch() throws IOException {
        String indexName = "twitter";
        SearchRequest searchRequest = new SearchRequest(indexName); // 指定index搜索

        BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
        // 添加查询条件
        // 1. 指定字段
        boolQueryBuilder.must(QueryBuilders.matchQuery("fullName", "TEST3"));
        boolQueryBuilder.must(QueryBuilders.matchQuery("number", "20230503"));
        // 2. 时间范围
        RangeQueryBuilder rangeQueryBuilder = QueryBuilders.rangeQuery("dateOfBirth")
                .gte(convertToESTime("2022-05-18 16:58:03"))
                .lte(convertToESTime("2026-05-24 16:58:03"));
        boolQueryBuilder.filter(rangeQueryBuilder);

        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder(); // 搜索条件
        searchSourceBuilder.query(boolQueryBuilder);
        searchSourceBuilder.sort(new FieldSortBuilder("dateOfBirth").order(SortOrder.DESC)); // 搜索结果按时间排序
        searchRequest.source(searchSourceBuilder);
        SearchResponse searchResponse = highLevelClient.search(searchRequest, RequestOptions.DEFAULT);

        SearchHits hits = searchResponse.getHits();
        SearchHit[] searchHits = hits.getHits();
        for (SearchHit hit : searchHits) {
            // do something with the SearchHit
            Map<String, Object> sourceAsMap = hit.getSourceAsMap();
            sourceAsMap.put("score",hit.getScore());
            System.out.println(sourceAsMap);
        }

    }

    public static LocalDateTime convertStringToDateTime(String dateString) {
        // 定义时间字符串的格式
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        return LocalDateTime.parse(dateString, formatter);
    }
    @org.junit.Test
    public void documentOne() throws IOException {
        String indexName = "twitter";
        ObjectMapper objectMapper = new ObjectMapper();

        for (int i = 1; i <= 19; i++) {
            Random random = new Random();
            int randomNumber = random.nextInt(4);
            String timeStr = LocalDateTime.now().plusDays(-i).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            LocalDateTime dateTime = convertStringToDateTime(timeStr);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
            String outputDateStr = dateTime.format(formatter);
            Person person = new Person((long)i, outputDateStr, null,null);
            HashMap<String, Object> map = objectMapper.convertValue(person, new TypeReference<HashMap<String, Object>>() {});
            String jsonString = objectMapper.writeValueAsString(map);
//            Map<String, Object> jsonMap = new HashMap<>();
//            // 对于一个java model, 把字段加入到map中
//            jsonMap.put("age", (long) i);
//            jsonMap.put("dateOfBirth", new DateT);
//            jsonMap.put("fullName", "TEST_NAME");
//            jsonMap.put("number", String.valueOf(20230500+i));
            IndexRequest indexRequest = new IndexRequest(indexName)
                    .id(String.valueOf(i)).source(jsonString, XContentType.JSON); // 这里需要抓取错误, 在create的时候不允许重复的id
            IndexResponse response = highLevelClient.index(indexRequest, RequestOptions.DEFAULT);
            log.info("res=> {}", response);
            String index = response.getIndex();
            long version = response.getVersion();
            assertEquals(DocWriteResponse.Result.CREATED, response.getResult());
            assertEquals(1, version);
            assertEquals(indexName, index);
        }

    }
    @org.junit.Test
    public void createIndex() throws IOException {
        CreateIndexRequest request = new CreateIndexRequest("twitter");
        request.settings(Settings.builder()
                .put("index.number_of_shards", 3)
                .put("index.number_of_replicas", 1)
        );
        // 设定该index的属性
        XContentBuilder builder = XContentFactory.jsonBuilder();
        builder.startObject();
        {
            builder.field("dynamic", "strict"); // "strict" 插入新字段报错; false 新字段不会被插入, 只插入旧字段, 不报错
            builder.startObject("properties");
            {
                // 添加字段映射
                builder.startObject("age");
                {
                    builder.field("type", "long");
                }
                builder.endObject();
                builder.startObject("dateOfBirth");
                {
                    builder.field("type", "date");
                }
                builder.endObject();
                builder.startObject("fullName");
                {
                    builder.field("type", "text");
                }
                builder.endObject();
                builder.startObject("number");
                {
                    builder.field("type", "keyword");
                }
                builder.endObject();
            }
            builder.endObject();
        }
        builder.endObject();
        request.mapping(builder);
        CreateIndexResponse createIndexResponse = highLevelClient.indices().create(request, RequestOptions.DEFAULT);
        boolean acknowledged = createIndexResponse.isAcknowledged();
        boolean shardsAcknowledged = createIndexResponse.isShardsAcknowledged();
        System.out.println("res=>" + createIndexResponse.toString());
        System.out.println("acknowledged:" + acknowledged + " shardsAcknowledged:" + shardsAcknowledged);
    }

    @org.junit.Test
    public void ifIndexExist() throws IOException {
        String indexName = "twitter";
        boolean res =  highLevelClient.indices().exists(new GetIndexRequest(indexName), RequestOptions.DEFAULT);
        System.out.println("res=>"+res);
    }

    @org.junit.Test
    public void deleteIndex() throws IOException {
        String indexName = "twitter";
        AcknowledgedResponse response = highLevelClient.indices().delete(new DeleteIndexRequest(indexName), RequestOptions.DEFAULT);
        log.info("!!!!!!!!!!res:{}", response);
    }

    @org.junit.Test
    public void deleteDocumentById() throws IOException {
        String indexName = "twitter";
        String id = "1";
        DeleteRequest request = new DeleteRequest(indexName, id);
        DeleteResponse deleteResponse = highLevelClient.delete(request, RequestOptions.DEFAULT);
        if (deleteResponse.getResult() == DocWriteResponse.Result.NOT_FOUND) {
            System.out.println("不存在");
        }
        ReplicationResponse.ShardInfo shardInfo = deleteResponse.getShardInfo();
        if (shardInfo.getTotal() != shardInfo.getSuccessful()) {
            System.out.println("分片错误");
        }
        if (shardInfo.getFailed() > 0) {
            for (ReplicationResponse.ShardInfo.Failure failure :
                    shardInfo.getFailures()) {
                String reason = failure.reason();
                System.out.println("失败:"+reason);
            }
        }
    }

    @org.junit.Test
    public void getOne() throws IOException {
        GetRequest getRequest = new GetRequest(
                "posts",
                "2");
        GetResponse getResponse = null;
        try {
            getResponse = highLevelClient.get(getRequest, RequestOptions.DEFAULT);
        } catch (ElasticsearchException e) {
            if (e.status() == RestStatus.NOT_FOUND) {
                // 没有找到该index
                System.out.println("没有找到该index!");
                return;
            }
        }
        // 处理get response
        assert getResponse != null;
        String index = getResponse.getIndex();
        String id = getResponse.getId();
        if (getResponse.isExists()) {
            long version = getResponse.getVersion();
            String sourceAsString = getResponse.getSourceAsString();
            Map<String, Object> sourceAsMap = getResponse.getSourceAsMap();
            System.out.println(sourceAsMap.toString());
            byte[] sourceAsBytes = getResponse.getSourceAsBytes();
        } else {
            // 当没有找到该数据的时候的处理逻辑System.out.println("没有找到该index!");
            System.out.println("没有找到符合条件的数据!");
        }
    }


    @org.junit.Test
    public void existsIndex() throws IOException {
//        StreamInput streamInput = new StreamInput() {
//        }
//        GetIndexRequest getIndexRequest = new GetIndexRequest(INDEX_NAME);
//        boolean exists = highLevelClient.indices().exists(getIndexRequest, RequestOptions.DEFAULT);
//        if (exists) {
//            System.out.println("存在");
//        } else {
//            System.out.println("不存在");
//        }
    }

    @org.junit.Test
    public void search() throws IOException {
        SearchRequest searchRequest = new SearchRequest();
        SearchResponse response = highLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        SearchHit[] searchHits = response.getHits().getHits();
        List<Person> results =
                Arrays.stream(searchHits)
                        .map(hit -> JSON.parseObject(hit.getSourceAsString(), Person.class))
                        .collect(Collectors.toList());
        results.forEach(res->{log.info("{}", res.toString());});
    }





    @org.junit.Test
    public void indexingAndAdding() throws IOException {

    }

    @org.junit.Test
    public void showAllIndex() throws IOException {
//        GetIndexRequest request = new GetIndexRequest();
//        GetIndexResponse response = highLevelClient.indices().get(request, RequestOptions.DEFAULT);
//        String[] indices = response.getIndices();
//        Arrays.stream(indices).forEach(item->{log.info("{}", item);});

    }
}

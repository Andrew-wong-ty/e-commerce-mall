package com.example.mall.config;

import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.Credentials;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.DefaultConnectionKeepAliveStrategy;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class ElasticConfig {
    @Bean
    public RestHighLevelClient restHighLevelClient() {
        /*
        * http://10.125.11.140:34877, http://10.125.129.57:34877, http://10.125.128.38:34877
        * */
        List<HttpHost> httpHosts = Arrays.asList(
                new HttpHost("10.125.11.140", 34877, "http"),
                new HttpHost("10.125.129.57", 34877, "http"),
                new HttpHost("10.125.128.38", 34877, "http")
        );
        String username = "elastic";
        String password = "hvZ6V0@7#lG";
        BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(username, password));
        RestClientBuilder builder = RestClient.builder(httpHosts.toArray(new HttpHost[0]))
                .setHttpClientConfigCallback(httpClientBuilder -> httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider));

        return new RestHighLevelClient(builder);

//        List<HttpHost> httpHosts = Arrays.asList(
//                new HttpHost("10.125.11.140", 34877, "http"),
//                new HttpHost("10.125.129.57", 34877, "http"),
//                new HttpHost("10.125.128.38", 34877, "http")
//        );
//        String username = "elastic";
//        String password = "hvZ6V0@7#lG";
//        BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
//        credentialsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(username, password));
//        RestClientBuilder builder = RestClient.builder(httpHosts.toArray(new HttpHost[0]))
//                .setHttpClientConfigCallback(httpAsyncClientBuilder -> {
//                    httpAsyncClientBuilder.setDefaultCredentialsProvider(credentialsProvider); // 配置用户名密码
//                    httpAsyncClientBuilder.setKeepAliveStrategy(DefaultConnectionKeepAliveStrategy.INSTANCE);
//                    return httpAsyncClientBuilder;
//                });
//        return new RestHighLevelClient(builder);

    }
}

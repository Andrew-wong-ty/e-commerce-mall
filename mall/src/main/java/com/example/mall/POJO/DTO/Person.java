package com.example.mall.POJO.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Person {
    private Long age;
    private String dateOfBirth;
    private String fullName;
    private String number;
}

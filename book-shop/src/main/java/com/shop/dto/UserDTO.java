package com.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long userId;

    private String name;

    private String email;

    private String password;

    private String phone;

    private String address;

    private Boolean gender;

    private String image;

    private LocalDate registerDate;

    private Boolean status;

    private String token;

    private String birthday;
}

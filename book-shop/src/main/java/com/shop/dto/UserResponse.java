package com.shop.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.shop.common.Constant;
import com.shop.entitty.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

import static com.shop.utils.Common.formatDateComponents;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
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

    public void setUserResponse(User user){
        this.userId = user.getUserId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.phone = user.getPhone();
        this.address = user.getAddress();
        this.gender = user.getGender();
        this.image = user.getImage();
        this.registerDate = user.getRegisterDate();
        this.status = user.getStatus();
        this.token = user.getToken();
        this.birthday = user.getBirthday() != null ? formatDateComponents(user.getBirthday()) : null;
    }

}

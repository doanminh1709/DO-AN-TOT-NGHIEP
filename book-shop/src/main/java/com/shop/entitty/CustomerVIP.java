package com.shop.entitty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerVIP {

    private String image;

    private Long msk;

    private String name;

    private Long totalAmount;
}
